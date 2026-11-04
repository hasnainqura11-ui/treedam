# TREEDAM demo delivery

## Current integration status
- The platform acknowledged Supabase connection, but supplied no `utils/supabase/info.tsx`, Supabase function files, Supabase environment variables, SQL execution tools, or project resources to this workspace.
- Remote schema creation, seeding, cloud authentication and Storage cannot honestly be reported as executed.
- The runnable demo uses explicitly labeled browser-local workspace data. Photos are kept as blobs in IndexedDB; demo records are kept in localStorage.
- Supabase uses its official auth/client SDK. A schema and adapter are supplied, not a second custom authentication implementation.
- Demo personas are workspace views, not authenticated accounts. Passwords are never saved by the demo.
- Map, weather and verification are simulated and controlled from `src/config/treedam.ts`.
- Demo verification and carbon assumptions are prominently labeled; they are not real AI evidence or certified carbon credits.

## Design/migration
- Studied the rendered live reference before app UI edits: `https://treedam.vercel.app/`.
- Restored the pre-transition site from commit `916f950`, adapting routing to Next.js and content images to Next Image.
- Retained Payload's platform-owned configuration, collections, routes, custom image loader and lifecycle scripts.
- Existing navigation, marketing copy, media references and dashboard illustration constants remain presentational. User records belong in Supabase when its runtime configuration is exposed, not duplicate Payload collections.

## Delivery checklist
- [ ] Landing restored and marketing routes checked
- [ ] Four role demos and core workflows checked
- [ ] Supabase schema/adapter supplied; remote execution blocked as described above
- [ ] Verify production delivery: run `figma make verify-deploy`, inspect static route table and visit all generated public routes
