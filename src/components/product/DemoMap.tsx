'use client'
import { useMemo,useRef,useState } from 'react'
import { Minus,Plus,LocateFixed,MapPin,Layers } from 'lucide-react'
import { treedamConfig } from '@/config/treedam'
import { statusNames,type Tree } from '@/lib/treedam/types'
import { Badge,Button } from './ui'

export function DemoMap({trees,onSelect,onPick,selectedId}:{trees:Tree[];onSelect?:(id:string)=>void;onPick?:(lat:number,lng:number)=>void;selectedId?:string}) {
  const [zoom,setZoom]=useState(1),[pan,setPan]=useState({x:0,y:0})
  const drag=useRef<{x:number;y:number;px:number;py:number;moved:boolean}|null>(null)
  const bounds=useMemo(()=> {
    const lat=trees.map(t=>t.lat),lng=trees.map(t=>t.lng)
    const center=treedamConfig.demo.center
    return {south:Math.min(center.lat-.02,...lat)-.007,north:Math.max(center.lat+.02,...lat)+.007,west:Math.min(center.lng-.03,...lng)-.007,east:Math.max(center.lng+.03,...lng)+.007}
  },[trees])
  const point=(tree:Tree)=>({x:50+(tree.lng-bounds.west)/(bounds.east-bounds.west)*800,y:40+(bounds.north-tree.lat)/(bounds.north-bounds.south)*400})
  return <div className="relative overflow-hidden rounded-xl border border-app-border bg-app-blue-soft">
    <div className="absolute left-3 top-3 z-10 flex items-center gap-2"><Badge tone="blue"><Layers size={12} />Demo map</Badge><span className="rounded-md bg-white/90 px-2 py-1 text-xs text-app-muted">Skardu</span></div>
    <div className="absolute right-3 top-3 z-10 grid gap-1">
      <Button variant="secondary" aria-label="Zoom in" onClick={()=>setZoom(z=>Math.min(2.5,z+.25))}><Plus size={14} /></Button>
      <Button variant="secondary" aria-label="Zoom out" onClick={()=>setZoom(z=>Math.max(1,z-.25))}><Minus size={14} /></Button>
      <Button variant="secondary" aria-label="Reset map view" onClick={()=>{setZoom(1);setPan({x:0,y:0})}}><LocateFixed size={14} /></Button>
    </div>
    <svg viewBox="0 0 900 480" className={`block min-h-72 w-full touch-pan-y ${onPick?'cursor-crosshair':'cursor-grab'}`} role="img" aria-label="Interactive demo map showing recorded planting locations. This is a schematic, not a live map."
      onPointerDown={event=>{if((event.target as Element).closest('[data-pin]'))return;drag.current={x:event.clientX,y:event.clientY,px:pan.x,py:pan.y,moved:false};event.currentTarget.setPointerCapture(event.pointerId)}}
      onPointerMove={event=>{if(!drag.current)return;const dx=event.clientX-drag.current.x,dy=event.clientY-drag.current.y;if(Math.abs(dx)+Math.abs(dy)>5)drag.current.moved=true;if(zoom>1)setPan({x:Math.max(-250,Math.min(250,drag.current.px+dx)),y:Math.max(-140,Math.min(140,drag.current.py+dy))})}}
      onPointerUp={event=> {
        if(drag.current&&!drag.current.moved&&onPick){
          const box=event.currentTarget.getBoundingClientRect(),x=((event.clientX-box.left)/box.width*900-450-pan.x)/zoom+450,y=((event.clientY-box.top)/box.height*480-240-pan.y)/zoom+240
          onPick(bounds.north-(y-40)/400*(bounds.north-bounds.south),bounds.west+(x-50)/800*(bounds.east-bounds.west))
        }
        drag.current=null
      }} onPointerCancel={()=>{drag.current=null}}>
      <defs><pattern id="demo-map-grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" className="stroke-app-border" strokeWidth=".8" /></pattern></defs>
      <rect width="900" height="480" fill="white" /><rect width="900" height="480" fill="url(#demo-map-grid)" />
      <g transform={`translate(${450+pan.x} ${240+pan.y}) scale(${zoom}) translate(-450 -240)`}>
        <path d="M0 40Q200 140 280 70T650 100T900 40V0H0Z" className="fill-app-green-soft" />
        <path d="M70 450Q170 250 400 340T900 280V480H0Z" className="fill-app-green-soft" />
        <path d="M-50 330Q150 180 300 240T580 220T950 160" fill="none" className="stroke-app-blue-soft" strokeWidth="32" />
        <path d="M20 90L330 390M200 0L800 480M0 420L900 70M60 170L860 260" fill="none" className="stroke-app-border" strokeWidth="8" />
        <path d="M20 90L330 390M200 0L800 480M0 420L900 70M60 170L860 260" fill="none" stroke="white" strokeWidth="5" />
        <g className="fill-app-muted text-xs"><text x="210" y="150">Community plots</text><text x="580" y="360">University nursery</text><text x="495" y="85">Skardu plantation area</text><text x="80" y="295">Schematic river</text></g>
        {trees.map(tree=> {
          const p=point(tree),fill=tree.status==='verified'?'fill-app-green':tree.status==='at-risk'?'fill-app-rose':'fill-app-indigo'
          return <g key={tree.id} data-pin transform={`translate(${p.x} ${p.y})`} role="button" tabIndex={0} className="cursor-pointer outline-none" aria-label={`${tree.species}, ${tree.quantity} ${tree.isPlot?'trees in plot':'tree'}, ${statusNames[tree.status]}`} onClick={()=>onSelect?.(tree.id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect?.(tree.id)}}}>
            <circle r={selectedId===tree.id?20:15} className={fill} opacity=".12" /><circle r="8" className={fill} stroke="white" strokeWidth="3" />
            {tree.isPlot&&<><rect x="10" y="-22" width="42" height="20" rx="6" fill="white" className="stroke-app-border" /><text x="31" y="-8" textAnchor="middle" className="fill-app-ink text-xs">{tree.quantity}</text></>}
          </g>
        })}
      </g>
    </svg>
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-app-border bg-white/95 px-3 py-2 text-xs text-app-muted"><span className="flex items-center gap-1"><MapPin size={12} />{trees.length} recorded locations</span><span>{onPick?'Tap to choose a simulated point':'Select a pin to see its tree'} · Not for navigation</span></div>
  </div>
}
