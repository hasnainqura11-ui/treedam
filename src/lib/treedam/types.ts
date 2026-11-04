export const roles = ['individual', 'ngo', 'government', 'csr'] as const
export type Role = typeof roles[number]
export const roleNames: Record<Role,string> = { individual: 'Individual Planter', ngo: 'NGO', government: 'Government Department', csr: 'CSR Company' }
export type TreeStatus = 'to-plant' | 'growing' | 'to-verify' | 'verified' | 'at-risk'
export const statusNames: Record<TreeStatus,string> = { 'to-plant':'To Plant', growing:'Growing', 'to-verify':'To Verify', verified:'Verified', 'at-risk':'At Risk' }
export type Profile = { id: string; name: string; role: Role; organization: string; provider: 'demo' | 'supabase' }
export type Tree = {
  id: string; planterId: string; planterName: string; species: string; quantity: number; verifiedCount: number;
  isPlot: boolean; lat: number; lng: number; location: string; plantedAt: string; status: TreeStatus;
  photo: string; proofPhoto?: string; campaignId: string; competitionId: string; nextWaterAt: string;
  isDemo: boolean; notes: string;
}
export type Campaign = { id: string; name: string; area: string; target: number; description: string; planters: string[]; sponsor: string; createdAt: string; isDemo: boolean; department?:string }
export type Verification = { id: string; treeId: string; photo: string; verdict: 'alive'|'at-risk'|'uncertain'; confidence: number; status: 'pending'|'approved'|'rejected'; observedCount: number; createdAt: string; notes: string; isSimulated: boolean }
export type Competition = { id: string; name: string; audience: string; endsAt: string; prize: string; members: string[]; completed: boolean; isDemo: boolean; results?:Array<{name:string;planted:number;verified:number;survival:number;atRisk:number}> }
export type CareEvent = { id: string; treeId: string; kind: 'water'|'nutrition'; completedAt: string; liters: number; isDemo: boolean }
export type Audit = { id: string; campaignId: string; requestedAt: string; status: 'requested'|'completed'; notes: string }
export type Workspace = { version: 1; revision: number; trees: Tree[]; campaigns: Campaign[]; verifications: Verification[]; competitions: Competition[]; careEvents: CareEvent[]; audits: Audit[] }
export type TreeInput = Omit<Tree,'id'|'verifiedCount'|'proofPhoto'|'isDemo'>
export function uid() { return crypto.randomUUID() }
export function isoInDays(days: number) { return new Date(Date.now()+days*86400000).toISOString() }
export function metrics(trees: Tree[]) {
  const planted = trees.filter(t=>t.status!=='to-plant').reduce((sum,t)=>sum+t.quantity,0)
  const verified = trees.reduce((sum,t)=>sum+(t.status==='verified'?t.verifiedCount:0),0)
  return { planted, verified, survival: planted?Math.round(verified/planted*100):0, atRisk:trees.filter(t=>t.status==='at-risk').reduce((s,t)=>s+t.quantity,0) }
}
export function validateWorkspace(workspace: Workspace) {
  if(workspace.version!==1||!['trees','campaigns','verifications','competitions','careEvents','audits'].every(key=>Array.isArray(workspace[key as keyof Workspace])))throw new Error('Saved workspace data could not be read.')
  for (const tree of workspace.trees) {
    if (!Number.isInteger(tree.quantity)||tree.quantity<1||tree.quantity>1000000) throw new Error('Tree count must be between 1 and 1,000,000.')
    if (!Number.isInteger(tree.verifiedCount)||tree.verifiedCount<0||tree.verifiedCount>tree.quantity) throw new Error('Verified survivors cannot exceed the planted count.')
    if (!Number.isFinite(tree.lat)||Math.abs(tree.lat)>90||!Number.isFinite(tree.lng)||Math.abs(tree.lng)>180) throw new Error('Enter valid latitude and longitude.')
  }
}
