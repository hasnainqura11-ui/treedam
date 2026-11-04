/** One place to replace the explicitly simulated integrations later. */
export const treedamConfig = {
  backend: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    publicKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
    photoBucket: 'treedam-photos',
  },
  demo: {
    enabled: true,
    storageKey: 'treedam.workspace.v1',
    profileKey: 'treedam.demo-profile.v1',
    center: { lat: 35.2971, lng: 75.6333 },
    weather: { temperature: 22, humidity: 42, rainMm: 0, condition: 'Clear skies', location: 'Skardu' },
    verificationDelayMs: 1400,
    carbonKgPerVerifiedTreePerYear: 21,
  },
  integrations: { map: 'demo', weather: 'demo', verification: 'demo' } as const,
} as const

export const cloudAvailable = Boolean(treedamConfig.backend.url && treedamConfig.backend.publicKey)
