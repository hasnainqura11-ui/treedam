import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Check, Layers, Users, Zap, Mail } from 'lucide-react'
import { TopNavbar } from './Layout'
import { SlackLogo, NotionLogo, LoomLogo } from './BrandIcons'

const content = {
  products: ['Your all-in-one task management workspace', 'Plan tasks, assign responsibilities, and track progress in one simple platform.', ['Task & project tracking', 'Your tools, connected', 'A clearer view of every project']],
  services: ['Better workflows. Exceptional teamwork.', 'From your first workspace to your next big launch, get support that keeps your team moving forward.', ['Workspace onboarding', 'Workflow optimization', 'Dedicated team support']],
  solutions: ['Simplify task management for modern teams', 'One beautifully simple workspace for every team, every task, and every ambitious idea.', ['Project management', 'Team collaboration', 'Remote teams']],
  strategy: ['Less busywork. More meaningful progress.', 'Build a smarter strategy for your team with clear priorities, connected workflows, and shared goals.', ['Set your priorities', 'Align your team', 'Measure what matters']],
  about: ['Great work starts with a connected team.', 'TREEDAM brings your people, projects, and tools together so you can focus on the work that matters.', ['Clarity over complexity', 'Built for collaboration', 'Room to grow']],
} as const

function PageShell({ children }: { children: React.ReactNode }) {
  return <main className="inner-page"><TopNavbar />{children}</main>
}

export function ContentPage({ kind }: { kind: string }) {
  const key = kind === 'product' ? 'products' : kind === 'service' ? 'services' : kind === 'solution' ? 'solutions' : kind === 'insight' ? 'strategy' : kind
  const [title, description, items] = content[key as keyof typeof content] || content.products
  const icons = [Layers, Users, Zap]
  return <PageShell>
    <section className="page-intro"><span className="eyebrow">TREEDAM / {key.toUpperCase()}</span><h1>{title}</h1><p>{description}</p><div className="button-row"><Link className="btn btn-primary" to="/signup">Get started free <ArrowRight size={15} /></Link><Link className="btn btn-secondary" to="/contact">Talk to sales team</Link></div></section>
    <section className="detail-grid">{items.map((item, i) => { const Icon = icons[i]; return <article key={item}><span className="detail-icon"><Icon size={23} /></span><h2>{item}</h2><p>{['Break down complex projects into manageable tasks. Organize priorities and keep every deadline in view.', 'Bring conversations, documents, and people into one place. Keep everyone aligned with shared goals.', 'Track progress with a clear overview of your work. Spend less time managing and more time moving forward.'][i]}</p><Link to="/signup">Explore your workspace <ArrowRight size={14} /></Link></article> })}</section>
    <section className="integration-feature" id="integrations"><div><span className="eyebrow">BETTER, TOGETHER</span><h2>Your favorite tools.<br />One connected workspace.</h2><p>Keep your team’s work in one place with Slack, Notion, and Loom.</p><Link className="btn btn-primary" to="/contact">Explore integrations</Link></div><div className="tool-stack">{[[SlackLogo, 'Slack'], [NotionLogo, 'Notion'], [LoomLogo, 'Loom']].map(([Icon, name]) => { const Logo = Icon as typeof SlackLogo; return <div key={String(name)}><Logo size={30} /><span>{String(name)}</span><Check size={16} /></div> })}</div></section>
  </PageShell>
}

export function PricingPage() {
  const [annual, setAnnual] = useState(true)
  return <PageShell><section className="page-intro"><span className="eyebrow">SIMPLE, FLEXIBLE PRICING</span><h1>A little less effort.<br />A lot more possibility.</h1><p>Choose a workspace that grows with your team.</p><div className="billing-toggle"><button aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button><button aria-pressed={annual} onClick={() => setAnnual(true)}>Yearly · Save 20%</button></div></section><section className="detail-grid pricing-grid">{['Free', 'Pro', 'Business'].map((name, i) => <article key={name} className={i === 1 ? 'featured-plan' : ''}>{i === 1 && <span className="eyebrow">MOST POPULAR</span>}<h2>{name}</h2><p>{['For personal projects and getting started.', 'For teams ready to do their best work.', 'For growing organizations and bigger goals.'][i]}</p><div className="price">${i === 0 ? 0 : i === 1 ? annual ? 12 : 15 : annual ? 24 : 30}<small>/ user / month</small></div><Link className={`btn ${i === 1 ? 'btn-primary' : 'btn-secondary'}`} to="/signup">{i === 0 ? 'Get started free' : 'Choose ' + name}</Link><ul>{['Task and project management', i === 0 ? 'Up to 3 team members' : 'Unlimited team members', i === 0 ? 'Essential workspace tools' : 'Advanced integrations', i === 2 ? 'Priority support & onboarding' : 'Shared team views'].map(text => <li key={text}><Check size={15} />{text}</li>)}</ul></article>)}</section><p className="demo-note">Illustrative plans. Contact our team to confirm availability and pricing.</p></PageShell>
}

export function AccountPage({ mode }: { mode: 'signin' | 'signup' }) {
  const [submitted, setSubmitted] = useState(false)
  return <PageShell><section className="account-layout"><div><span className="eyebrow">YOUR NEXT GREAT PROJECT STARTS HERE</span><h1>Make room for<br />your best work.</h1><p>From small tasks to complex projects, manage everything in one place and keep your team moving forward.</p><div className="account-proof"><Check size={18} />Clear priorities. Connected teams. Better work.</div></div><div className="account-card"><h2>{mode === 'signin' ? 'Welcome back' : 'Start building today'}</h2><p>{mode === 'signin' ? 'Sign in to your TREEDAM workspace.' : 'Your all-in-one workspace is one step away.'}</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>{mode === 'signup' && <label>Full name<input autoComplete="name" required placeholder="Your name" /></label>}<label>Work email<input type="email" autoComplete="email" required placeholder="you@company.com" /></label><label>Password<input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required placeholder="At least 8 characters" /></label><button className="btn btn-primary" type="submit">{mode === 'signin' ? 'Sign in' : 'Create your account'}<ArrowRight size={15} /></button>{submitted && <p className="form-notice" role="status">This is a preview. Account creation and sign-in are not connected yet; no account has been created or authenticated.</p>}</form><p className="account-switch">{mode === 'signin' ? 'New to TREEDAM?' : 'Already have an account?'} <Link to={mode === 'signin' ? '/signup' : '/signin'}>{mode === 'signin' ? 'Sign up' : 'Sign in'}</Link></p><small className="demo-note">Preview only · Do not enter a real password.</small></div></section></PageShell>
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  return <PageShell><section className="account-layout"><div><span className="eyebrow">LET’S BUILD BETTER, TOGETHER</span><h1>A better way to work<br />starts with a hello.</h1><p>Have a question about TREEDAM? Tell us about your team and what you want to achieve.</p><div className="account-proof"><Mail size={20} />Product questions, demos & sales</div></div><div className="account-card"><h2>Contact us</h2><p>We’d love to hear what you’re working on.</p><form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}><label>Full name<input required autoComplete="name" placeholder="Your name" /></label><label>Work email<input required type="email" autoComplete="email" placeholder="you@company.com" /></label><label>How can we help?<select><option>Book a demo</option><option>Talk to sales</option><option>Product support</option><option>Something else</option></select></label><label>Message<textarea required rows={4} placeholder="Tell us a little about your team…" /></label><button className="btn btn-primary">Send message <ArrowRight size={15} /></button>{submitted && <p className="form-notice" role="status">Preview only: your message has not been sent. A backend connection is needed to receive submissions.</p>}</form></div></section></PageShell>
}

export function NotFoundPage() {
  return <PageShell><section className="page-intro"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>Let’s get you back on track.</h1><p>This page doesn’t exist. Your next great project still does.</p><Link to="/" className="btn btn-primary">Back to home</Link></section></PageShell>
}
