import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Layers, Users, Zap, Mail } from 'lucide-react'
import { TopNavbar } from './Layout'
import { SlackLogo, NotionLogo, LoomLogo } from './BrandIcons'
import { treePages, informationPages } from './treedamContent'

function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="inner-page"><TopNavbar />{children}</main>
}

export function ContentPage({ kind }: { kind: string }) {
  const key = kind === 'product' ? 'products' : kind === 'service' ? 'services' : kind === 'solution' ? 'solutions' : kind === 'insight' ? 'strategy' : kind
  const [title, description, items, descriptions] = treePages[key as keyof typeof treePages] || treePages.products
  const icons = [Layers, Users, Zap]
  return <PageShell>
    <section className="page-intro"><span className="eyebrow">TREEDAM / {key.toUpperCase()}</span><h1>{title}</h1><p>{description}</p><div className="button-row"><Link className="btn btn-primary" to="/signup">Start planting free <ArrowRight size={15} /></Link><Link className="btn btn-secondary" to="/contact">Talk to our team</Link></div></section>
    <section className="detail-grid">{items.map((item, i) => { const Icon = icons[i]; return <article key={item}><span className="detail-icon"><Icon size={23} /></span><h2>{item}</h2><p>{descriptions[i]}</p><Link to="/signup">Explore tree tracking <ArrowRight size={14} /></Link></article> })}</section>
    <section className="integration-feature" id="integrations"><div><span className="eyebrow">GROW GREENER, TOGETHER</span><h2>Your planting tools.<br />One connected forest.</h2><p>Bring tree locations, survival reports, and care alerts together for every planter.</p><Link className="btn btn-primary" to="/contact">Explore planting tools</Link></div><div className="tool-stack">{[[SlackLogo, 'Maps'], [NotionLogo, 'Reports'], [LoomLogo, 'Alerts']].map(([Icon, name]) => { const Logo = Icon as typeof SlackLogo; return <div key={String(name)}><Logo size={30} /><span>{String(name)}</span><Check size={16} /></div> })}</div></section>
  </PageShell>
}

export function PricingPage() {
  const [annual, setAnnual] = useState(true)
  return <PageShell><section className="page-intro"><span className="eyebrow">SIMPLE, FLEXIBLE PRICING</span><h1>More care for trees.<br />More living forests.</h1><p>Choose a tree-tracking plan that grows with your plantation.</p><div className="billing-toggle"><button aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button><button aria-pressed={annual} onClick={() => setAnnual(true)}>Yearly · Save 20%</button></div></section><section className="detail-grid pricing-grid">{['Free', 'Pro', 'Business'].map((name, i) => <article key={name} className={i === 1 ? 'featured-plan' : ''}>{i === 1 && <span className="eyebrow">MOST POPULAR</span>}<h2>{name}</h2><p>{['For individual planters and first seedlings.', 'For planting teams growing living forests.', 'For institutions coordinating plantation drives.'][i]}</p><div className="price">${i === 0 ? 0 : i === 1 ? annual ? 12 : 15 : annual ? 24 : 30}<small>/ user / month</small></div><Link className={`btn ${i === 1 ? 'btn-primary' : 'btn-secondary'}`} to="/signup">{i === 0 ? 'Start planting free' : 'Choose ' + name}</Link><ul>{['Tree records and survival tracking', i === 0 ? 'Up to 3 planters' : 'Unlimited planters', i === 0 ? 'Essential tree-tracking tools' : 'Advanced plantation tools', i === 2 ? 'Plantation support & onboarding' : 'Shared survival views'].map(text => <li key={text}><Check size={15} />{text}</li>)}</ul></article>)}</section><p className="demo-note">Illustrative plans. Contact our team to confirm availability and pricing.</p></PageShell>
}

export function AccountPage({ mode }: { mode: 'signin' | 'signup' }) {
  const [submitted, setSubmitted] = useState(false)
  return <PageShell><section className="account-layout"><div><span className="eyebrow">YOUR NEXT LIVING FOREST STARTS HERE</span><h1>Make room for<br />a greener future.</h1><p>From one seedling to whole forests, track every tree in one place and keep your planters growing together.</p><div className="account-proof"><Check size={18} />GPS-tagged trees. Consistent care. Survival evidence.</div></div><div className="account-card"><h2>{mode === 'signin' ? 'Welcome back' : 'Start planting today'}</h2><p>{mode === 'signin' ? 'Sign in to your TREEDAM planting account.' : 'Your tree-survival platform is one step away.'}</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>{mode === 'signup' && <label>Full name<input autoComplete="name" required placeholder="Your name" /></label>}<label>Email address<input type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required placeholder="At least 8 characters" /></label><button className="btn btn-primary" type="submit">{mode === 'signin' ? 'Sign in' : 'Create your account'}<ArrowRight size={15} /></button>{submitted && <p className="form-notice" role="status">This is a preview. Account creation and sign-in are not connected yet; no account has been created or authenticated.</p>}</form><p className="account-switch">{mode === 'signin' ? 'New to TREEDAM?' : 'Already have an account?'} <Link to={mode === 'signin' ? '/signup' : '/signin'}>{mode === 'signin' ? 'Sign up' : 'Sign in'}</Link></p><small className="demo-note">Preview only · Do not enter a real password.</small></div></section></PageShell>
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  return <PageShell><section className="account-layout"><div><span className="eyebrow">LET’S GROW GREENER, TOGETHER</span><h1>A greener future<br />starts with a hello.</h1><p>Have a question about TREEDAM? Tell us about your planting drive, tree-care needs, or survival verification goals.</p><div className="account-proof"><Mail size={20} />Tree tracking, care plans & demos</div></div><div className="account-card"><h2>Contact us</h2><p>We’d love to hear what you’re planting.</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}><label>Full name<input required autoComplete="name" placeholder="Your name" /></label><label>Email address<input required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>How can we help?<select><option>Book a demo</option><option>Talk to our team</option><option>Tree-tracking support</option><option>Something else</option></select></label><label>Message<textarea required rows={4} placeholder="Tell us a little about your planting drive…" /></label><button className="btn btn-primary">Send message <ArrowRight size={15} /></button>{submitted && <p className="form-notice" role="status">Preview only: your message has not been sent. A backend connection is needed to receive submissions.</p>}</form></div></section></PageShell>
}

export function NotFoundPage() {
  return <PageShell><section className="page-intro"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>Let’s get you back on track.</h1><p>This page doesn’t exist. Your next living forest still can.</p><Link to="/" className="btn btn-primary">Back to home</Link></section></PageShell>
}

export function InformationPage({ kind }: { kind: keyof typeof informationPages }) {
  const page = informationPages[kind]
  const icons = [Layers, Users, Zap]
  return <PageShell>
    <section className="page-intro">
      <span className="eyebrow">TREEDAM / {kind.toUpperCase()}</span>
      <h1>{page.title}</h1>
      <p>{page.description}</p>
      <div className="button-row">
        <Link className="btn btn-primary" to="/contact">Talk to our team <ArrowRight size={15} /></Link>
        <Link className="btn btn-secondary" to="/">Back to home</Link>
      </div>
    </section>
    <section className="detail-grid">
      {page.sections.map(([title, text], index) => {
        const Icon = icons[index % icons.length]
        return <article key={title}>
          <span className="detail-icon"><Icon size={23} /></span>
          <h2>{title}</h2>
          <p>{text}</p>
        </article>
      })}
    </section>
    {'note' in page && <p className="demo-note">{page.note}</p>}
  </PageShell>
}
