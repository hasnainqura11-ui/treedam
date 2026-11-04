'use client'
import { useState } from 'react'
import { Link } from './routing'
import { ArrowRight, Camera, Check, Droplets, GraduationCap, Heart, Leaf, MapPin, ShieldCheck, Sprout, Trees, Trophy, Users } from 'lucide-react'
import { TreeDashboard } from './TreeDashboard'
import { StatNumber, EditorialSection, FeatureSection, PageActions, PageCTA, PageFrame, PageHero, ContentBlock, type Feature } from './PageSections'

const platformFeatures: Feature[] = [
  { title: 'Every tree, GPS-tagged', text: 'Record a planting photo and its location so each tree has a place in your plantation records.', icon: MapPin },
  { title: 'AI survival checks', text: 'Compare follow-up photos with planting evidence to support survival checks and flag records for review.', icon: Camera },
  { title: 'Care reminders, automatic', text: 'Keep watering and nutrition on schedule with clear reminders for every assigned caretaker.', icon: Droplets },
  { title: 'Team competitions', text: 'Bring planters together around live leaderboards that celebrate trees still growing, not just trees planted.', icon: Trophy },
]

const audiences: Feature[] = [
  { title: 'Forest Departments', text: 'Coordinate plots, caretakers, and survival reviews across public plantation drives.', icon: Trees },
  { title: 'Climate NGOs', text: 'Keep planting records and follow-up evidence together for clear supporter reporting.', icon: Leaf },
  { title: 'Universities & Colleges', text: 'Turn campus planting drives into competitions that reward lasting tree survival.', icon: GraduationCap },
  { title: 'CSR Teams', text: 'Connect plantation support with location records and evidence your stakeholders can review.', icon: Heart },
  { title: 'Farmers & Planters', text: 'Tag a new tree, keep up with its care, and see its growth story in one place.', icon: Sprout },
]

const carePlans: Feature[] = [
  { title: 'Basic Care', text: 'Give every tree a caretaker, a watering schedule, and a clear place in your planting records.', icon: Droplets },
  { title: 'Care & Verify', text: 'Pair consistent care with follow-up photos and survival checks that document each tree’s progress.', icon: ShieldCheck },
  { title: 'Full Plantation Care', text: 'Coordinate plots, caretakers, care rounds, and survival reporting across your whole plantation.', icon: Trees },
]

const heroCopy = {
  platform: ['PLATFORM', 'Every tree. One living story.', 'Your all-in-one tree survival platform. GPS-tag your plantings, coordinate care, and turn follow-up photos into survival evidence.'],
  solutions: ['SOLUTIONS', 'Different planters. One greener future.', 'From forest departments to first-time planters, bring planting, caring, and proving together in one beautifully simple place.'],
  plans: ['CARE PLANS', 'Planting is the beginning. Care makes a forest.', 'Choose the right care approach for your seedlings, your caretakers, and the forest you want to grow.'],
  impact: ['IMPACT & INSIGHTS', 'Don’t just count plantings. Prove what lives.', 'Make tree survival visible with location records, consistent care, and evidence that supporters can understand.'],
  about: ['OUR STORY', 'From Skardu, for a greener planet.', 'TREEDAM is a tree-survival platform from Skardu that won 1st place at the Trillion Tree Hackathon. We believe every planted tree deserves a future.'],
} as const

export type MarketingKind = keyof typeof heroCopy

export function MarketingPage({ kind }: { kind: MarketingKind }) {
  const [eyebrow, title, text] = heroCopy[kind]
  return <PageFrame>
    <PageHero eyebrow={eyebrow} title={title} text={text} image={kind === 'about' ? 'planter' : kind === 'platform' ? 'planting' : 'forest'} />
    {kind === 'platform' && <>
      <FeatureSection title="Tree survival, simplified for every planter" text="Four connected ways to keep your planting promise." items={platformFeatures} twoColumns />
      <section className="smart page-section">
        <ContentBlock className="section-heading"><h2>Your whole plantation,<br />in one clear view.</h2><p>Organize plantings, assign caretakers, and monitor survival with a smart platform built to improve growth and teamwork.</p><PageActions /></ContentBlock>
        <ContentBlock><TreeDashboard /></ContentBlock>
      </section>
    </>}
    {kind === 'solutions' && <>
      <FeatureSection title="Built for everyone who plants" text="One shared purpose. A place for every planting community." items={audiences} />
      <FeatureSection title="Planting. Caring. Proving." text="A simple cycle that keeps the forest growing." items={[
        { title: '01 / Planting', text: 'Plant a tree, take its first photo, and record its GPS location. A new tree’s story starts with a clear record.', icon: Sprout },
        { title: '02 / Caring', text: 'Assign a caretaker, plan watering rounds, and keep your planting team connected through care reminders.', icon: Droplets },
        { title: '03 / Proving', text: 'Return with follow-up photos, review survival evidence, and share verified progress with your supporters.', icon: ShieldCheck },
      ]} />
    </>}
    {kind === 'plans' && <>
      <FeatureSection title="The right care for every planting" text="Start with a single tree or coordinate a whole plantation." items={carePlans} />
      <EditorialSection eyebrow="CARE BEYOND PLANTING DAY" title="Better care gives every tree a better chance." text="A missed watering day can matter. Clear caretaker assignments, timely reminders, and regular survival reviews help teams notice problems early and keep returning to their trees." image="planting">
        <div className="care-checklist">{['Assign a responsible caretaker', 'Plan watering and nutrition', 'Return, photograph, and verify'].map(item => <p key={item}><Check size={15} />{item}</p>)}</div><PageActions />
      </EditorialSection>
    </>}
    {kind === 'impact' && <>
      <section className="page-section">
        <ContentBlock className="section-heading"><h2>Planting matters.<br />Survival makes the difference.</h2><p>Keep the challenge, the opportunity, and the purpose in view.</p></ContentBlock>
        <ContentBlock className="stats page-stats">
          <article><b><StatNumber value={44} suffix="%" /></b><p>of planted trees die unverified.</p></article>
          <article><b><StatNumber value={22} prefix="$" suffix="/t" /></b><p>Verified tree carbon is worth $22 per ton.</p></article>
          <article><b>Fresh air</b><p>Every surviving tree gives fresh air.</p></article>
        </ContentBlock>
        <p className="demo-note">Carbon values are indicative, not a guaranteed payment. Credits require applicable verification and certification.</p>
      </section>
      <EditorialSection eyebrow="EVIDENCE, NOT JUST A PLANTING TOTAL" title="Proof that funders can follow." text="Connect every planting to a location and a first photo. Add care records and follow-up photos, review the evidence, and share a clear survival report. Supporters can see what was planted, what was checked, and what is still growing." image="forest" />
    </>}
    {kind === 'about' && <>
      <EditorialSection eyebrow="OUR MISSION" title="Every planted tree actually survives." text="Our story begins in Skardu, Gilgit-Baltistan. Winning 1st place at the Trillion Tree Hackathon strengthened our purpose: move beyond planting-day numbers and help people care for living trees. We want every planted tree to survive, grow into a forest, and give humans fresh air." image="planting" />
      <FeatureSection title="Plant. Verify. Protect." text="Three simple commitments behind every TREEDAM tree record." items={[
        { title: 'Plant', text: 'Give every seedling a clear beginning with a planting photo, a GPS location, and someone responsible for its care.', icon: Sprout },
        { title: 'Verify', text: 'Return with follow-up evidence so survival can be checked rather than assumed.', icon: ShieldCheck },
        { title: 'Protect', text: 'Keep care consistent and communities connected so planting becomes a long-term promise.', icon: Heart },
      ]} />
    </>}
    <PageCTA />
  </PageFrame>
}

export function PricingPage() {
  const [annual, setAnnual] = useState(true)
  return <PageFrame>
    <PageHero eyebrow="PRICING" title="A plan for every planter. Room for every forest." text="Start with a seedling, grow with your team, and choose the level of tree tracking your plantation needs." image="planting" />
    <section className="page-section">
      <ContentBlock className="section-heading"><h2>Simple plans. A lasting purpose.</h2><p>Choose a starting point for your planting community.</p><div className="billing-toggle"><button aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button><button aria-pressed={annual} onClick={() => setAnnual(true)}>Yearly · Save 20%</button></div></ContentBlock>
      <div className="detail-grid pricing-grid page-detail-grid">
        {['Planter', 'NGO', 'Institution'].map((name, i) => <ContentBlock key={name}><article className={i === 1 ? 'featured-plan' : ''}>
          {i === 1 && <span className="eyebrow">FOR PLANTING TEAMS</span>}<h2>{name}</h2>
          <p>{['For individual planters and their first trees.', 'For NGOs coordinating care and survival evidence.', 'For institutions managing multiple planting drives.'][i]}</p>
          <div className="price">{i === 0 ? 'Free' : i === 1 ? `$${annual ? 12 : 15}` : 'Custom'}<small>{i === 0 ? 'Start your planting journey' : i === 1 ? `per planter / month · ${annual ? 'billed yearly' : 'billed monthly'}` : 'A plan shaped around your plantation'}</small></div>
          <Link className={`btn ${i === 1 ? 'btn-primary' : 'btn-secondary'}`} to={i === 0 ? '/signup' : '/contact'}>{i === 0 ? 'Start planting free' : 'Talk to our team'}</Link>
          <ul>{['Tree records and survival tracking', i === 0 ? 'Individual tree-care reminders' : 'Coordinated caretaker teams', i === 2 ? 'Multi-drive survival reporting' : 'Planting and follow-up photos', i === 2 ? 'Plantation support & onboarding' : 'Clear survival records'].map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>
        </article></ContentBlock>)}
      </div>
      <p className="demo-note">Illustrative plans and NGO pricing. Confirm availability, limits, and pricing with our team before subscribing.</p>
    </section>
    <FeatureSection title="Every plan starts with a tree." text="The essentials for clearer records and more consistent care." items={[
      { title: 'A place for every tree', text: 'Keep planting photos and GPS locations together in an easy-to-follow tree record.', icon: MapPin },
      { title: 'Care after planting day', text: 'Record who cares for each tree and when it needs attention.', icon: Droplets },
      { title: 'Evidence of survival', text: 'Add follow-up photos and keep survival checks connected to the original planting.', icon: ShieldCheck },
    ]} />
    <PageCTA />
  </PageFrame>
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  return <PageFrame>
    <PageHero eyebrow="CONTACT" title="A greener future starts with a hello." text="Tell us about your planting drive, tree-care needs, or survival verification goals. Let’s find the right path for your forest." image="planter" />
    <section className="account-layout" id="contact-form">
      <ContentBlock><span className="eyebrow">LET’S GROW GREENER, TOGETHER</span><h2 className="contact-intro-title">One conversation.<br />A lasting planting promise.</h2><p className="contact-intro-copy">Whether you care for one seedling or coordinate a whole department, we’d love to hear what you’re planting.</p><div className="account-proof"><Leaf size={20} />Tree tracking, care plans & survival evidence</div></ContentBlock>
      <ContentBlock className="account-card"><h2>Contact us</h2><p>We’d love to hear what you’re planting.</p>
        <form onSubmit={event => { event.preventDefault(); setSubmitted(true) }}>
          <label>Full name<input required autoComplete="name" placeholder="Your name" /></label>
          <label>Email address<input required type="email" autoComplete="email" placeholder="you@example.com" /></label>
          <label>How can we help?<select><option>Book a demo</option><option>Care plans & pricing</option><option>Tree-tracking support</option><option>Share a planting story</option><option>Something else</option></select></label>
          <label>Message<textarea required rows={4} placeholder="Tell us a little about your planting drive…" /></label>
          <button type="submit" className="btn btn-primary">Send message <ArrowRight size={15} /></button>
          {submitted && <p className="form-notice" role="status">Preview only: your message has not been sent. A backend connection is needed to receive submissions.</p>}
          <p className="demo-note">Preview form — messages are not yet delivered.</p>
        </form>
      </ContentBlock>
    </section>
    <FeatureSection title="Rooted in Skardu. Open to every planter." items={[
      { title: 'Our roots', text: 'Skardu, Gilgit-Baltistan, Pakistan — where TREEDAM’s tree-survival story began.', icon: MapPin },
      { title: 'Planting partnerships', text: 'Forest departments, NGOs, campuses, CSR teams, and planters can use the form above to describe a proposed planting partnership.', icon: Users },
      { title: 'Care & verification questions', text: 'Ask about tree records, care plans, competition rules, or survival evidence. Please do not send passwords or sensitive location details.', icon: ShieldCheck },
    ]} />
    <PageCTA />
  </PageFrame>
}
