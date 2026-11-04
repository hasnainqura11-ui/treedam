'use client'
import { createContext,useContext,useEffect,useRef,useState,type ReactNode } from 'react'
import { treedamConfig } from '@/config/treedam'
import { createDemoWorkspace,demoProfile } from '@/lib/treedam/seed'
import { readCloudProfile,readCloudWorkspace,saveCloudWorkspace,supabase } from '@/lib/treedam/cloud'
import { isoInDays,uid,validateWorkspace,roles,type Profile,type Role,type Workspace,type TreeInput,type Verification } from '@/lib/treedam/types'
import { simulateVerification } from '@/lib/treedam/integrations'
import { clearDemoPhotos } from '@/lib/treedam/photos'

type Store = {
  workspace:Workspace|null;profile:Profile|null;ready:boolean;message:string;error:string;
  enterDemo:(role:Role,name?:string)=>void;enterCloud:()=>Promise<void>;signOut:()=>Promise<void>;
  notify:(message:string)=>void;dismissError:()=>void;mutate:(fn:(current:Workspace)=>Workspace)=>Promise<void>;
  addTree:(tree:TreeInput)=>Promise<string>;waterTree:(id:string,kind:'water'|'nutrition')=>Promise<void>;
  verifyTree:(id:string,photo:string,scenario:Verification['verdict'])=>Promise<void>;
  reviewProof:(id:string,approve:boolean,count:number,notes:string)=>Promise<void>;
  resetDemo:()=>Promise<void>;
}
const Context=createContext<Store|null>(null)
export function WorkspaceProvider({children}:{children:ReactNode}) {
  const [workspace,setWorkspace]=useState<Workspace|null>(null),[profile,setProfile]=useState<Profile|null>(null),[ready,setReady]=useState(false)
  const [message,setMessage]=useState(''),[error,setError]=useState('')
  const workspaceRef=useRef<Workspace|null>(null),profileRef=useRef<Profile|null>(null)
  const queue=useRef<Promise<unknown>>(Promise.resolve())
  function install(data:Workspace) {workspaceRef.current=data;setWorkspace(data)}
  function setIdentity(identity:Profile|null) {profileRef.current=identity;setProfile(identity)}
  useEffect(()=> {
    try {
      const raw=localStorage.getItem(treedamConfig.demo.storageKey)
      const data:Workspace=raw?JSON.parse(raw):createDemoWorkspace()
      if(data.version!==1)throw new Error('Saved demo data uses an unsupported version.')
      validateWorkspace(data);install(data)
      if(!raw)localStorage.setItem(treedamConfig.demo.storageKey,JSON.stringify(data))
      const saved=localStorage.getItem(treedamConfig.demo.profileKey)
      if(saved){const identity:Profile=JSON.parse(saved);if(identity.provider==='demo'&&roles.includes(identity.role)&&typeof identity.id==='string'&&typeof identity.name==='string'&&typeof identity.organization==='string')setIdentity(identity)}
    } catch {install(createDemoWorkspace());setError('Saved demo data could not be loaded. This session is running in memory until storage is available.')}
    setReady(true)
    const onStorage=(event:StorageEvent)=> {
      if(event.key===treedamConfig.demo.storageKey&&event.newValue&&profileRef.current?.provider!=='supabase'){
        try{const value:Workspace=JSON.parse(event.newValue);validateWorkspace(value);install(value)}catch{setError('A change from another tab could not be loaded.')}
      }
    }
    window.addEventListener('storage',onStorage)
    return()=>window.removeEventListener('storage',onStorage)
  },[])
  useEffect(()=>{if(!message)return;const timer=setTimeout(()=>setMessage(''),5000);return()=>clearTimeout(timer)},[message])
  const enterDemo=(role:Role,name?:string)=> {
    const identity=demoProfile(role,name);setIdentity(identity)
    try{
      localStorage.setItem(treedamConfig.demo.profileKey,JSON.stringify(identity))
      const saved=localStorage.getItem(treedamConfig.demo.storageKey)
      if(saved){const data:Workspace=JSON.parse(saved);validateWorkspace(data);install(data)}
    }catch{setError('Your demo role could not be persisted in this browser.')}
  }
  const enterCloud=async()=> {
    const identity=await readCloudProfile(),data=await readCloudWorkspace()
    localStorage.removeItem(treedamConfig.demo.profileKey)
    setIdentity(identity);install(data)
  }
  useEffect(()=> {
    const db=supabase()
    if(!db)return
    let active=true
    const restore=async()=> {
      const {data:{session}}=await db.auth.getSession()
      if(!active||!session||profileRef.current?.provider==='demo')return
      try{
        const identity=await readCloudProfile(),data=await readCloudWorkspace()
        if(active){setIdentity(identity);install(data)}
      }catch(cause){if(active)setError(cause instanceof Error?cause.message:'Supabase session could not be restored.')}
    }
    void restore()
    const {data:{subscription}}=db.auth.onAuthStateChange(event=> {
      if(event==='SIGNED_IN')setTimeout(()=>{if(active)void restore()},0)
      if(event==='SIGNED_OUT'&&profileRef.current?.provider==='supabase')setIdentity(null)
    })
    return()=>{active=false;subscription.unsubscribe()}
  },[])
  const signOut=async()=> {
    if(profileRef.current?.provider==='supabase'){const {error}=await supabase()!.auth.signOut();if(error)throw error}
    localStorage.removeItem(treedamConfig.demo.profileKey);setIdentity(null)
  }
  const mutate=(fn:(current:Workspace)=>Workspace):Promise<void>=> {
    const identity=profileRef.current
    const task=queue.current.then(async()=> {
      if(!identity||identity.id!==profileRef.current?.id)throw new Error('Open a workspace before making changes.')
      const previous=workspaceRef.current
      if(!previous)throw new Error('Workspace is still loading.')
      const next=fn(structuredClone(previous));validateWorkspace(next)
      if(identity.provider==='supabase')next.revision=await saveCloudWorkspace(next,previous)
      else {next.revision=previous.revision+1;localStorage.setItem(treedamConfig.demo.storageKey,JSON.stringify(next))}
      install(next)
    })
    queue.current=task.catch(()=>{})
    return task
  }
  const addTree=async(input:TreeInput)=> {
    if(!input.species.trim()||!input.photo||!input.location.trim())throw new Error('Add a species, location and planting photo.')
    const id=uid()
    await mutate(current=>({...current,trees:[{...input,id,verifiedCount:0,isDemo:true},...current.trees]}))
    setMessage(input.isPlot?'Demo plot added. A plot needs an audited survivor count before it counts as verified.':'Demo tree planted. Its survival journey starts now.')
    return id
  }
  const waterTree=async(id:string,kind:'water'|'nutrition')=> {
    await mutate(current=> {
      const tree=current.trees.find(t=>t.id===id)
      if(!tree)throw new Error('Tree not found.')
      if(kind==='water')tree.nextWaterAt=isoInDays(2)
      current.careEvents.unshift({id:uid(),treeId:id,kind,completedAt:new Date().toISOString(),liters:kind==='water'?2*tree.quantity:0,isDemo:true})
      return current
    });setMessage(kind==='water'?'Watering recorded. The next demo reminder is in two days.':'Nutrition care recorded.')
  }
  const verifyTree=async(id:string,photo:string,scenario:Verification['verdict'])=> {
    const result=await simulateVerification(scenario)
    await mutate(current=> {
      const tree=current.trees.find(t=>t.id===id)
      if(!tree)throw new Error('Tree not found.')
      if(tree.status==='to-plant')throw new Error('Mark this tree planted before submitting survival evidence.')
      current.verifications.filter(v=>v.treeId===id&&v.status==='pending').forEach(v=>{v.status='rejected';v.notes='Superseded by a newer demo proof.'})
      const singlePass=!tree.isPlot&&result.verdict==='alive'
      tree.proofPhoto=photo;tree.status=singlePass?'verified':result.verdict==='at-risk'?'at-risk':'to-verify'
      tree.verifiedCount=singlePass?1:0
      current.verifications.unshift({id:uid(),treeId:id,photo,...result,status:singlePass?'approved':result.verdict==='at-risk'?'rejected':'pending',observedCount:singlePass?1:0,createdAt:new Date().toISOString(),isSimulated:true})
      return current
    });setMessage('Demo verification complete. This result is simulated, not AI evidence.')
  }
  const reviewProof=async(id:string,approve:boolean,count:number,notes:string)=> {
    if(profileRef.current?.role==='individual'||profileRef.current?.role==='csr')throw new Error('Use the NGO or Government demo to review proofs.')
    await mutate(current=> {
      const proof=current.verifications.find(v=>v.id===id),tree=current.trees.find(t=>t.id===proof?.treeId)
      if(!proof||!tree||proof.status!=='pending')throw new Error('This proof is no longer pending.')
      if(approve&&(!Number.isInteger(count)||count<1||count>tree.quantity))throw new Error('Enter an audited survivor count from 1 to the planted total.')
      proof.status=approve?'approved':'rejected';proof.observedCount=approve?count:0;proof.notes=notes.trim()||'Reviewed in the TREEDAM demo.'
      tree.status=approve?'verified':'at-risk';tree.verifiedCount=approve?count:0
      return current
    });setMessage(approve?'Demo survivors approved. Counts and leaderboard updated.':'Demo proof rejected; trees marked at risk.')
  }
  const resetDemo=async()=> {
    if(profileRef.current?.provider!=='demo')throw new Error('Reset is available only for browser-local demo data.')
    const data=createDemoWorkspace();localStorage.setItem(treedamConfig.demo.storageKey,JSON.stringify(data));install(data)
    try{await clearDemoPhotos();setMessage('Browser demo records and uploaded photos reset. Cloud data was not touched.')}
    catch{setError('Demo records were reset, but uploaded photo cleanup failed. Clear this site’s browser storage to remove those photos.')}
  }
  return <Context.Provider value={{workspace,profile,ready,message,error,enterDemo,enterCloud,signOut,notify:setMessage,dismissError:()=>setError(''),mutate,addTree,waterTree,verifyTree,reviewProof,resetDemo}}>{children}</Context.Provider>
}
export function useWorkspace(){const store=useContext(Context);if(!store)throw new Error('WorkspaceProvider is missing.');return store}
