'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCallback,useEffect,useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft,ArrowUpRight,Bell,Building2,Camera,Check,FileDown,HeartHandshake,LayoutDashboard,Leaf,LogOut,MapPin,Menu,Plus,Search,Settings,ShieldCheck,Sprout,Trophy,Users,X,Droplets,Landmark } from 'lucide-react'
import { cloudAvailable,treedamConfig } from '@/config/treedam'
import { roleNames,roles,type Role } from '@/lib/treedam/types'
import { createDemoWorkspace } from '@/lib/treedam/seed'
import { Badge,Button,Card,Empty,Input,Modal,Notice,Select } from './ui'
import { useWorkspace } from './WorkspaceProvider'
import { Overview,ImpactView } from './Overview'
import { AddTreeView,CareView,TreesView,VerificationView,TreeDetails,scopedTrees } from './TreeViews'
import { AuditsView,CampaignsView,CompetitionsView,ReportsView,ReviewView } from './OrganizationViews'

const items=[
  {id:'overview',label:'Overview',icon:LayoutDashboard,roles},
  {id:'trees',label:'My Trees',icon:Sprout,roles},
  {id:'map',label:'Planting Map',icon:MapPin,roles},
  {id:'add-tree',label:'Add Tree',icon:Plus,roles},
  {id:'care',label:'Care & Reminders',icon:Droplets,roles},
  {id:'verify',label:'Survival Check',icon:Camera,roles},
  {id:'campaigns',label:'Campaigns',icon:Users,roles:['ngo','government','csr']},
  {id:'review',label:'Verification Queue',icon:ShieldCheck,roles:['ngo','government']},
  {id:'audits',label:'Survival Audits',icon:Landmark,roles:['government']},
  {id:'impact',label:'Impact & Proof',icon:Leaf,roles:['ngo','government','csr']},
  {id:'competitions',label:'Competitions',icon:Trophy,roles},
  {id:'reports',label:'Reports & Exports',icon:FileDown,roles},
  {id:'settings',label:'Workspace Settings',icon:Settings,roles},
]
const descriptions:Record<string,string>={trees:'Every tree and plot, from first planting to verified survival.',map:'See where your planting promises take root.', 'add-tree':'Capture a photo and location for one tree or an entire plot.',care:'A little care today. A living forest tomorrow.',verify:'Return with fresh evidence and explore a simulated survival check.',campaigns:'Bring people, plots and planting goals together.',review:'Review demo proofs before they become survivor counts.',audits:'Follow up on planting drives and at-risk trees.',impact:'Clear evidence for the people supporting your forests.',competitions:'Compete on trees still growing, not planting-day totals.',reports:'Keep your records clear, portable and funder-ready.',settings:'Your workspace, your demo settings.'}

export function Dashboard({section='overview'}:{section?:string}) {
  const store=useWorkspace(),{profile,workspace,ready,enterDemo,signOut,message,error,dismissError}=store
  const [mobile,setMobile]=useState(false),[search,setSearch]=useState(false),[query,setQuery]=useState(''),[alerts,setAlerts]=useState(false),[selected,setSelected]=useState('')
  const router=useRouter()
  const closeDetails=useCallback(()=>setSelected(''),[])
  useEffect(()=>{setMobile(false);setAlerts(false);setSelected('')},[section])
  if(!ready)return <main className="treedam-app min-h-screen bg-app-canvas p-6"><div className="mx-auto max-w-6xl space-y-5"><div className="h-16 rounded-2xl bg-white" /><div className="grid grid-cols-2 gap-4">{[0,1,2,3].map(i=><div key={i} className="h-36 rounded-2xl bg-white" />)}</div><p className="text-sm text-app-muted">Opening your planting workspace…</p></div></main>
  if(!profile||!workspace)return <main className="treedam-app flex min-h-screen items-center justify-center bg-app-canvas p-5"><Card className="w-full max-w-2xl p-8"><Link href="/"><Image src="/treedam-logo.png" alt="TREEDAM" width={112} height={27} className="mb-8 h-auto w-28" /></Link><Badge tone="blue">Interactive demo</Badge><h1 className="mb-3 mt-5 text-3xl font-semibold">Choose your view of a greener future.</h1><p className="mb-6 text-sm leading-relaxed text-app-muted">Explore one shared, browser-local demo through four roles. No account or password is required. Cloud authentication is a separate Supabase flow.</p><div className="grid gap-3 sm:grid-cols-2">{roles.map(role=><Button key={role} variant="secondary" onClick={()=>enterDemo(role)}>{roleNames[role]}<ArrowUpRight size={14} /></Button>)}</div><div className="mt-8 flex gap-4 text-xs text-app-muted"><Link href="/signin" className="underline">Supabase sign in</Link><Link href="/" className="underline">Back to website</Link></div></Card></main>
  const current=items.find(item=>item.id===section)||items[0],allowed=current.roles.includes(profile.role as never)
  const title=section==='overview'?(profile.role==='individual'?'Your forest, at a glance.':profile.role==='ngo'?'Every campaign. Lasting growth.':profile.role==='government'?'A clearer view of your district.':'Your greener promise, backed by proof.'):current.label
  const due=scopedTrees(workspace.trees,profile,workspace.campaigns).filter(t=>t.status!=='to-plant'&&new Date(t.nextWaterAt).getTime()<=Date.now())
  const pending=workspace.verifications.filter(v=>v.status==='pending')
  const searchResults=scopedTrees(workspace.trees,profile,workspace.campaigns).filter(t=>`${t.species} ${t.location} ${t.planterName}`.toLowerCase().includes(query.toLowerCase())).slice(0,8)
  let content
  if(!allowed)content=<Card><Empty title="Choose a different demo role" text="This workspace tool belongs to an NGO, Government or CSR view. Switch the demo role in the sidebar to explore it." /></Card>
  else if(section==='trees'||section==='map')content=<TreesView onSelect={setSelected} mapOnly={section==='map'} />
  else if(section==='add-tree')content=<AddTreeView />
  else if(section==='care')content=<CareView />
  else if(section==='verify')content=<VerificationView />
  else if(section==='campaigns')content=<CampaignsView onSelect={setSelected} />
  else if(section==='review')content=<ReviewView />
  else if(section==='audits')content=<AuditsView onSelect={setSelected} />
  else if(section==='impact')content=<ImpactView onSelect={setSelected} />
  else if(section==='competitions')content=<CompetitionsView />
  else if(section==='reports')content=<ReportsView />
  else if(section==='settings')content=<WorkspaceSettings />
  else content=<Overview onSelect={setSelected} />
  return <div className="treedam-app min-h-screen bg-app-canvas font-sans">
    <div className="mx-auto grid max-w-[1680px] gap-4 p-3 lg:grid-cols-[220px_minmax(0,1fr)] lg:p-4">
      {mobile&&<div className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm lg:hidden" onClick={()=>setMobile(false)} />}
      <aside className={`${mobile?'flex':'hidden'} fixed inset-y-3 left-3 z-40 w-60 flex-col rounded-3xl border border-app-border bg-white p-4 shadow-panel lg:sticky lg:top-4 lg:flex lg:h-[calc(100dvh-32px)] lg:w-auto`} aria-label="Workspace sidebar">
        <div className="mb-6 flex items-center justify-between gap-2 px-2 pt-2"><Link href="/"><Image src="/treedam-logo.png" alt="TREEDAM home" width={112} height={27} className="h-auto w-28" /></Link><Button variant="secondary" className="lg:hidden!" aria-label="Close navigation" onClick={()=>setMobile(false)}><X size={16} /></Button></div>
        <div className="mb-5 rounded-xl bg-app-canvas p-3"><p className="truncate text-xs font-semibold">{profile.organization}</p><div className="mt-2"><Badge tone="blue">{profile.provider==='demo'?'Browser-local demo':'Supabase demo workspace'}</Badge></div></div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto" aria-label="Workspace navigation">{items.filter(item=>item.roles.includes(profile.role as never)).map(item=>{const Icon=item.icon;return <Link key={item.id} href={item.id==='overview'?'/app':`/app/${item.id}`} aria-current={section===item.id?'page':undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${section===item.id?'bg-app-blue-soft text-app-indigo':'text-app-muted hover:bg-app-canvas hover:text-app-ink'}`}><Icon size={17} />{item.id==='trees'&&profile.role!=='individual'?'Tree Records':item.label}{item.id==='review'&&pending.length>0&&<span className="ml-auto rounded bg-app-violet-soft px-1.5 text-xs text-app-purple">{pending.length}</span>}</Link>})}</nav>
        <div className="mt-5 space-y-3 border-t border-app-border pt-4">{profile.provider==='demo'&&<label className="grid gap-2 text-xs text-app-muted">Demo role switcher<Select aria-label="Demo role switcher" value={profile.role} onChange={event=>{enterDemo(event.target.value as Role);router.push('/app')}}>{roles.map(role=><option key={role} value={role}>{roleNames[role]}</option>)}</Select></label>}<div className="flex items-center gap-2 px-1"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-app-violet-soft text-xs font-semibold text-app-purple">{profile.name.split(' ').slice(0,2).map(n=>n[0]).join('')}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{profile.name}</p><p className="mt-1 truncate text-xs text-app-muted">{roleNames[profile.role]}</p></div><Button variant="secondary" aria-label="Leave workspace" onClick={async()=>{try{await signOut();router.push('/signin')}catch(cause){store.notify(cause instanceof Error?cause.message:'Could not sign out.')}}}><LogOut size={14} /></Button></div></div>
      </aside>
      <main className="min-w-0"><header className="relative z-20 mb-5 flex items-center justify-between gap-3 rounded-2xl border border-app-border bg-white px-4 py-3 shadow-panel">
        <div className="flex min-w-0 items-center gap-3"><Button variant="secondary" className="lg:hidden!" aria-label="Open workspace navigation" onClick={()=>setMobile(true)}><Menu size={18} /></Button><p className="truncate text-xs text-app-muted">Workspace <span className="mx-2 text-app-border">/</span><span className="text-app-ink">{current.label}</span></p></div>
        <div className="flex items-center gap-2"><Button variant="secondary" aria-label="Search workspace" onClick={()=>setSearch(true)}><Search size={16} /><span className="hidden text-app-muted sm:inline">Search your forest…</span></Button><div className="relative"><Button variant="secondary" aria-label="Open reminders" aria-expanded={alerts} onClick={()=>setAlerts(!alerts)}><Bell size={16} />{due.length>0&&<span className="text-xs text-app-indigo">{due.length}</span>}</Button>{alerts&&<Card className="absolute right-0 top-12 w-72 shadow-float"><h2 className="mb-3 text-sm font-semibold">Your demo reminders</h2><p className="text-xs leading-relaxed text-app-muted">{due.length} care records are due. {pending.length} proofs await review.</p><div className="mt-4 grid gap-2"><Link href="/app/care" className="btn btn-secondary" onClick={()=>setAlerts(false)}>Open care schedule</Link>{['ngo','government'].includes(profile.role)&&<Link href="/app/review" className="btn btn-secondary" onClick={()=>setAlerts(false)}>Open verification queue</Link>}</div></Card>}</div><Link href="/" className="hidden text-xs text-app-muted sm:inline">Website ↗</Link></div>
      </header>
      <div className="mb-5"><Notice>{profile.provider==='demo'?<><strong>Demo workspace.</strong> Changes are saved only in this browser, not Supabase. Switch roles to explore one shared demo.</>:<><strong>Supabase demo workspace.</strong> Records are private to your account; verification remains simulated.</>} Map, weather, carbon assumptions and AI outcomes are demonstrations, not real field evidence.</Notice></div>
      {error&&<div className="mb-5"><Notice tone="rose">{error}<Button variant="secondary" className="ml-3" onClick={dismissError}>Dismiss</Button></Notice></div>}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">{section==='overview'?`WELCOME BACK, ${profile.name.split(' ')[0].toUpperCase()}`:'YOUR TREE SURVIVAL WORKSPACE'}</p><h1 className="mb-2 mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1><p className="max-w-xl text-sm leading-relaxed text-app-muted">{section==='overview'?'A little care, clear evidence, and a forest worth protecting.':descriptions[section]}</p></div>{section!=='add-tree'&&<Link href="/app/add-tree" className="btn btn-primary"><Plus size={15} />Add a tree</Link>}</div>
      <div key={section+profile.role}>{content}</div>
      <footer className="flex flex-wrap items-center justify-between gap-3 px-1 py-6 text-xs text-app-muted"><span>© 2026 TREEDAM · Grow forests, breathe fresh air.</span><span>Demo data. Real planting needs real proof.</span></footer>
      </main>
    </div>
    {message&&<div role="status" className="fixed bottom-5 left-5 right-5 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-app-border bg-white p-4 text-sm shadow-float"><Check size={18} className="shrink-0 text-app-green" />{message}</div>}
    {selected&&<TreeDetails treeId={selected} onClose={closeDetails} />}
    {search&&<Modal title="Search your forest" onClose={()=>setSearch(false)}><Input autoFocus aria-label="Search workspace records" placeholder="Search species, planter or location" value={query} onChange={event=>setQuery(event.target.value)} /><div className="mt-4 max-h-80 space-y-2 overflow-y-auto">{searchResults.length?searchResults.map(tree=><Button className="w-full justify-between" variant="secondary" key={tree.id} onClick={()=>{setSearch(false);setSelected(tree.id)}}><span>{tree.species} · {tree.location}</span><ArrowUpRight size={14} /></Button>):<Empty title="No matching trees" text="Try another species, planter or location." />}</div></Modal>}
  </div>
}

function WorkspaceSettings() {
  const {profile,workspace,mutate,resetDemo,notify}=useWorkspace(),[confirm,setConfirm]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false)
  return <div className="space-y-5"><Card><h2 className="text-lg font-semibold">Your workspace</h2><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-xs text-app-muted">Account type</dt><dd className="mt-1">{roleNames[profile!.role]}</dd></div><div><dt className="text-xs text-app-muted">Data storage</dt><dd className="mt-1">{profile!.provider==='demo'?'This browser · localStorage + IndexedDB':'Supabase database + private photo bucket'}</dd></div></dl></Card>
    <Card><h2 className="text-lg font-semibold">Integration configuration</h2><p className="mt-3 text-sm leading-relaxed text-app-muted">All demo provider settings are in <code className="rounded bg-app-canvas px-1 text-xs">src/config/treedam.ts</code>. Real integrations need implementation and validation before their output can become real survival evidence.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{[['Supabase',cloudAvailable?'Runtime configuration present':'Connection acknowledged; runtime configuration unavailable'],['Map','Interactive schematic · simulated pins'],['Weather','Sample conditions · not OpenWeather'],['Verification','Scenario simulation · no Gemini call']].map(([name,text])=><div className="rounded-xl border border-app-border p-4" key={name}><h3 className="text-sm font-semibold">{name}</h3><p className="mt-2 text-xs leading-relaxed text-app-muted">{text}</p></div>)}</div></Card>
    <Card><h2 className="text-lg font-semibold">Demo data controls</h2><p className="mt-3 text-sm text-app-muted">{workspace!.trees.length} tree records · {workspace!.campaigns.length} campaigns · revision {workspace!.revision}</p>{profile!.provider==='demo'?<Button className="mt-5" variant="secondary" onClick={()=>setConfirm(true)}>Reset browser demo records</Button>:<Button className="mt-5" variant="secondary" busy={busy} disabled={workspace!.trees.length>0} onClick={async()=>{setBusy(true);try{await mutate(current=>({...createDemoWorkspace(),revision:current.revision}));notify('Simulated samples saved in your Supabase demo workspace.')}catch(cause){setError(cause instanceof Error?cause.message:'Could not seed cloud demo.')}finally{setBusy(false)}}}>Load demo sample records</Button>}{error&&<div className="mt-4"><Notice tone="rose">{error}</Notice></div>}</Card>
    {confirm&&<Modal title="Reset browser demo records?" onClose={()=>setConfirm(false)}><p className="text-sm leading-relaxed text-app-muted">This replaces the planting, care, verification, campaign and competition records in this browser with the original demo samples. Supabase data is not touched.</p><div className="mt-6 flex gap-2"><Button onClick={async()=>{try{await resetDemo();setConfirm(false)}catch(cause){setError(cause instanceof Error?cause.message:'Reset failed.');setConfirm(false)}}}>Reset demo</Button><Button variant="secondary" onClick={()=>setConfirm(false)}>Keep my changes</Button></div></Modal>}
  </div>
}
