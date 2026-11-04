import { treedamConfig } from '@/config/treedam'
import type { Tree, Verification } from './types'
export function demoWeather() { return { ...treedamConfig.demo.weather, simulated:true } }
export function careGuidance(tree:Tree) {
  const liters = ['Blue Pine','Poplar'].includes(tree.species)?1.5:2
  return { liters, totalLiters:liters*tree.quantity, everyDays:2, nutrition:'Light compost at the next scheduled care round.', simulated:true }
}
export async function simulateVerification(verdict:Verification['verdict']) {
  await new Promise(resolve=>setTimeout(resolve,treedamConfig.demo.verificationDelayMs))
  return { verdict,confidence:verdict==='alive'?.94:verdict==='at-risk'?.88:.54,notes:'Simulated result only. No Gemini request or AI image comparison was performed.' }
}
