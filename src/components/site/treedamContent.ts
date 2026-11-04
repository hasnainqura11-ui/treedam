export const treePages = {
  products: [
    'Your all-in-one tree survival workspace',
    'Plant trees, assign caretakers, and track survival in one simple platform. Keep every planter motivated and every tree counted.',
    ['Every tree, GPS-tagged', 'Care that stays on schedule', 'Survival you can verify'],
    ['Record a planting photo and its location so every tree has a place in your plantation records.', 'Plan watering and nutrition, assign caretakers, and keep your planting team ready for the next care round.', 'Compare follow-up photos with planting records to document survival and share evidence with supporters.'],
  ],
  services: [
    'Care plans for living forests.',
    'Support every plantation with consistent care, clear records, and survival checks that keep planters connected.',
    ['Plantation onboarding', 'Tree care planning', 'Support for institutions'],
    ['Help your campus, department, or community plan a drive, organize plots, and record its first trees.', 'Create watering and nutrition schedules that give caretakers a clear view of each tree’s needs.', 'Coordinate plantation records, caretaker teams, and survival reporting across your institution.'],
  ],
  solutions: [
    'Tree survival, simplified for every planter',
    'One connected platform for plantation planning, team competitions, and AI-assisted survival checks.',
    ['Plantation planning', 'Team competitions', 'AI survival checks'],
    ['Organize planting drives, identify plots, and assign caretakers so every seedling has someone looking after it.', 'Bring campuses, forest departments, and community groups together around verified survival counts, not planting totals alone.', 'Use follow-up photos and GPS records to support survival verification. Review evidence before sharing an impact claim.'],
  ],
  strategy: [
    'Grow forests. Show the impact.',
    'Turn planting records into clear survival insights for planters, institutions, and supporters.',
    ['Plant with a purpose', 'Care as a community', 'Share survival evidence'],
    ['Plan species, locations, and caretaker responsibilities before a seedling goes into the ground.', 'Use care reminders and team competitions to encourage consistent attention after planting day.', 'Track follow-up photos and survival records so funders can see the evidence behind a plantation’s progress.'],
  ],
  about: [
    'From Skardu, for a greener planet.',
    'TREEDAM is a tree-survival verification platform from Skardu and winner of the Trillion Tree Hackathon. Our mission is to make sure every planted tree actually survives and gives humans fresh air.',
    ['Rooted in Skardu', 'Built to prove survival', 'Fresh air for our future'],
    ['Our story begins in Skardu, Gilgit-Baltistan, with a simple belief: planting a seedling is a promise to care for it long after planting day.', 'As a winner of the Trillion Tree Hackathon, TREEDAM puts tree survival at the heart of planting. GPS-tagged records, follow-up photos, and care reminders help turn that promise into evidence.', 'We bring planters, institutions, and supporters together to grow living forests. Every tree that survives is another step toward a greener Earth and fresh air for people.'],
  ],
} as const

export const informationPages = {
  privacy: {
    title: 'Privacy Policy',
    description: 'Tree verification should protect both the planet and the people caring for it. TREEDAM’s policy is to never sell your data.',
    sections: [
      ['GPS locations and photos', 'TREEDAM collects tree GPS locations and planting and follow-up photos only to verify planted trees and their survival. Please avoid including faces, private documents, or unrelated personal information in tree photos.'],
      ['Your information is never sold', 'TREEDAM does not sell account information, tree photographs, or GPS records. Tree-verification data is not collected for advertising or unrelated profiling.'],
      ['Accounts and communications', 'Information you provide for an account or enquiry is used to identify you, communicate with you, and support your participation in the platform.'],
      ['Sharing tree records', 'Share tree evidence only with the people or institutions involved in verification and reporting. Seek permission before publishing another person’s photos or sensitive location details.'],
      ['Your choices', 'You may ask about access, correction, or deletion of your information through Contact Us. Verification records that must be retained for a competition or legal obligation should be explained before retention.'],
      ['Current preview', 'The browser-local demo saves tree records in localStorage and uploaded photos in IndexedDB on this device. Device GPS is requested with browser permission. Cloud storage and account features require available Supabase configuration and the supplied schema; they are not silently simulated.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    description: 'Use TREEDAM responsibly to record plantings, care for trees, and share honest survival evidence.',
    sections: [
      ['User accounts', 'Provide accurate account information and keep your credentials private. Do not impersonate another planter or use an account without permission. Demo role entry is not authentication. Supabase account operations are available only when its runtime connection and schema are provisioned.'],
      ['Tree records', 'Submit only planting locations, photos, and care information you are entitled to share. Do not duplicate trees, falsify locations, or submit misleading survival evidence. Obtain landowner permission before planting or recording on private land.'],
      ['Verification', 'Photo comparisons and AI-assisted checks support review; they are not a guarantee of survival or a substitute for field assessment. Records may require further evidence, correction, or human review.'],
      ['Competitions', 'Each competition must publish its eligibility criteria, entry period, survival-check requirements, and scoring rules. Fair participation requires original evidence and accurate tree counts.'],
      ['Certificates and prizes', 'Certificates, awards, and prizes depend on the specific competition’s published rules and verified results. Participation does not guarantee a certificate, prize, carbon credit, or payment.'],
      ['Responsible participation', 'Respect local planting rules, suitable species, other participants, and privacy. Contact TREEDAM to raise concerns about a record or result. Available features and plan terms should be confirmed before relying on this preview.'],
    ],
  },
  security: {
    title: 'Protecting tree records. Respecting planters.',
    description: 'Clear evidence and responsible data handling are essential to trust in tree-survival verification.',
    sections: [
      ['Location awareness', 'Tree GPS records can reveal private land and sensitive locations. Share only the location detail necessary for verification and authorized plantation reporting.'],
      ['Photo responsibility', 'Use original tree photos and keep unrelated personal details out of the frame. Ask for consent when other people or private property could be identified.'],
      ['Account safety', 'Demo entry never asks for or stores a password. When Supabase accounts are enabled, use a unique password and the official account flow; never share credentials.'],
      ['Honest evidence', 'Check timestamps, locations, and follow-up images carefully. AI-assisted comparisons support verification, but uncertain evidence should be reviewed rather than treated as proof.'],
      ['Report a concern', 'Use Contact Us to describe suspicious records or a security concern without including passwords or private tree coordinates. The current contact form is a preview and does not transmit reports.'],
      ['Transparent status', 'Browser-local demo records and photos remain on this device. Supabase support includes a prepared private schema and storage adapter, but remote provisioning has not been verified from this workspace. All map, weather, AI and certificate demonstrations remain simulated, and no security certification is claimed.'],
    ],
  },
  stories: {
    title: 'Planter Stories',
    description: 'From a single seedling to a community forest, lasting impact begins with people who keep showing up.',
    sections: [
      ['A campus that keeps caring', 'An illustrative planting journey: students share caretaking rounds, record follow-up photos, and compete on trees that survive rather than seedlings planted on a single day.'],
      ['A department with clearer records', 'An illustrative planting journey: a forest department organizes plots, assigns caretakers, and brings location records and survival evidence together for review.'],
      ['A planter’s long-term promise', 'An illustrative planting journey: a local planter records a new tree, follows its watering needs, and returns with photos that show how it is growing.'],
    ],
    note: 'These are illustrative use cases, not published testimonials or verified project results. Contact us to share your own planting story.',
  },
  careers: {
    title: 'Grow a greener future with TREEDAM.',
    description: 'Help make tree survival count, from our roots in Skardu to planting communities everywhere.',
    sections: [
      ['Care for living forests', 'We value people who believe a planting drive is only the beginning, and that long-term care matters as much as planting day.'],
      ['Build trust through evidence', 'Bring curiosity about tree records, responsible technology, and clear survival reporting that planters and supporters can understand.'],
      ['Start a conversation', 'Use Contact Us to express interest in contributing. No specific vacancies are advertised on this page.'],
    ],
  },
} as const
