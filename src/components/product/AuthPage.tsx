'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Sprout, HeartHandshake, Landmark, Building2, Check } from 'lucide-react'
import { TopNavbar } from '@/components/site/Layout'
import { cloudAvailable } from '@/config/treedam'
import { roles,roleNames,type Role } from '@/lib/treedam/types'
import { signIn,signUp,requireCloud } from '@/lib/treedam/cloud'
import { useWorkspace } from './WorkspaceProvider'
import { Button,Field,Input,Notice,Badge } from './ui'
const icons={individual:Sprout,ngo:HeartHandshake,government:Landmark,csr:Building2}

export function AuthPage({mode}:{mode:'signup'|'signin'}) {
  const [method,setMethod]=useState<'demo'|'supabase'>('demo'),[role,setRole]=useState<Role>('individual')
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[success,setSuccess]=useState('')
  const {enterDemo,enterCloud}=useWorkspace(),router=useRouter()
  return <main className="inner-page"><TopNavbar /><section className="account-layout treedam-app">
    <div><span className="eyebrow">YOUR NEXT LIVING FOREST STARTS HERE</span><h1>Make room for<br />a greener future.</h1>
      <p className="text-sm leading-relaxed text-app-muted">From one seedling to whole forests, track every tree in one place and keep your planters growing together.</p>
      <div className="account-proof"><Check size={18} />GPS-tagged trees. Consistent care. Survival evidence.</div>
      <div className="mt-8"><Badge tone="blue">Interactive demo</Badge><p className="mt-3 text-xs leading-relaxed text-app-muted">Explore all four roles without credentials. Demo records stay in this browser; maps, weather and AI results are simulated.</p></div>
    </div>
    <div className="account-card">
      <h2>{mode==='signup'?'Start planting today':'Welcome back'}</h2><p>{method==='demo'?'Choose the workspace you’d like to explore.':'Sign in securely with Supabase Authentication.'}</p>
      <div className="mt-5 grid grid-cols-2 rounded-lg bg-app-canvas p-1" role="tablist" aria-label="Account mode">
        <Button variant={method==='demo'?'primary':'secondary'} role="tab" aria-selected={method==='demo'} onClick={()=>{setMethod('demo');setError('')}}>Demo workspace</Button>
        <Button variant={method==='supabase'?'primary':'secondary'} role="tab" aria-selected={method==='supabase'} onClick={()=>{setMethod('supabase');setError('')}}>Supabase account</Button>
      </div>
      <form onSubmit={async event=> {
        event.preventDefault();setError('');setSuccess('');setBusy(true)
        const form=new FormData(event.currentTarget),name=String(form.get('name')||'')
        try {
          if(method==='demo'){enterDemo(role,name);router.push('/app');return}
          if(!cloudAvailable)throw new Error('The platform acknowledged Supabase connection, but its configuration is not available to this app yet. You can explore the complete browser-local demo now.')
          const email=String(form.get('email')||''),password=String(form.get('password')||'')
          if(mode==='signup'){
            const data=await signUp(email,password,name,role,String(form.get('organization')||''))
            if(!data.session){setSuccess('Check your inbox to confirm your Supabase account before signing in.');return}
          }else await signIn(email,password)
          await enterCloud();router.push('/app')
        }catch(cause){setError(cause instanceof Error?cause.message:'Could not open your workspace.')}
        finally{setBusy(false)}
      }}>
        {(method==='demo'||mode==='signup')&&<><Field label="Your name"><Input name="name" placeholder="Ayesha Khan" required={method==='supabase'} autoComplete="name" /></Field>
          <fieldset><legend className="mb-3 text-xs font-medium">Account type</legend><div className="grid grid-cols-2 gap-2">{roles.map(item=>{const Icon=icons[item];return <button key={item} type="button" aria-pressed={role===item} onClick={()=>setRole(item)} className={`flex flex-col gap-2 rounded-xl border p-3 text-left text-xs transition ${role===item?'border-app-indigo bg-app-blue-soft text-app-indigo':'border-app-border text-app-muted'}`}><Icon size={20} />{roleNames[item]}</button>})}</div></fieldset></>}
        {method==='supabase'&&<><Field label="Email address"><Input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></Field>
          <Field label="Password"><Input name="password" type="password" minLength={8} required autoComplete={mode==='signup'?'new-password':'current-password'} /></Field>
          {mode==='signup'&&role!=='individual'&&<Field label="Organization"><Input name="organization" required placeholder="Your organization" /></Field>}
          {!cloudAvailable&&<Notice>Supabase runtime configuration is not exposed yet. No password will be stored or checked by the demo.</Notice>}
        </>}
        {error&&<Notice tone="rose">{error}</Notice>}{success&&<Notice>{success}</Notice>}
        <Button type="submit" busy={busy} className="w-full">{method==='demo'?'Explore '+roleNames[role]+' demo':mode==='signup'?'Create account':'Sign in'}<ArrowRight size={15} /></Button>
        {method==='supabase'&&<Button type="button" variant="secondary" disabled={!cloudAvailable||busy} onClick={async()=>{try{const {error}=await requireCloud().auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/signin'}});if(error)throw error}catch(cause){setError(cause instanceof Error?cause.message:'Google sign-in is unavailable.')}}}>Continue with Google</Button>}
      </form>
      <p className="account-switch">{mode==='signin'?'New to TREEDAM?':'Already have an account?'} <Link href={mode==='signin'?'/signup':'/signin'}>{mode==='signin'?'Sign up':'Sign in'}</Link></p>
      <p className="demo-note">{method==='demo'?'No authentication occurs in demo mode. Never enter sensitive information.':'Supabase accounts are separate from the Payload admin panel.'}</p>
    </div>
  </section></main>
}
