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
- [x] Landing restored and marketing routes checked
- [x] Four role demos and core workflows checked
- [x] Supabase schema/adapter supplied; remote execution blocked as described above
- [x] Verify production delivery: `figma make verify-deploy` passed; production route table inspected and all 35 generated public routes hydrated from the built HTML/JS in Chromium over a secure HTTPS test origin
- [ ] Remote Supabase table creation, cloud seeding, authentication and Storage verification — blocked by unavailable runtime configuration/tooling, not reported complete

## Static interface update
- Removed the decorative motion library, reveal/parallax observers, floating notifications, numeric count-ups, animated strip, shine effects, autoplay footage and unused video files.
- Reused the existing forest poster image in the same media frame. Kept the hero map, content, palette, typography and resting layout.
- Content and statistics now render immediately. Hover/focus states and interactive navigation remain usable without CSS animation or transitions.

## Verification evidence
- `pnpm exec tsc --noEmit` and whitespace checks passed.
- The managed production build passed: `/` is static, the fixed marketing/auth routes and `/app` routes are statically generated; only the unchanged platform/admin/API routes remain request-time rendered.
- Fresh production HTML/JS browser checks passed for all 35 public routes, with correct site title, no videos, no running frontend animations, no horizontal overflow and no runtime errors.
- Desktop/mobile demo checks passed for entry and all four roles, single-tree photo upload and browser GPS, IndexedDB photo reload, search/details, simulated single-tree verification, care logging, bulk-plot review and audited survivor limits.
- Campaign creation/assignment, government audit completion, frozen competition results, demo certificates, CSR impact, PDF and CSV exports passed.
- Created test records persisted after navigation and reload; a reviewed demo plot reflected its audited count of 69, not its full planted count of 75.
- Cloud Supabase operations were not exercised or claimed as passing.
