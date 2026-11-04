'use client'
import { useState } from 'react'
import { Link } from './routing'
import { ArrowRight, Check, Layers, Users, Zap } from 'lucide-react'
import { informationPages } from './treedamContent'
import { MarketingPage, type MarketingKind } from './MarketingPages'
import { PageFrame as PageShell, PageHero, FeatureSection, EditorialSection, PageCTA, Reveal } from './PageSections'
export { PricingPage, ContactPage } from './MarketingPages'

export function ContentPage({ kind }: { kind: string }) {
  const aliases: Record<string, MarketingKind> = { products: 'platform', product: 'platform', services: 'plans', service: 'plans', solution: 'solutions', strategy: 'impact', insight: 'impact' }
  const key = aliases[kind] || kind as MarketingKind
  return <MarketingPage kind={key} />
}

export function AccountPage({ mode }: { mode: 'signin' | 'signup' }) {
  const [submitted, setSubmitted] = useState(false)
  return <PageShell><section className="account-layout"><div><span className="eyebrow">YOUR NEXT LIVING FOREST STARTS HERE</span><h1>Make room for<br />a greener future.</h1><p>From one seedling to whole forests, track every tree in one place and keep your planters growing together.</p><div className="account-proof"><Check size={18} />GPS-tagged trees. Consistent care. Survival evidence.</div></div><div className="account-card"><h2>{mode === 'signin' ? 'Welcome back' : 'Start planting today'}</h2><p>{mode === 'signin' ? 'Sign in to your TREEDAM planting account.' : 'Your tree-survival platform is one step away.'}</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>{mode === 'signup' && <label>Full name<input autoComplete="name" required placeholder="Your name" /></label>}<label>Email address<input type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required placeholder="At least 8 characters" /></label><button className="btn btn-primary" type="submit">{mode === 'signin' ? 'Sign in' : 'Create your account'}<ArrowRight size={15} /></button>{submitted && <p className="form-notice" role="status">This is a preview. Account creation and sign-in are not connected yet; no account has been created or authenticated.</p>}</form><p className="account-switch">{mode === 'signin' ? 'New to TREEDAM?' : 'Already have an account?'} <Link to={mode === 'signin' ? '/signup' : '/signin'}>{mode === 'signin' ? 'Sign up' : 'Sign in'}</Link></p><small className="demo-note">Preview only · Do not enter a real password.</small></div></section>{mode === 'signup' && <><FeatureSection title="A simple start for every planter" items={[
    { title: 'Plant', text: 'Keep a planting photo and GPS location together for each new tree.', icon: Layers },
    { title: 'Care', text: 'Build a regular care routine and give every seedling someone to look after it.', icon: Users },
    { title: 'Prove', text: 'Return with follow-up photos and review the evidence that your trees are still growing.', icon: Zap },
  ]} /><EditorialSection eyebrow="GROW GREENER, TOGETHER" title="One seedling is a beautiful beginning." text="Join a planting community that treats care as a long-term promise. From Skardu to every future forest, tree survival comes first." image="planting" /><PageCTA /></>}</PageShell>
}


export function NotFoundPage() {
  return <PageShell><section className="page-intro"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>Let’s get you back on track.</h1><p>This page doesn’t exist. Your next living forest still can.</p><Link to="/" className="btn btn-primary">Back to home</Link></section></PageShell>
}


export function InformationPage({ kind }: { kind: keyof typeof informationPages }) {
  const page = informationPages[kind]
  const icons = [Layers, Users, Zap]
  return <PageShell>
    <PageHero eyebrow={kind.toUpperCase()} title={page.title} text={page.description} image={kind === 'stories' || kind === 'careers' ? 'planter' : 'forest'} />
    <section className="page-section">
      <Reveal className="section-heading"><h2>{kind === 'stories' ? 'Every forest starts with people.' : kind === 'careers' ? 'Purpose, rooted in survival.' : 'Clear principles. Responsible planting.'}</h2></Reveal>
      <div className="detail-grid page-detail-grid">
        {page.sections.map(([title, text], index) => {
          const Icon = icons[index % icons.length]
          return <Reveal key={title} delay={(index % 3) * .06}><article className="page-feature-card">
            <span className="detail-icon"><Icon size={23} /></span><h2>{title}</h2><p>{text}</p>
          </article></Reveal>
        })}
      </div>
      {'note' in page && <p className="demo-note">{page.note}</p>}
    </section>
    <EditorialSection eyebrow="ROOTED IN CARE" title={kind === 'stories' ? 'Your planting story could inspire the next.' : 'A greener future starts with trust.'} text={kind === 'stories' ? 'Have a planting story to share? Tell us about the trees, the people who care for them, and the evidence of their survival. We only publish real stories with permission.' : kind === 'careers' ? 'Tell us how you would like to contribute to a future where planting and long-term tree care belong together.' : 'Ask questions about tree records, responsible use, privacy, and survival evidence before sharing sensitive information. This website is a preview; forms and accounts are not connected yet.'} image="planting">
      <div className="button-row"><Link className="btn btn-primary" to="/contact">Talk to our team <ArrowRight size={15} /></Link></div>
    </EditorialSection>
    <PageCTA />
  </PageShell>
}
