'use client'
import Link from 'next/link'
import { useEffect,useMemo,useState } from 'react'
import { Camera,Check,ChevronRight,Droplets,LayoutGrid,List,LocateFixed,MapPin,Plus,ShieldCheck,UploadCloud } from 'lucide-react'
import { statusNames,uid,isoInDays,metrics,type Tree,type TreeStatus,type Verification,type Campaign } from '@/lib/treedam/types'
import { demoPeople } from '@/lib/treedam/seed'
import { storePhoto } from '@/lib/treedam/photos'
import { careGuidance,demoWeather } from '@/lib/treedam/integrations'
import { useWorkspace } from './WorkspaceProvider'
import { DemoMap } from './DemoMap'
import { Badge,Button,Card,Empty,Field,Input,Modal,Notice,Photo,Select,Textarea } from './ui'
import { treedamConfig } from '@/config/treedam'

export const statusTone=(status:TreeStatus)=>status==='verified'?'green':status==='at-risk'?'rose':status==='to-verify'?'purple':'blue'
export function StatusBadge({tree}:{tree:Tree}) {return <Badge tone={statusTone(tree.status)}>{statusNames[tree.status]}</Badge>}
export function scopedTrees(trees:Tree[],profile:{id:string;role:string;organization?:string},campaigns?:Campaign[]) {
  if(profile.role==='individual')return trees.filter(t=>t.planterId===profile.id)
  if(profile.role==='csr'&&campaigns){const ids=campaigns.filter(c=>c.sponsor===profile.organization).map(c=>c.id);return trees.filter(t=>ids.includes(t.campaignId))}
  return trees
}
const date=(value:string)=>new Date(value).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})

export function TreeList({trees,onSelect,compact=false}:{trees:Tree[];onSelect:(id:string)=>void;compact?:boolean}) {
  if(!trees.length)return <Empty><Link className="btn btn-primary" href="/app/add-tree"><Plus size={14} />Add a tree</Link></Empty>
  return <div className="overflow-x-auto"><table className="product-table"><thead><tr><th>Tree / plot</th><th>Status</th>{!compact&&<><th>Planter</th><th>Location</th></>}<th>Survivors</th><th><span className="sr-only">Open tree</span></th></tr></thead>
    <tbody>{trees.map(tree=><tr key={tree.id}>
      <td><button className="flex items-center gap-3 text-left" onClick={()=>onSelect(tree.id)}><Photo source={tree.photo} alt={`${tree.species} planting`} className="h-10 w-10 shrink-0" /><span><strong className="block font-semibold">{tree.species}{tree.isPlot?' plot':''}</strong><small className="mt-1 block text-app-muted">{tree.quantity} {tree.quantity===1?'tree':'trees'} · {date(tree.plantedAt)}</small></span></button></td>
      <td><StatusBadge tree={tree} /></td>{!compact&&<><td>{tree.planterName}</td><td><span className="line-clamp-2 max-w-48 text-app-muted">{tree.location}</span></td></>}
      <td><span className="font-medium">{tree.verifiedCount}</span><small className="ml-1 text-app-muted">/ {tree.quantity}</small></td>
      <td><Button variant="secondary" aria-label={`Open ${tree.species} tree details`} onClick={()=>onSelect(tree.id)}><ChevronRight size={14} /></Button></td>
    </tr>)}</tbody></table></div>
}

export function TreesView({onSelect,mapOnly=false}:{onSelect:(id:string)=>void;mapOnly?:boolean}) {
  const {workspace,profile,mutate,notify}=useWorkspace()
  const [query,setQuery]=useState(''),[status,setStatus]=useState('all'),[view,setView]=useState<'list'|'board'>(mapOnly?'list':'board'),[dragging,setDragging]=useState('')
  const trees=scopedTrees(workspace!.trees,profile!,workspace!.campaigns).filter(tree=>`${tree.species} ${tree.planterName} ${tree.location}`.toLowerCase().includes(query.toLowerCase())&&(status==='all'||tree.status===status))
  const boardStatuses:TreeStatus[]=['to-plant','growing','to-verify','verified']
  const move=async(next:TreeStatus)=> {
    if(!dragging)return
    if(next==='verified'){notify('Upload a survival proof to verify a tree. A drag cannot create evidence.');return}
    try{await mutate(current=>{const tree=current.trees.find(t=>t.id===dragging)!;tree.status=next;tree.verifiedCount=0;return current})}catch(cause){notify(cause instanceof Error?cause.message:'Could not update this record.')}
    setDragging('')
  }
  return <div className="space-y-5">
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex w-full flex-wrap gap-3 sm:w-auto"><Input aria-label="Search tree records" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search species, planter or plot" className="sm:max-w-64" /><Select aria-label="Filter trees by status" value={status} onChange={event=>setStatus(event.target.value)} className="sm:max-w-40"><option value="all">All statuses</option>{Object.entries(statusNames).map(([key,label])=><option value={key} key={key}>{label}</option>)}</Select></div>
      <div className="flex items-center gap-2">{!mapOnly&&<><Button variant="secondary" aria-pressed={view==='board'} aria-label="Board view" onClick={()=>setView('board')}><LayoutGrid size={15} /></Button><Button variant="secondary" aria-pressed={view==='list'} aria-label="List view" onClick={()=>setView('list')}><List size={15} /></Button></>}<Link href="/app/add-tree" className="btn btn-primary"><Plus size={14} />Add tree</Link></div>
    </Card>
    <Card><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Your planting map</h2><Badge tone="blue">Simulated map</Badge></div><DemoMap trees={trees} onSelect={onSelect} /></Card>
    {!mapOnly&&(view==='list'?<Card><TreeList trees={trees} onSelect={onSelect} /></Card>:<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{boardStatuses.map(column=> {
      const items=trees.filter(t=>t.status===column||(column==='to-verify'&&t.status==='at-risk'))
      return <div key={column} className="min-h-64 rounded-2xl border border-app-border bg-white p-3" onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();void move(column)}}>
        <div className="mb-4 flex items-center justify-between px-1"><h3 className="text-sm font-semibold">{statusNames[column]}</h3><Badge>{items.reduce((n,t)=>n+t.quantity,0)} trees</Badge></div>
        <div className="space-y-3">{items.map(tree=><article key={tree.id} draggable onDragStart={()=>setDragging(tree.id)} onDragEnd={()=>setDragging('')} className="rounded-xl border border-app-border p-3 shadow-panel">
          <button className="w-full text-left" onClick={()=>onSelect(tree.id)}><Photo source={tree.photo} alt={`${tree.species} planting record`} className="mb-3 aspect-[16/10]" /><StatusBadge tree={tree} /><h4 className="mb-1 mt-3 text-sm font-semibold">{tree.species}{tree.isPlot?' plot':''}</h4><p className="text-xs leading-relaxed text-app-muted">{tree.quantity} planted · {tree.verifiedCount} demo survivors</p><p className="mt-3 flex items-center gap-1 text-xs text-app-muted"><MapPin size={12} />{tree.location.split(',')[0]}</p></button>
        </article>)}{!items.length&&<p className="px-2 py-8 text-center text-xs text-app-muted">No trees in this stage.</p>}</div>
      </div>
    })}</div>)}
  </div>
}

export function AddTreeView() {
  const {workspace,profile,addTree}=useWorkspace()
  const [bulk,setBulk]=useState(false),[file,setFile]=useState<File|null>(null),[preview,setPreview]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState('')
  const [point,setPoint]=useState<{lat:number;lng:number}>({...treedamConfig.demo.center}),[locationType,setLocationType]=useState('Simulated point · Skardu'),[gpsBusy,setGpsBusy]=useState(false)
  useEffect(()=>{if(!file){setPreview('');return}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url)},[file])
  const capture=()=> {
    setError('')
    if(!navigator.geolocation){setError('GPS is unavailable in this browser. Choose a clearly labeled demo point instead.');return}
    setGpsBusy(true)
    navigator.geolocation.getCurrentPosition(position=>{setPoint({lat:position.coords.latitude,lng:position.coords.longitude});setLocationType(`Device GPS captured · ±${Math.round(position.coords.accuracy)}m`);setGpsBusy(false)},()=>{setError('GPS permission was denied or a location could not be found. You can still choose a simulated map point.');setGpsBusy(false)},{enableHighAccuracy:true,timeout:15000,maximumAge:0})
  }
  return <div className="grid items-start gap-5 xl:grid-cols-5"><Card className="xl:col-span-3">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Give a tree its first record.</h2><p className="mt-1 text-xs text-app-muted">One photo. One location. A lasting planting promise.</p></div><Badge tone="blue">Demo record</Badge></div>
    <div className="mb-6 grid grid-cols-2 gap-2"><Button variant={!bulk?'primary':'secondary'} aria-pressed={!bulk} onClick={()=>setBulk(false)}>Single tree</Button><Button variant={bulk?'primary':'secondary'} aria-pressed={bulk} onClick={()=>setBulk(true)}>Bulk plot</Button></div>
    <form className="grid gap-5" onSubmit={async event=> {
      event.preventDefault();setError('');setSuccess('')
      if(!file){setError('Add a planting photo first.');return}
      const formElement=event.currentTarget,form=new FormData(formElement),quantity=bulk?Number(form.get('quantity')):1
      if(!Number.isInteger(quantity)||quantity<1||quantity>1000000){setError('Enter a whole tree count between 1 and 1,000,000.');return}
      setBusy(true)
      try{
        const photo=await storePhoto(file,profile!.provider)
        const planterId=String(form.get('planter')||profile!.id)
        const selectedDate=String(form.get('date')),plantedAt=selectedDate===new Date().toISOString().slice(0,10)?new Date().toISOString():new Date(selectedDate+'T12:00:00').toISOString()
        await addTree({species:String(form.get('species')),quantity,isPlot:bulk,...point,photo,location:String(form.get('location')).trim(),plantedAt,status:'growing',planterId,planterName:demoPeople.find(p=>p.id===planterId)?.name||profile!.name,campaignId:String(form.get('campaign')||''),competitionId:String(form.get('competition')||''),nextWaterAt:isoInDays(0),notes:String(form.get('notes')||'')})
        setFile(null);formElement.reset();setSuccess(bulk?'Your demo plot has been added. Upload survival evidence later and request an audited survivor count.':'Your demo tree has been added to My Trees.')
      }catch(cause){setError(cause instanceof Error?cause.message:'Could not save this planting.')}finally{setBusy(false)}
    }}>
      <Field label="Planting photo" hint="JPG, PNG or WebP · up to 8 MB. Demo uploads stay in this browser unless you are using a configured Supabase account."><div className="rounded-xl border border-dashed border-app-border bg-app-canvas/50 p-5">{preview?<Photo source={preview} alt="Selected planting photo" className="mb-3 aspect-[16/9]" />:<div className="mb-3 flex items-center justify-center gap-2 py-8 text-app-muted"><UploadCloud size={25} /><span className="text-xs">Record the beginning of your tree’s story.</span></div>}<Input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={event=>{setFile(event.target.files?.[0]||null);if(event.target.files?.[0])capture()}} /></div></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Species"><Select name="species" required>{['Chinar','Blue Pine','Willow','Apricot','Walnut','Poplar','Mango','Other'].map(s=><option key={s}>{s}</option>)}</Select></Field><Field label="Planting date"><Input name="date" type="date" defaultValue={new Date().toISOString().slice(0,10)} max={new Date().toISOString().slice(0,10)} required /></Field></div>
      {bulk&&<><Field label="Total trees in this plot"><Input name="quantity" type="number" min={1} max={1000000} step={1} required placeholder="e.g. 250" /></Field><Notice>One photo and GPS point can register the whole plot. It does not prove every tree is alive; bulk verification needs an audited survivor count.</Notice></>}
      <Field label="Location name"><Input name="location" required maxLength={180} placeholder="e.g. University nursery, Skardu" /></Field>
      <div className="grid gap-3 sm:grid-cols-2"><Field label="Latitude"><Input type="number" step="any" min={-90} max={90} value={point.lat} required onChange={event=>{setPoint({...point,lat:Number(event.target.value)});setLocationType('Manually entered demo coordinates')}} /></Field><Field label="Longitude"><Input type="number" step="any" min={-180} max={180} value={point.lng} required onChange={event=>{setPoint({...point,lng:Number(event.target.value)});setLocationType('Manually entered demo coordinates')}} /></Field></div>
      <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-app-muted">{locationType}</span><Button type="button" variant="secondary" busy={gpsBusy} onClick={capture}><LocateFixed size={14} />Capture GPS</Button></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Campaign"><Select name="campaign"><option value="">Independent planting</option>{workspace!.campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field><Field label="Competition"><Select name="competition"><option value="">No competition</option>{workspace!.competitions.filter(c=>!c.completed).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field></div>
      {profile!.role!=='individual'&&<Field label="Assigned planter"><Select name="planter">{demoPeople.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>}
      <Field label="Notes"><Textarea name="notes" rows={3} maxLength={1200} placeholder="Add any useful care or planting details." /></Field>
      {error&&<Notice tone="rose">{error}</Notice>}{success&&<Notice>{success} <Link href="/app/trees" className="font-semibold underline">View My Trees</Link></Notice>}
      <Button type="submit" busy={busy} disabled={gpsBusy}><Plus size={15} />{bulk?'Add demo plot':'Add demo tree'}</Button>
    </form>
  </Card><div className="space-y-5 xl:col-span-2"><Card><h2 className="mb-4 font-semibold">Choose a planting point</h2><DemoMap trees={workspace!.trees} onPick={(lat,lng)=>{setPoint({lat:+lat.toFixed(6),lng:+lng.toFixed(6)});setLocationType('Simulated map point · not device GPS')}} /><p className="mt-3 text-xs leading-relaxed text-app-muted">Tap this schematic to pick a demo location, or capture real GPS with your browser’s permission.</p></Card><Card><span className="mb-3 inline-flex rounded-xl bg-app-green-soft p-3 text-app-green"><ShieldCheck size={22} /></span><h3 className="font-semibold">A planting is only the beginning.</h3><p className="mt-3 text-sm leading-relaxed text-app-muted">Your tree starts as Growing. It counts as a demo survivor only after a simulated survival check or reviewed plot proof.</p></Card></div></div>
}

export function CareView() {
  const {workspace,profile,waterTree}=useWorkspace(),[error,setError]=useState(''),[busy,setBusy]=useState('')
  const trees=scopedTrees(workspace!.trees,profile!,workspace!.campaigns).filter(t=>t.status!=='to-plant')
  const weather=demoWeather()
  return <div className="space-y-5"><Card className="soft-panel-glow"><div className="flex flex-wrap items-center justify-between gap-3"><div><Badge tone="blue">Simulated weather</Badge><h2 className="mt-3 text-xl font-semibold">{weather.temperature}°C · {weather.condition}</h2><p className="mt-2 text-xs text-app-muted">{weather.location} · Humidity {weather.humidity}% · Rain {weather.rainMm} mm</p></div><Droplets size={40} className="text-app-indigo/40" /></div></Card><Notice>Care guidance is a demo schedule, not live weather or AI agronomic advice. Check soil moisture, local conditions and species-specific guidance in the field.</Notice>{error&&<Notice tone="rose">{error}</Notice>}
    <div className="grid gap-4 lg:grid-cols-2">{trees.map(tree=>{const guidance=careGuidance(tree),due=new Date(tree.nextWaterAt).getTime()<=Date.now();return <Card key={tree.id}><div className="mb-4 flex items-center gap-3"><Photo source={tree.photo} alt={`${tree.species} care record`} className="h-14 w-14 shrink-0" /><div><h3 className="font-semibold">{tree.species}{tree.isPlot?' plot':''}</h3><p className="mt-1 text-xs text-app-muted">{tree.quantity} {tree.isPlot?'trees in plot':'tree'} · {tree.location}</p></div></div><div className="mb-4 flex flex-wrap gap-2"><Badge tone={due?'rose':'green'}>{due?'Care due':'Next: '+date(tree.nextWaterAt)}</Badge><Badge tone="blue">Demo schedule</Badge></div><p className="text-sm">{guidance.liters} L per tree every {guidance.everyDays} days{tree.isPlot?` · ${guidance.totalLiters} L across this plot`:''}</p><p className="mt-2 text-xs leading-relaxed text-app-muted">{guidance.nutrition}</p><div className="mt-5 flex flex-wrap gap-2">{(['water','nutrition'] as const).map(kind=><Button key={kind} variant={kind==='water'?'primary':'secondary'} busy={busy===tree.id+kind} onClick={async()=>{setBusy(tree.id+kind);setError('');try{await waterTree(tree.id,kind)}catch(cause){setError(cause instanceof Error?cause.message:'Could not record care.')}finally{setBusy('')}}}>{kind==='water'?<Droplets size={14} />:<Check size={14} />}{kind==='water'?'Mark watered':'Record nutrition'}</Button>)}</div></Card>})}</div>
    {!trees.length&&<Card><Empty /></Card>}
    <Card><h2 className="mb-4 font-semibold">Recent care activity</h2>{workspace!.careEvents.length?<div className="divide-y divide-app-border">{workspace!.careEvents.slice(0,8).map(event=><div key={event.id} className="flex items-center justify-between gap-3 py-3 text-xs"><span>{workspace!.trees.find(t=>t.id===event.treeId)?.species||'Tree'} · {event.kind==='water'?`Watered (${event.liters} L)`:'Nutrition recorded'}</span><span className="text-app-muted">{date(event.completedAt)}</span></div>)}</div>:<p className="text-sm text-app-muted">No care activity recorded yet.</p>}</Card>
  </div>
}

export function VerificationView() {
  const {workspace,profile,verifyTree}=useWorkspace(),[treeId,setTreeId]=useState(''),[file,setFile]=useState<File|null>(null),[preview,setPreview]=useState(''),[scenario,setScenario]=useState<Verification['verdict']>('alive'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false)
  const trees=scopedTrees(workspace!.trees,profile!,workspace!.campaigns).filter(t=>t.status!=='to-plant')
  const tree=trees.find(t=>t.id===treeId)||trees[0]
  useEffect(()=>{const id=window.location.hash.slice(1);if(id)setTreeId(id)},[])
  useEffect(()=>{if(!file){setPreview('');return}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url)},[file])
  if(!trees.length)return <Card><Empty title="No planted trees to check" text="Add a planting record before uploading survival evidence." /></Card>
  return <div className="grid items-start gap-5 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="font-semibold">Return. Photograph. Prove.</h2><Badge tone="purple">Simulated verification</Badge></div>
    <form className="grid gap-5" onSubmit={async event=>{event.preventDefault();setError('');setDone(false);if(!file){setError('Upload a fresh survival photo first.');return}setBusy(true);try{const photo=await storePhoto(file,profile!.provider);await verifyTree(tree.id,photo,scenario);setDone(true);setFile(null)}catch(cause){setError(cause instanceof Error?cause.message:'The demo check could not complete.')}finally{setBusy(false)}}}>
      <Field label="Select tree or plot"><Select value={tree.id} onChange={event=>{setTreeId(event.target.value);setDone(false)}}>{trees.map(item=><option key={item.id} value={item.id}>{item.species}{item.isPlot?' plot':''} — {item.location}</option>)}</Select></Field>
      <div className="grid gap-4 sm:grid-cols-2"><div><p className="mb-2 text-xs font-medium">Planting photo</p><Photo source={tree.photo} alt={`Original ${tree.species} planting photo`} /></div><div><p className="mb-2 text-xs font-medium">Fresh survival photo</p><Photo source={preview||tree.proofPhoto} alt="Fresh survival evidence preview" /></div></div>
      <Field label="Upload a fresh photo" hint="JPG, PNG or WebP · up to 8 MB"><Input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={event=>setFile(event.target.files?.[0]||null)} /></Field>
      <Field label="Demo outcome" hint="Choose a scenario to test the workflow. No actual image comparison occurs."><Select value={scenario} onChange={event=>setScenario(event.target.value as Verification['verdict'])}><option value="alive">Same tree, alive (simulated)</option><option value="at-risk">Tree at risk (simulated)</option><option value="uncertain">Uncertain — needs review (simulated)</option></Select></Field>
      {tree.isPlot&&<Notice>A single plot image cannot prove {tree.quantity} survivors. A passing demo check goes to the NGO / Government queue for an audited count.</Notice>}
      {error&&<Notice tone="rose">{error}</Notice>}{done&&<Notice><strong>Simulation complete.</strong> {tree.status==='verified'?'This single tree now counts as a demo survivor.':tree.status==='at-risk'?'This tree is marked At Risk and excluded from survivor counts.':'This proof is waiting for review.'} No Gemini request was made.</Notice>}
      <Button type="submit" busy={busy}><ShieldCheck size={15} />{busy?'Running demo check…':'Run simulated survival check'}</Button>
    </form></Card><div className="space-y-5"><Card><h3 className="font-semibold">What a real check should prove</h3><ul className="mt-4 space-y-4 text-xs leading-relaxed text-app-muted">{['The follow-up photo shows the same tree or plot.','The location and evidence belong to the planting record.','Living growth is supported by fresh evidence.','Uncertain photos and bulk counts receive human review.'].map(text=><li className="flex gap-2" key={text}><Check size={14} className="shrink-0 text-app-green" />{text}</li>)}</ul></Card><Notice>This demo does not detect fraud, identify species, or prove survival. Do not use simulated results for real funding or carbon claims.</Notice></div></div>
}

export function TreeDetails({treeId,onClose}:{treeId:string;onClose:()=>void}) {
  const {workspace,mutate,notify}=useWorkspace(),[busy,setBusy]=useState(false),[error,setError]=useState('')
  const tree=workspace!.trees.find(t=>t.id===treeId)
  if(!tree)return null
  return <Modal title={`${tree.species}${tree.isPlot?' plot':''}`} onClose={onClose} wide><div className="grid gap-5 sm:grid-cols-2"><Photo source={tree.photo} alt={`${tree.species} planting`} /><div><StatusBadge tree={tree} /><h3 className="mb-3 mt-4 text-lg font-semibold">{tree.quantity} planted · {tree.verifiedCount} demo survivors</h3><dl className="grid grid-cols-2 gap-3 text-xs"><dt className="text-app-muted">Planter</dt><dd>{tree.planterName}</dd><dt className="text-app-muted">Planted</dt><dd>{date(tree.plantedAt)}</dd><dt className="text-app-muted">Location</dt><dd>{tree.location}</dd><dt className="text-app-muted">Coordinates</dt><dd>{tree.lat.toFixed(5)}, {tree.lng.toFixed(5)}</dd><dt className="text-app-muted">Next care</dt><dd>{date(tree.nextWaterAt)}</dd></dl>{tree.notes&&<p className="mt-4 text-xs leading-relaxed text-app-muted">{tree.notes}</p>}</div></div>
    {tree.proofPhoto&&<div className="mt-5"><p className="mb-2 text-xs font-medium">Latest survival photo · simulated evidence</p><Photo source={tree.proofPhoto} alt="Latest demo survival evidence" className="aspect-[16/9]" /></div>}
    {error&&<div className="mt-4"><Notice tone="rose">{error}</Notice></div>}
    <div className="mt-6 flex flex-wrap gap-2"><Link href={`/app/verify#${tree.id}`} className="btn btn-primary" onClick={onClose}><Camera size={14} />Check survival</Link><Link href="/app/care" onClick={onClose} className="btn btn-secondary"><Droplets size={14} />Care schedule</Link>{tree.status==='to-plant'&&<Button variant="secondary" busy={busy} onClick={async()=>{setBusy(true);try{await mutate(current=>{const row=current.trees.find(t=>t.id===tree.id)!;row.status='growing';row.plantedAt=new Date().toISOString();return current});notify('Planting date recorded. This demo tree is now Growing.')}catch(cause){setError(cause instanceof Error?cause.message:'Could not update tree.')}finally{setBusy(false)}}}>Mark planted</Button>}</div>
  </Modal>
}
