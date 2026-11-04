import { metrics,type Tree,type Workspace,type Profile } from './types'
import { treedamConfig } from '@/config/treedam'

export function downloadCsv(trees:Tree[]) {
  const escape=(value:unknown)=> {
    const text=String(value??'')
    return '"'+(/^\s*[=+@-]/.test(text)?"'"+text:text).replaceAll('"','""')+'"'
  }
  const rows=[['Species','Planter','Planted count','Demo verified survivors','Status','Latitude','Longitude','Planted at','Demo record'],...trees.map(t=>[t.species,t.planterName,t.quantity,t.verifiedCount,t.status,t.lat,t.lng,t.plantedAt,'Yes — simulated'])]
  const url=URL.createObjectURL(new Blob([rows.map(r=>r.map(escape).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}))
  const link=document.createElement('a');link.href=url;link.download='treedam-demo-tree-records.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
export async function downloadReport(workspace:Workspace,profile:Profile,trees:Tree[],certificate?:{name:string;award:string}) {
  const {jsPDF}=await import('jspdf'),doc=new jsPDF()
  const numbers=metrics(trees)
  doc.setFont('helvetica','bold');doc.setFontSize(26);doc.text('TREEDAM',18,24)
  doc.setFontSize(10);doc.setTextColor(110);doc.text('GROW GREENER, TOGETHER',18,32)
  doc.setTextColor(80,90,160);doc.text('DEMO — SIMULATED RECORDS / NOT REAL SURVIVAL EVIDENCE',18,43)
  doc.setTextColor(18);doc.setFontSize(20);doc.text(certificate?'Demo certificate':'Plantation impact report',18,61)
  doc.setFontSize(11);doc.setFont('helvetica','normal')
  const lines=certificate?[
    `Presented to ${certificate.name}`,
    certificate.award,
    'This is a demonstration certificate. No real award or carbon credit is issued.',
  ]:[
    `Prepared for ${profile.organization} · ${new Date().toLocaleDateString()}`,
    `Planted trees: ${numbers.planted}   Demo verified survivors: ${numbers.verified}   Survival: ${numbers.survival}%`,
    `Demonstration CO2 estimate: ${(numbers.verified*treedamConfig.demo.carbonKgPerVerifiedTreePerYear/1000).toFixed(2)} t / year`,
    `Assumption: ${treedamConfig.demo.carbonKgPerVerifiedTreePerYear} kg per surviving tree per year. This is not a certified credit calculation.`,
    `Map, weather and verification results are simulated. Storage: ${profile.provider==='demo'?'browser-local demo':'private Supabase demo workspace'}.`,
  ]
  let y=75
  for(const text of lines){const wrapped=doc.splitTextToSize(text,174);doc.text(wrapped,18,y);y+=wrapped.length*6+6}
  if(!certificate){
    doc.setFont('helvetica','bold');doc.text('Tree / plot records',18,y+5);y+=16;doc.setFont('helvetica','normal')
    for(const tree of trees){
      if(y>263){doc.addPage();y=22}
      const wrapped=doc.splitTextToSize(`${tree.species} · ${tree.planterName} · planted ${tree.quantity} · demo verified ${tree.verifiedCount} · ${tree.status}`,174)
      doc.text(wrapped,18,y);y+=wrapped.length*6+5
    }
    if(y>247){doc.addPage();y=22}
    doc.setFontSize(9);doc.setTextColor(110);doc.text(`Demo proofs recorded: ${workspace.verifications.length}. Keep original evidence before making any real impact claim.`,18,Math.min(275,y+12),{maxWidth:174})
  }
  doc.save(certificate?'treedam-demo-certificate.pdf':'treedam-demo-impact-report.pdf')
}
