import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { cloudAvailable, treedamConfig } from '@/config/treedam'
import { roles, type Profile, type Role, type Workspace } from './types'

let client:SupabaseClient|null=null
export function supabase() {
  if (!cloudAvailable) return null
  client ||= createClient(treedamConfig.backend.url,treedamConfig.backend.publicKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}})
  return client
}
export function requireCloud() {
  const instance=supabase()
  if(!instance) throw new Error('Supabase configuration has not been exposed to this runtime. The clearly labeled demo is available without keys.')
  return instance
}
const tables = { trees:'trees', campaigns:'campaigns', verifications:'verifications', competitions:'competitions', careEvents:'care_events', audits:'audit_requests' } as const
const names:Record<string,string>={photo:'photo_path',proofPhoto:'proof_photo_path',lat:'latitude',lng:'longitude',location:'location_name',target:'target_count',planters:'planter_names',sponsor:'sponsored_by',members:'member_names'}
const reverse=Object.fromEntries(Object.entries(names).map(([a,b])=>[b,a]))
function toRow(item:Record<string,unknown>) {
  return Object.fromEntries(Object.entries(item).map(([key,value])=>[names[key]||key.replace(/[A-Z]/g,c=>'_'+c.toLowerCase()),(key==='campaignId'||key==='competitionId')&&!value?null:typeof value==='string'&&value.startsWith('storage:')?value.slice(8):value]))
}
function fromRow(row:Record<string,unknown>) {
  return Object.fromEntries(Object.entries(row).filter(([k])=>k!=='owner_id').map(([key,value])=> {
    const name=reverse[key]||key.replace(/_([a-z])/g,(_,c:string)=>c.toUpperCase())
    return [name,(name==='campaignId'||name==='competitionId')&&value===null?'':(name==='photo'||name==='proofPhoto')&&typeof value==='string'&&!value.startsWith('/')&&!value.startsWith('http')?`storage:${value}`:value]
  }))
}
export async function readCloudProfile():Promise<Profile> {
  const db=requireCloud()
  const {data:{user},error}=await db.auth.getUser()
  if(error||!user) throw new Error('Please sign in to your Supabase account.')
  const {data,error:profileError}=await db.from('profiles').select('*').eq('id',user.id).single()
  if(profileError) throw new Error('Your Supabase profile table is not ready. The supplied schema has not been applied from this workspace.')
  return {id:user.id,name:data.display_name||'Planter',role:roles.includes(data.role)?data.role:'individual',organization:data.organization||'TREEDAM workspace',provider:'supabase'}
}
export async function readCloudWorkspace():Promise<Workspace> {
  const db=requireCloud()
  const profile=await readCloudProfile()
  const {data:row,error:profileError}=await db.from('profiles').select('workspace_revision').eq('id',profile.id).single()
  if(profileError) throw profileError
  const output:Record<string,unknown>={version:1,revision:row.workspace_revision||0}
  for(const [key,table] of Object.entries(tables)) {
    const {data,error}=await db.from(table).select('*').eq('owner_id',profile.id)
    if(error) throw new Error(`Could not read ${table}. Supabase schema setup is still required.`)
    output[key]=(data||[]).map(fromRow)
  }
  return output as Workspace
}
export async function saveCloudWorkspace(next:Workspace, previous:Workspace) {
  const payload=Object.fromEntries(Object.keys(tables).map(key=>[key,(next[key as keyof typeof tables] as unknown as Record<string,unknown>[]).map(toRow)]))
  const {data,error}=await requireCloud().rpc('save_demo_workspace',{payload,expected_revision:previous.revision})
  if(error) throw new Error('Supabase could not save this change. '+error.message)
  return Number(data)
}
export async function signUp(email:string,password:string,name:string,role:Role,organization:string) {
  const {data,error}=await requireCloud().auth.signUp({email,password,options:{data:{display_name:name,role,organization}}})
  if(error) throw error
  return data
}
export async function signIn(email:string,password:string) {
  const {data,error}=await requireCloud().auth.signInWithPassword({email,password})
  if(error) throw error
  return data
}
export async function uploadCloudPhoto(file:Blob) {
  const db=requireCloud(), {data:{user}}=await db.auth.getUser()
  if(!user)throw new Error('Sign in before uploading photos.')
  const path=`${user.id}/${crypto.randomUUID()}.jpg`
  const {error}=await db.storage.from(treedamConfig.backend.photoBucket).upload(path,file,{contentType:'image/jpeg',upsert:false})
  if(error)throw error
  return `storage:${path}`
}
export async function cloudPhotoUrl(path:string) {
  const {data,error}=await requireCloud().storage.from(treedamConfig.backend.photoBucket).createSignedUrl(path,900)
  if(error)throw error
  return data.signedUrl
}
