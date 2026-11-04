-- Prepared, not remotely executed: this workspace has no Supabase SQL tool.
-- This schema is for private, simulated demo workspaces, not real verification.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Planter',
  role text not null default 'individual' check (role in ('individual','ngo','government','csr')),
  organization text not null default '',
  workspace_revision integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.campaigns (
  id uuid primary key, owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null, area text not null, target_count integer not null check(target_count between 1 and 1000000),
  description text not null default '', planter_names text[] not null default '{}', sponsored_by text not null default '', department text not null default 'Community partners',
  created_at timestamptz not null default now(), is_demo boolean not null default true check(is_demo)
);
create table if not exists public.competitions (
  id uuid primary key, owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null, audience text not null, ends_at timestamptz not null, prize text not null default '',
  member_names text[] not null default '{}', completed boolean not null default false, results jsonb,
  is_demo boolean not null default true check(is_demo)
);
create table if not exists public.trees (
  id uuid primary key, owner_id uuid not null references public.profiles(id) on delete cascade,
  planter_id text not null, planter_name text not null, species text not null,
  quantity integer not null check(quantity between 1 and 1000000),
  verified_count integer not null default 0 check(verified_count>=0 and verified_count<=quantity),
  is_plot boolean not null default false,
  latitude double precision not null check(latitude between -90 and 90),
  longitude double precision not null check(longitude between -180 and 180),
  location_name text not null, planted_at timestamptz not null,
  status text not null check(status in ('to-plant','growing','to-verify','verified','at-risk')),
  photo_path text not null, proof_photo_path text,
  campaign_id uuid references public.campaigns(id), competition_id uuid references public.competitions(id),
  next_water_at timestamptz not null, notes text not null default '',
  is_demo boolean not null default true check(is_demo),
  check(status='verified' or verified_count=0)
);
create table if not exists public.verifications (
  id uuid primary key, owner_id uuid not null references public.profiles(id) on delete cascade,
  tree_id uuid not null references public.trees(id) on delete cascade, photo_path text not null,
  verdict text not null check(verdict in ('alive','at-risk','uncertain')),
  confidence double precision not null check(confidence between 0 and 1),
  status text not null check(status in ('pending','approved','rejected')),
  observed_count integer not null default 0 check(observed_count>=0),
  created_at timestamptz not null default now(), notes text not null default '',
  is_simulated boolean not null default true check(is_simulated)
);
create table if not exists public.care_events (
  id uuid primary key, owner_id uuid not null references public.profiles(id) on delete cascade,
  tree_id uuid not null references public.trees(id) on delete cascade,
  kind text not null check(kind in ('water','nutrition')), liters double precision not null check(liters>=0),
  completed_at timestamptz not null default now(), is_demo boolean not null default true check(is_demo)
);
create table if not exists public.audit_requests (
  id uuid primary key, owner_id uuid not null references public.profiles(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  requested_at timestamptz not null default now(), status text not null check(status in ('requested','completed')),
  notes text not null default ''
);
create index if not exists trees_owner_idx on public.trees(owner_id);
create index if not exists trees_campaign_idx on public.trees(campaign_id);
create index if not exists trees_care_idx on public.trees(owner_id,next_water_at);
create index if not exists verifications_owner_status_idx on public.verifications(owner_id,status);

create or replace function public.treedam_new_profile() returns trigger
language plpgsql security definer set search_path=public,pg_temp as $$
declare account_role text;
begin
  account_role:=coalesce(new.raw_user_meta_data->>'role','individual');
  if account_role not in ('individual','ngo','government','csr') then account_role:='individual'; end if;
  insert into public.profiles(id,display_name,role,organization)
  values(new.id,left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),'Planter'),120),account_role,left(coalesce(new.raw_user_meta_data->>'organization',''),180));
  return new;
end;
$$;
drop trigger if exists treedam_auth_profile on auth.users;
create trigger treedam_auth_profile after insert on auth.users for each row execute function public.treedam_new_profile();

alter table public.profiles enable row level security;
drop policy if exists own_profile on public.profiles;
create policy own_profile on public.profiles for select to authenticated using(id=auth.uid());
revoke all on public.profiles from anon,authenticated;
grant select on public.profiles to authenticated;

do $$
declare relation text;
begin
  foreach relation in array array['trees','campaigns','verifications','competitions','care_events','audit_requests'] loop
    execute format('alter table public.%I enable row level security',relation);
    execute format('drop policy if exists own_workspace_read on public.%I',relation);
    execute format('create policy own_workspace_read on public.%I for select to authenticated using(owner_id=auth.uid())',relation);
    execute format('revoke all on public.%I from anon,authenticated',relation);
    execute format('grant select on public.%I to authenticated',relation);
  end loop;
end $$;

-- Atomic, version-checked writes. Client data cannot change ownership, profile
-- roles, or create non-demo survival evidence. Other tenants' UUIDs are rejected.
create or replace function public.save_demo_workspace(payload jsonb,expected_revision integer)
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare actor uuid:=auth.uid(); current_revision integer; table_name text; json_key text; item jsonb; record_owner uuid;
begin
  if actor is null then raise exception 'Authentication required'; end if;
  select workspace_revision into current_revision from public.profiles where id=actor for update;
  if not found then raise exception 'Account profile is missing'; end if;
  if expected_revision is null or current_revision<>expected_revision then raise exception 'Workspace changed in another tab. Refresh before saving.'; end if;
  for table_name,json_key in values ('campaigns','campaigns'),('competitions','competitions'),('trees','trees'),('verifications','verifications'),('care_events','careEvents'),('audit_requests','audits') loop
    if coalesce(jsonb_typeof(payload->json_key),'null')<>'array' or jsonb_array_length(payload->json_key)>2000 then raise exception 'Invalid workspace payload'; end if;
    for item in select value from jsonb_array_elements(payload->json_key) loop
      record_owner:=null;
      execute format('select owner_id from public.%I where id=$1',table_name) into record_owner using (item->>'id')::uuid;
      if record_owner is not null and record_owner<>actor then raise exception 'Record belongs to another workspace'; end if;
    end loop;
  end loop;
  insert into public.campaigns(id,owner_id,name,area,target_count,description,planter_names,sponsored_by,department,created_at,is_demo)
  select r.id,actor,r.name,r.area,r.target_count,r.description,r.planter_names,r.sponsored_by,coalesce(r.department,'Community partners'),r.created_at,true
  from jsonb_populate_recordset(null::public.campaigns,payload->'campaigns') r
  on conflict(id) do update set name=excluded.name,area=excluded.area,target_count=excluded.target_count,description=excluded.description,planter_names=excluded.planter_names,sponsored_by=excluded.sponsored_by,department=excluded.department where campaigns.owner_id=actor;
  insert into public.competitions(id,owner_id,name,audience,ends_at,prize,member_names,completed,results,is_demo)
  select r.id,actor,r.name,r.audience,r.ends_at,r.prize,r.member_names,r.completed,r.results,true
  from jsonb_populate_recordset(null::public.competitions,payload->'competitions') r
  on conflict(id) do update set name=excluded.name,audience=excluded.audience,ends_at=excluded.ends_at,prize=excluded.prize,member_names=excluded.member_names,completed=excluded.completed,results=excluded.results where competitions.owner_id=actor;
  for item in select value from jsonb_array_elements(payload->'trees') loop
    if nullif(item->>'campaign_id','') is not null and not exists(select 1 from public.campaigns where id=(item->>'campaign_id')::uuid and owner_id=actor) then raise exception 'Invalid campaign'; end if;
    if nullif(item->>'competition_id','') is not null and not exists(select 1 from public.competitions where id=(item->>'competition_id')::uuid and owner_id=actor) then raise exception 'Invalid competition'; end if;
  end loop;
  insert into public.trees(id,owner_id,planter_id,planter_name,species,quantity,verified_count,is_plot,latitude,longitude,location_name,planted_at,status,photo_path,proof_photo_path,campaign_id,competition_id,next_water_at,notes,is_demo)
  select r.id,actor,r.planter_id,r.planter_name,r.species,r.quantity,r.verified_count,r.is_plot,r.latitude,r.longitude,r.location_name,r.planted_at,r.status,r.photo_path,r.proof_photo_path,r.campaign_id,r.competition_id,r.next_water_at,r.notes,true
  from jsonb_populate_recordset(null::public.trees,payload->'trees') r
  on conflict(id) do update set planter_id=excluded.planter_id,planter_name=excluded.planter_name,species=excluded.species,quantity=excluded.quantity,verified_count=excluded.verified_count,is_plot=excluded.is_plot,latitude=excluded.latitude,longitude=excluded.longitude,location_name=excluded.location_name,planted_at=excluded.planted_at,status=excluded.status,photo_path=excluded.photo_path,proof_photo_path=excluded.proof_photo_path,campaign_id=excluded.campaign_id,competition_id=excluded.competition_id,next_water_at=excluded.next_water_at,notes=excluded.notes where trees.owner_id=actor;
  for item in select value from jsonb_array_elements(payload->'verifications') union all select value from jsonb_array_elements(payload->'careEvents') loop
    if not exists(select 1 from public.trees where id=(item->>'tree_id')::uuid and owner_id=actor) then raise exception 'Invalid tree relationship'; end if;
  end loop;
  if exists(select 1 from jsonb_populate_recordset(null::public.verifications,payload->'verifications') v join public.trees t on t.id=v.tree_id where v.observed_count>t.quantity) then raise exception 'Audited survivors exceed the planted count'; end if;
  insert into public.verifications(id,owner_id,tree_id,photo_path,verdict,confidence,status,observed_count,created_at,notes,is_simulated)
  select r.id,actor,r.tree_id,r.photo_path,r.verdict,r.confidence,r.status,r.observed_count,r.created_at,r.notes,true
  from jsonb_populate_recordset(null::public.verifications,payload->'verifications') r
  on conflict(id) do update set status=excluded.status,observed_count=excluded.observed_count,notes=excluded.notes where verifications.owner_id=actor;
  insert into public.care_events(id,owner_id,tree_id,kind,liters,completed_at,is_demo)
  select r.id,actor,r.tree_id,r.kind,r.liters,r.completed_at,true
  from jsonb_populate_recordset(null::public.care_events,payload->'careEvents') r on conflict(id) do nothing;
  for item in select value from jsonb_array_elements(payload->'audits') loop
    if not exists(select 1 from public.campaigns where id=(item->>'campaign_id')::uuid and owner_id=actor) then raise exception 'Invalid audit campaign'; end if;
  end loop;
  insert into public.audit_requests(id,owner_id,campaign_id,requested_at,status,notes)
  select r.id,actor,r.campaign_id,r.requested_at,r.status,r.notes
  from jsonb_populate_recordset(null::public.audit_requests,payload->'audits') r
  on conflict(id) do update set status=excluded.status,notes=excluded.notes where audit_requests.owner_id=actor;
  update public.profiles set workspace_revision=current_revision+1 where id=actor;
  return current_revision+1;
end;
$$;
revoke all on function public.save_demo_workspace(jsonb,integer) from public,anon;
grant execute on function public.save_demo_workspace(jsonb,integer) to authenticated;

create or replace view public.leaderboard_entries with (security_invoker=true) as
select owner_id,competition_id,planter_id,max(planter_name) as planter_name,
sum(case when status='verified' then verified_count else 0 end)::integer as verified_count,
sum(case when status<>'to-plant' then quantity else 0 end)::integer as planted_count
from public.trees group by owner_id,competition_id,planter_id;
grant select on public.leaderboard_entries to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('treedam-photos','treedam-photos',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
drop policy if exists treedam_photo_read on storage.objects;
create policy treedam_photo_read on storage.objects for select to authenticated using(bucket_id='treedam-photos' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists treedam_photo_upload on storage.objects;
create policy treedam_photo_upload on storage.objects for insert to authenticated with check(bucket_id='treedam-photos' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists treedam_photo_delete on storage.objects;
create policy treedam_photo_delete on storage.objects for delete to authenticated using(bucket_id='treedam-photos' and (storage.foldername(name))[1]=auth.uid()::text);
