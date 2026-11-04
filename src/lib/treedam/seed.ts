import { isoInDays, uid, type Profile, type Role, type Workspace, type Tree } from './types'
export const demoPeople = [
  { id:'planter-ayesha', name:'Ayesha Khan', initials:'AK' },
  { id:'planter-bilal', name:'Bilal Ahmed', initials:'BA' },
  { id:'planter-fatima', name:'Fatima Noor', initials:'FN' },
  { id:'planter-zain', name:'Zain Ali', initials:'ZA' },
]
export function demoProfile(role: Role, name?: string): Profile {
  return {
    id: role==='individual'?demoPeople[0].id:`demo-${role}`, role, provider:'demo',
    name: name?.trim() || (role==='individual'?'Ayesha Khan':role==='ngo'?'Sara Hussain':role==='government'?'Ahmed Khan':'Zara Malik'),
    organization: role==='individual'?'My planting journey':role==='ngo'?'Gilgit Green Initiative':role==='government'?'Skardu Forest Department':'Green Horizon CSR',
  }
}
export function createDemoWorkspace(): Workspace {
  const campaignId=uid(), departmentCampaignId=uid(), competitionId=uid()
  const items: Array<[string,number,number,Tree['status'],number,number]> = [
    ['Chinar',1,1,'verified',0,0], ['Blue Pine',1,0,'growing',.012,.014],
    ['Apricot',1,0,'to-verify',-.012,.026], ['Chinar',120,106,'verified',.022,-.012],
    ['Willow',40,0,'growing',-.018,-.016], ['Walnut',1,0,'at-risk',.006,-.03],
    ['Blue Pine',65,58,'verified',-.026,.012], ['Poplar',25,0,'to-plant',.03,.03],
  ]
  const trees:Tree[]=items.map(([species,quantity,verifiedCount,status,dy,dx],index)=> {
    const person=demoPeople[index===3?0:index%4]
    return { id:uid(),planterId:person.id,planterName:person.name,species,quantity,verifiedCount,isPlot:quantity>1,lat:35.2971+dy,lng:75.6333+dx,
      location:['Satpara Road, Skardu','College nursery, Skardu','Shigar community plot','University plantation plot'][index%4],
      plantedAt:isoInDays(-35-index*3),status,photo:`/media/${index%3===0?'planting':index%3===1?'forest':'planter'}.jpg`,
      campaignId:index>=6?departmentCampaignId:campaignId,competitionId,nextWaterAt:isoInDays(index%3===0?-1:index%3===1?0:2),isDemo:true,notes:'Sample planting record for the TREEDAM demo.' }
  })
  return {
    version:1,revision:0,trees,
    campaigns:[
      {id:campaignId,name:'Green Skardu — Spring Plantation',area:'Skardu, Gilgit-Baltistan',target:500,description:'A community-led demo campaign bringing campuses, planters and the Forest Department together.',planters:demoPeople.map(p=>p.name),sponsor:'Green Horizon CSR',createdAt:isoInDays(-45),isDemo:true,department:'Gilgit Green Initiative'},
      {id:departmentCampaignId,name:'Skardu Forest Department — Nursery Drive',area:'Skardu district nursery',target:200,description:'A sample departmental drive for district audits and survival reporting.',planters:['Fatima Noor','Zain Ali'],sponsor:'Green Horizon CSR',createdAt:isoInDays(-50),isDemo:true,department:'Skardu Forest Department'},
    ],
    competitions:[{id:competitionId,name:'Skardu Green Campus League',audience:'Universities & Colleges',endsAt:isoInDays(14),prize:'Demo certificates, recognition & sapling kits',members:demoPeople.map(p=>p.name),completed:false,isDemo:true}],
    verifications:trees.filter(t=>t.status==='to-verify'||t.status==='verified').map(t=>({id:uid(),treeId:t.id,photo:'/media/planting.jpg',verdict:'alive',confidence:.94,status:t.status==='verified'?'approved':'pending',observedCount:t.status==='verified'?t.verifiedCount:1,createdAt:isoInDays(t.status==='verified'?-7:-1),notes:'Seeded demonstration proof. No AI comparison was performed.',isSimulated:true})),
    careEvents:[],audits:[],
  }
}
