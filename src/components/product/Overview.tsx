'use client'
import Link from 'next/link'
import { ArrowRight,Camera,Droplets,Heart,MapPin,ShieldCheck,Sprout,Users } from 'lucide-react'
import { StatNumber } from '@/components/site/PageSections'
import { metrics,roleNames } from '@/lib/treedam/types'
import { demoWeather } from '@/lib/treedam/integrations'
import { treedamConfig } from '@/config/treedam'
import { useWorkspace } from './WorkspaceProvider'
import { Badge,Button,Card,Empty,Photo } from './ui'
import { DemoMap } from './DemoMap'
import { TreeList,scopedTrees } from './TreeViews'
import { leaderboard } from './OrganizationViews'

export function Overview({onSelect}:{onSelect:(id:string)=>void}) {
  const {workspace,profile,waterTree,notify}=useWorkspace()
  const trees=scopedTrees(workspace!.trees,profile!,workspace!.campaigns),count=metrics(trees)
  const due=trees.filter(t=>t.status!=='to-plant'&&new Date(t.nextWaterAt).getTime()<=Date.now())
  const activePlanters=new Set(trees.filter(t=>t.status!=='to-plant').map(t=>t.planterId)).size
  const csr=profile!.role==='csr',government=profile!.role==='government'
  const stats=[
    {label:csr?'Sponsored trees':government?'District demo plantings':profile!.role==='ngo'?'Trees in campaigns':'My trees planted',value:count.planted,icon:Sprout,tone:'green'},
    {label:'Demo verified alive',value:count.verified,icon:ShieldCheck,tone:'purple'},
    {label:csr?'Estimated CO₂ / year':'Survival rate',value:csr?Math.round(count.verified*treedamConfig.demo.carbonKgPerVerifiedTreePerYear):count.survival,suffix:csr?' kg':'%',icon:Heart,tone:'rose'},
    {label:profile!.role==='individual'?'Care tasks due today':government?'Plantation drives':csr?'Sponsored campaigns':'Active planters',value:profile!.role==='individual'?due.length:government?workspace!.campaigns.length:csr?workspace!.campaigns.filter(c=>c.sponsor===profile!.organization).length:activePlanters,icon:profile!.role==='individual'?Droplets:Users,tone:'blue'},
  ]
  const weather=demoWeather()
  const bins=Array.from({length:6},(_,index)=> {
    const start=Date.now()-(6-index)*7*86400000,end=start+7*86400000
    const records=trees.filter(t=>new Date(t.plantedAt).getTime()>=start&&new Date(t.plantedAt).getTime()<end)
    return {value:records.reduce((n,t)=>n+t.quantity,0),label:new Date(start).toLocaleDateString(undefined,{day:'numeric',month:'short'})}
  })
  const maximum=Math.max(1,...bins.map(b=>b.value))
  const departments=Array.from(new Set(workspace!.campaigns.map(c=>c.department||'Community partners'))).map(name=>{
    const ids=workspace!.campaigns.filter(c=>(c.department||'Community partners')===name).map(c=>c.id)
    return {name,...metrics(workspace!.trees.filter(t=>ids.includes(t.campaignId)))}
  }).sort((a,b)=>b.verified-a.verified||a.name.localeCompare(b.name))
  return <div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat,index)=>{const Icon=stat.icon;return <Card key={stat.label}><div className="flex items-center justify-between gap-2"><p className="text-xs text-app-muted">{stat.label}</p><span className={`rounded-lg p-2 ${['bg-app-green-soft text-app-green','bg-app-violet-soft text-app-purple','bg-app-rose-soft text-app-rose','bg-app-blue-soft text-app-indigo'][index]}`}><Icon size={17} /></span></div><div className="mt-4 text-3xl font-semibold tracking-tight"><StatNumber value={stat.value} suffix={stat.suffix||''} /></div><p className="mt-2 text-xs text-app-muted">{csr&&index===2?'Demo assumption, not certified credits':'From current demo records'}</p></Card>})}</div>
    <div className="grid items-start gap-5 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">{government?'District plantation map':'Every planting, in its place.'}</h2><p className="mt-1 text-xs text-app-muted">{trees.length} recorded locations · {count.planted} planted trees</p></div><Link href="/app/map" className="btn btn-secondary"><MapPin size={14} />Open map</Link></div><DemoMap trees={trees} onSelect={onSelect} /></Card>
      <div className="space-y-5"><Card className="soft-panel-glow"><div className="flex items-center justify-between gap-3"><div><Badge tone="blue">Demo weather</Badge><h2 className="mt-3 text-2xl font-semibold">{weather.temperature}° <span className="text-sm font-normal text-app-muted">{weather.condition}</span></h2><p className="mt-2 text-xs text-app-muted">{weather.location} · {weather.humidity}% humidity</p></div><Droplets size={34} className="text-app-indigo/50" /></div></Card>
      <Card><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{profile!.role==='individual'?'Care due today':'Next survival reviews'}</h2><Badge tone="purple">{profile!.role==='individual'?due.length:workspace!.verifications.filter(v=>v.status==='pending').length}</Badge></div>
        {profile!.role==='individual'?(due.length?<div className="space-y-4">{due.slice(0,3).map(tree=><div key={tree.id} className="flex items-center gap-3"><span className="rounded-lg bg-app-blue-soft p-2 text-app-indigo"><Droplets size={16} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{tree.species}{tree.isPlot?' plot':''}</p><p className="mt-1 text-xs text-app-muted">{tree.quantity} {tree.isPlot?'trees':'tree'} · watering</p></div><Button variant="secondary" aria-label={`Water ${tree.species}`} onClick={async()=>{try{await waterTree(tree.id,'water')}catch(cause){notify(cause instanceof Error?cause.message:'Could not record watering.')}}}><CheckIcon /></Button></div>)}</div>:<p className="py-4 text-sm text-app-muted">All caught up. Your next reminders will appear here.</p>):<><p className="text-sm leading-relaxed text-app-muted">Review fresh evidence, follow up on at-risk plots, and keep your demo survival counts honest.</p><Link href={csr?'/app/impact':'/app/review'} className="btn btn-secondary mt-5">{csr?'View proof feed':'Open review queue'}<ArrowRight size={14} /></Link></>}
      </Card></div>
    </div>
    <div className="grid gap-5 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Planting over time</h2><p className="mt-1 text-xs text-app-muted">Last six weeks · recorded demo plantings</p></div><Badge>Demo records</Badge></div><div className="flex h-40 items-end gap-4 border-b border-app-border px-2">{bins.map((bin,index)=><div className="flex h-full min-w-0 flex-1 flex-col items-center justify-end" key={index}><span className="mb-2 text-xs text-app-muted">{bin.value}</span><div className={`w-full max-w-16 rounded-t-lg ${index===bins.length-1?'bg-app-indigo':'bg-app-violet-soft'}`} style={{height:`${Math.max(3,bin.value/maximum*105)}px`}} role="img" aria-label={`${bin.label}: ${bin.value} planted`} /></div>)}</div><div className="mt-3 flex justify-between gap-2 px-2 text-xs text-app-muted">{bins.map((bin,index)=><span key={index} className="min-w-0 flex-1 text-center">{bin.label}</span>)}</div></Card>
      <Card><h2 className="mb-4 flex items-center gap-2 font-semibold"><ShieldCheck size={17} className="text-app-green" />Survival comes first.</h2><p className="text-sm leading-relaxed text-app-muted">Plantings are promises. Only trees with completed demo verification count as demo survivors.</p><div className="mt-5 rounded-xl bg-app-green-soft p-4"><strong className="text-2xl">{count.survival}%</strong><p className="mt-1 text-xs text-app-green">Current demo survival rate</p></div><Link href="/app/verify" className="btn btn-secondary mt-5 w-full"><Camera size={14} />Check a tree’s survival</Link></Card>
    </div>
    <Card><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Recent tree records</h2><Link href="/app/trees" className="text-xs font-medium text-app-indigo">View all trees →</Link></div><TreeList trees={trees.slice(0,5)} onSelect={onSelect} compact /></Card>
    {government&&<Card><h2 className="mb-4 font-semibold">Department leaderboard</h2><div className="overflow-x-auto"><table className="product-table"><thead><tr><th>Rank</th><th>Department / institution</th><th>Planted</th><th>Demo survivors</th><th>Survival rate</th></tr></thead><tbody>{departments.map((department,index)=><tr key={department.name}><td>{index+1}</td><td>{department.name}</td><td>{department.planted}</td><td>{department.verified}</td><td>{department.survival}%</td></tr>)}</tbody></table></div></Card>}
    {workspace!.competitions[0]&&<Card><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Growing together</h2><Link href="/app/competitions" className="text-xs font-medium text-app-indigo">View leaderboard →</Link></div><div className="grid gap-3 sm:grid-cols-3">{leaderboard(workspace!.competitions[0],workspace).slice(0,3).map((person,index)=><div className="flex items-center gap-3 rounded-xl bg-app-canvas p-4" key={person.name}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-semibold">{index+1}</span><div><p className="text-sm font-medium">{person.name}</p><p className="mt-1 text-xs text-app-muted">{person.verified} demo survivors</p></div></div>)}</div></Card>}
  </div>
}
function CheckIcon(){return <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m5 10 3 3 7-7" /></svg>}

export function ImpactView({onSelect}:{onSelect:(id:string)=>void}) {
  const {workspace,profile}=useWorkspace()
  const campaignIds=workspace!.campaigns.filter(c=>profile!.role!=='csr'||c.sponsor===profile!.organization).map(c=>c.id)
  const trees=workspace!.trees.filter(t=>campaignIds.includes(t.campaignId)),count=metrics(trees)
  const proofs=workspace!.verifications.filter(v=>v.status==='approved'&&trees.some(t=>t.id===v.treeId))
  return <div className="space-y-5"><Card className="soft-panel-glow"><Badge tone="purple">Demo impact, clearly labeled</Badge><h2 className="mt-4 text-2xl font-semibold">Proof behind your greener promise.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-app-muted">{count.verified} demo survivors across {campaignIds.length} campaigns. Estimates below use simulated records, not certified carbon methodology.</p><Link href="/app/reports" className="btn btn-primary mt-5">Download impact report <ArrowRight size={14} /></Link></Card><div className="grid gap-4 sm:grid-cols-3">{[[count.planted,'Sponsored plantings'],[count.verified,'Demo verified survivors'],[(count.verified*treedamConfig.demo.carbonKgPerVerifiedTreePerYear/1000).toFixed(2)+' t','Estimated demo CO₂ / year']].map(([value,label])=><Card key={label}><p className="text-xs text-app-muted">{label}</p><strong className="mt-4 block text-3xl font-semibold">{value}</strong></Card>)}</div><Card><div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">Survival proof feed</h2><Badge tone="blue">Simulated evidence</Badge></div>{proofs.length?<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{proofs.map(proof=>{const tree=workspace!.trees.find(t=>t.id===proof.treeId)!;return <button className="text-left" onClick={()=>onSelect(tree.id)} key={proof.id}><Photo source={proof.photo} alt={`Demo survival proof for ${tree.species}`} /><div className="mt-3 flex items-center justify-between"><h3 className="text-sm font-semibold">{tree.species}</h3><Badge tone="green">{proof.observedCount} demo survivors</Badge></div><p className="mt-2 text-xs text-app-muted">{tree.planterName} · {new Date(proof.createdAt).toLocaleDateString()}</p></button>})}</div>:<Empty title="No approved proofs yet" text="Approved demo survival photos will appear here." />}</Card></div>
}
