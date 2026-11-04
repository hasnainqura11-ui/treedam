import { cloudPhotoUrl, uploadCloudPhoto } from './cloud'
function database():Promise<IDBDatabase> {
  return new Promise((resolve,reject)=> {
    const request=indexedDB.open('treedam-demo-photos',1)
    request.onupgradeneeded=()=>request.result.createObjectStore('photos')
    request.onsuccess=()=>resolve(request.result)
    request.onerror=()=>reject(new Error('Photo storage is unavailable in this browser.'))
  })
}
export async function preparePhoto(file:File):Promise<Blob> {
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPG, PNG or WebP photo.')
  if(file.size>8*1024*1024)throw new Error('Choose a photo smaller than 8 MB.')
  const bitmap=await createImageBitmap(file)
  const scale=Math.min(1,1200/Math.max(bitmap.width,bitmap.height))
  const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale)
  canvas.getContext('2d')!.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close()
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not prepare this photo.')),'image/jpeg',.82))
}
export async function storePhoto(file:File,provider:'demo'|'supabase') {
  const blob=await preparePhoto(file)
  if(provider==='supabase')return uploadCloudPhoto(blob)
  const id=crypto.randomUUID(),db=await database()
  await new Promise<void>((resolve,reject)=> {
    const tx=db.transaction('photos','readwrite');tx.objectStore('photos').put(blob,id)
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('Photo could not be saved. Check available browser storage.'))
  })
  db.close();return `idb:${id}`
}
export async function resolvePhoto(source:string) {
  if(source.startsWith('storage:')) return cloudPhotoUrl(source.slice(8))
  if(!source.startsWith('idb:'))return source
  const db=await database()
  const blob=await new Promise<Blob|undefined>((resolve,reject)=> {
    const request=db.transaction('photos').objectStore('photos').get(source.slice(4))
    request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('Photo could not be loaded.'))
  })
  db.close()
  if(!blob)throw new Error('This photo is no longer available in browser storage.')
  return URL.createObjectURL(blob)
}
export async function clearDemoPhotos() {
  const db=await database()
  await new Promise<void>((resolve,reject)=> {
    const tx=db.transaction('photos','readwrite');tx.objectStore('photos').clear()
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('Browser photo cleanup failed.'))
  })
  db.close()
}
