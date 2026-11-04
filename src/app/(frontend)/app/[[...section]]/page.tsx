import { Dashboard } from '@/components/product/Dashboard'
const sections=['trees','map','add-tree','care','verify','campaigns','review','audits','impact','competitions','reports','settings']
export const dynamicParams=false
export function generateStaticParams(){return [{section:[]},...sections.map(section=>({section:[section]}))]}
export default async function Page({params}:{params:Promise<{section?:string[]}>}) {
  const {section}=await params
  return <Dashboard section={section?.[0]||'overview'} />
}
