'use client'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { createContext,useContext,useEffect,useId,useRef,useState,type ReactNode,type ButtonHTMLAttributes,type InputHTMLAttributes,type SelectHTMLAttributes,type TextareaHTMLAttributes } from 'react'
import { X, Sprout, LoaderCircle } from 'lucide-react'
import { resolvePhoto } from '@/lib/treedam/photos'

export function Button({children,variant='primary',className='',busy=false,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary';busy?:boolean}) {
  return <button {...props} disabled={props.disabled||busy} className={`btn ${variant==='primary'?'btn-primary':'btn-secondary'} disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>{busy&&<LoaderCircle size={15} className="animate-spin" />}{children}</button>
}
export function Card({children,className='',...props}:React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`product-card rounded-2xl border border-app-border bg-white p-5 shadow-panel ${className}`}>{children}</div>
}
export function Badge({children,tone='neutral'}:{children:ReactNode;tone?:'neutral'|'green'|'blue'|'rose'|'purple'}) {
  const colors={neutral:'bg-app-canvas text-app-muted',green:'bg-app-green-soft text-app-green',blue:'bg-app-blue-soft text-app-indigo',rose:'bg-app-rose-soft text-app-rose',purple:'bg-app-violet-soft text-app-purple'}
  return <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${colors[tone]}`}>{children}</span>
}
const fieldClass='w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm text-app-ink outline-none transition focus:border-app-indigo focus:ring-2 focus:ring-app-indigo/10 disabled:bg-app-canvas'
const FieldContext=createContext<{id:string;hint?:string}|null>(null)
export function Input(props:InputHTMLAttributes<HTMLInputElement>) {const field=useContext(FieldContext);return <input aria-labelledby={props['aria-label']?undefined:field?.id} aria-describedby={field?.hint} {...props} className={`${fieldClass} ${props.className||''}`} />}
export function Select(props:SelectHTMLAttributes<HTMLSelectElement>) {const field=useContext(FieldContext);return <select aria-labelledby={props['aria-label']?undefined:field?.id} aria-describedby={field?.hint} {...props} className={`${fieldClass} ${props.className||''}`} />}
export function Textarea(props:TextareaHTMLAttributes<HTMLTextAreaElement>) {const field=useContext(FieldContext);return <textarea aria-labelledby={props['aria-label']?undefined:field?.id} aria-describedby={field?.hint} {...props} className={`${fieldClass} ${props.className||''}`} />}
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}) {
  const id=useId()
  return <FieldContext.Provider value={{id,hint:hint?id+'-hint':undefined}}><label className="grid min-w-0 gap-2 text-xs font-medium text-app-ink"><span id={id}>{label}</span>{children}{hint&&<span id={id+'-hint'} className="text-xs font-normal leading-relaxed text-app-muted">{hint}</span>}</label></FieldContext.Provider>
}
export function Empty({title='No trees yet',text='Plant your first tree to start its survival story.',children}:{title?:string;text?:string;children?:ReactNode}) {
  return <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center"><span className="rounded-xl bg-app-green-soft p-3 text-app-green"><Sprout size={24} /></span><h3 className="font-semibold text-app-ink">{title}</h3><p className="max-w-sm text-sm leading-relaxed text-app-muted">{text}</p>{children}</div>
}
export function Photo({source,alt,className='aspect-[4/3]'}:{source?:string;alt:string;className?:string}) {
  const [url,setUrl]=useState<string|undefined>(source&&!/^(idb|storage):/.test(source)?source:undefined)
  const [failed,setFailed]=useState(false)
  useEffect(()=> {
    let active=true,objectUrl:string|undefined
    setFailed(false)
    if(!source){setUrl(undefined);return}
    setUrl(/^(idb|storage):/.test(source)?undefined:source)
    resolvePhoto(source).then(value=>{objectUrl=source.startsWith('idb:')&&value.startsWith('blob:')?value:undefined;if(active)setUrl(value);else if(objectUrl)URL.revokeObjectURL(objectUrl)}).catch(()=>{if(active)setFailed(true)})
    return()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl)}
  },[source])
  return <div className={`relative overflow-hidden rounded-xl bg-app-green-soft ${className}`}>
    {url&&!failed?<Image key={url} src={url} alt={alt} fill sizes="(max-width: 768px) 90vw, 400px" className="object-cover" onError={()=>setFailed(true)} />:<div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-app-muted"><Sprout size={20} />{failed?'Photo unavailable':'Tree photo'}</div>}
  </div>
}
export function Modal({title,children,onClose,wide=false}:{title:string;children:ReactNode;onClose:()=>void;wide?:boolean}) {
  const ref=useRef<HTMLDivElement>(null),id=useId(),closeRef=useRef(onClose)
  closeRef.current=onClose
  useEffect(()=> {
    const previous=document.activeElement as HTMLElement,overflow=document.body.style.overflow
    document.body.style.overflow='hidden'
    const first=ref.current?.querySelector<HTMLElement>('button,input,select,textarea,[tabindex="0"]')
    first?.focus()
    const key=(event:KeyboardEvent)=> {
      if(event.key==='Escape')closeRef.current()
      if(event.key!=='Tab')return
      const focusable=Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select,textarea,a[href],[tabindex="0"]')||[])
      const first=focusable[0],last=focusable.at(-1)
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
    }
    document.addEventListener('keydown',key)
    return()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',key);previous?.focus()}
  },[])
  return createPortal(<div className="treedam-app luxury-motion fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
    <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={id} className={`my-auto max-h-[90dvh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-float ${wide?'max-w-3xl':'max-w-lg'}`}>
      <div className="mb-6 flex items-center justify-between gap-4"><h2 id={id} className="text-xl font-semibold tracking-tight">{title}</h2><Button variant="secondary" aria-label="Close dialog" onClick={onClose}><X size={16} /></Button></div>{children}
    </div>
  </div>,document.body)
}
export function Notice({children,tone='blue'}:{children:ReactNode;tone?:'blue'|'rose'}) {
  return <div role={tone==='rose'?'alert':undefined} className={`rounded-xl p-4 text-xs leading-relaxed ${tone==='rose'?'bg-app-rose-soft text-app-rose':'bg-app-blue-soft text-app-indigo'}`}>{children}</div>
}
