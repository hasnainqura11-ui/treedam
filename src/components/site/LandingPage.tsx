'use client'
import { useState, type ReactNode } from 'react'
import { useNavigate } from './routing'
import { Layout, TopNavbar } from './Layout'
import { HeroSection } from './HeroSection'
import { TreedamLogo } from './BrandIcons'
import { TreeDashboard } from './TreeDashboard'
import { MapPin, Camera, Leaf, ChartNoAxesColumn, type LucideIcon } from 'lucide-react'
import { ContentPage, PricingPage, AccountPage, ContactPage, NotFoundPage, InformationPage } from './Pages'
import { CountUpText } from './PageSections'

type ModalKind = 'trial' | 'sales' | 'signin' | 'contact' | null

const integrations = [
  { name: 'Slack', mark: '✣', color: '#36c5f0' },
  { name: 'Zapier', mark: '✱', color: '#ff4f00' },
  { name: 'AWS', mark: 'aws', color: '#ff9900' },
  { name: 'Jira', mark: '≡', color: '#2684ff' },
  { name: 'ClickUp', mark: '⌃', color: '#7b68ee' },
  { name: 'Airtable', mark: '◆', color: '#f82b60' },
  { name: 'Google Ads', mark: 'A', color: '#4285f4' },
  { name: 'Mailchimp', mark: '●', color: '#f7ca45' },
  { name: 'Meta', mark: '∞', color: '#0866ff' },
  { name: 'Make', mark: '✦', color: '#6d00cc' },
]

const companies = ['Google', 'airbnb', 'coinbase', 'Notion', 'GUMROAD', 'PayPal', 'upwork', 'shopify', 'stripe', 'zoom']

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="TREEDAM home">
      <TreedamLogo size="sm" />
    </a>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5.5 10h9M11 6.5l3.5 3.5-3.5 3.5" />
    </svg>
  )
}

function CheckIcon({ color = '#6c63ff' }: { color?: string }) {
  return (
    <span className="feature-icon" style={{ color, background: `${color}12` }}>
      ✓
    </span>
  )
}

function Button({
  children,
  secondary = false,
  onClick,
}: {
  children: ReactNode
  secondary?: boolean
  onClick: () => void
}) {
  return (
    <button className={secondary ? 'btn btn-secondary' : 'btn btn-primary'} onClick={onClick}>
      {children}
    </button>
  )
}

function MiniNotifications() {
  return (
    <div className="notifications" aria-label="Recent team activity">
      <div className="notice notice-one">
        <span className="avatar amber">WC</span>
        <span>
          <b>Ayesha Khan</b> planted a Chinar tree
          <small>8 min ago · Skardu, Gilgit-Baltistan</small>
        </span>
      </div>
      <div className="notice notice-two">
        <span className="avatar rose">MJ</span>
        <span>
          <b>Bilal Ahmed</b>
          <small>Planter · @bilalplants</small>
        </span>
        <span className="more">⋮</span>
      </div>
      <div className="notice notice-three">
        <span className="gmail">M</span>
        <span>
          <b>TREEDAM Alert</b>
          <small>Your tree passed its survival check...</small>
        </span>
      </div>
    </div>
  )
}

function TaskBoard() {
  return (
    <div className="task-board">
      <div className="task-search">○ &nbsp; Hunza plantation drive</div>
      <div className="task-file">
        <span>Search for a tree, planter or plot nearby</span>
        <b>Survival report.pdf</b>
      </div>
      <div className="task-line">
        <span className="status-dot" /> Meeting with Forest Department
        <small>24 Mar</small>
      </div>
      <div className="task-people">
        <span className="avatar tiny amber">R</span>
        <span>
          <small>Name</small>
          Chinar Planting Campaign
        </span>
        <span>
          <small>Field Lead</small>
          Ahmed K.
        </span>
      </div>
      <div className="task-meta">
        <span>▣ 12/03/2026 - 26/03/2026</span>
        <span>Weekly Survival Review</span>
      </div>
    </div>
  )
}

function ProjectCards() {
  return (
    <div className="project-visual">
      <div className="stack stack-left">
        <span><MapPin size={12} className="inline-block" aria-hidden="true" /> &nbsp; Google Maps</span>
        <span><Camera size={12} className="inline-block" aria-hidden="true" /> &nbsp; WhatsApp</span>
        <span><Leaf size={12} className="inline-block" aria-hidden="true" /> &nbsp; Weather</span>
        <small>Tag, track, update trees</small>
      </div>
      <div className="integration-card">
        <div><Camera className="purple-dot" aria-hidden="true" /> Camera</div>
        <div><MapPin className="slack-dot" aria-hidden="true" /> GPS</div>
        <small>For planter updates and real-time alerts</small>
        <button>Manage</button>
      </div>
      <div className="upload-card">
        <b>+ &nbsp; Add trees</b>
        <div><span>▣ survival-certificate.pdf</span><small>5.0%</small></div>
        <i />
      </div>
    </div>
  )
}


export default function LandingPage() {
  const navigate = useNavigate()
  const openModal = (kind: ModalKind) => navigate(kind === 'trial' ? '/signup' : kind === 'signin' ? '/signin' : '/contact')
  const [activeTab, setActiveTab] = useState('Tracking')

  return (
    <main id="top">
      <section className="hero section-shell">
        <TopNavbar />
        <HeroSection onStartTrial={() => navigate('/signup')} onTalkToSales={() => navigate('/contact')} />
      </section>

      <section className="benefits page-section" id="solutions">
        <div className="section-heading">
          <h2>Tree survival, simplified<br />for every planter</h2>
        </div>
        <div className="benefit-grid">
          <article>
            <CheckIcon color="#6d72ff" />
            <h3>Every tree, GPS-tagged</h3>
            <p>Plant one tree, snap one photo, and its location stays locked in records forever. No tree ever gets forgotten.</p>
          </article>
          <article>
            <CheckIcon color="#21b889" />
            <h3>Care reminders, automatic</h3>
            <p>Smart alerts tell every planter when each tree needs water and nutrition. Focus fully on growing more.</p>
          </article>
          <article>
            <CheckIcon color="#ae57ef" />
            <h3>Survival rates, proven</h3>
            <p>Second photos, compared by AI, confirm every tree still lives. Funders see real proof.</p>
          </article>
          <article>
            <CheckIcon color="#f14b91" />
            <h3>Competitions that grow real forests</h3>
            <p>Let your campus or department compete on leaderboards and win on survival counts. Winners earn certificates, awards and prizes.</p>
          </article>
        </div>
      </section>

      <section className="workspace page-section" id="workspace">
        <div className="section-heading">
          <h2>Your all-in-one tree<br />survival workspace</h2>
          <p>Plant trees, assign caretakers, and track survival in one simple<br />platform. Keep every planter motivated and every tree counted.</p>
        </div>
        <div className="workspace-glow">
          <TaskBoard />
          <div className="workspace-copy">
            <CheckIcon color="#695cff" />
            <h3>Turn plantings into living forests</h3>
            <p>Break down drives into simple tasks, track survival in real time, and help every planter stay motivated.</p>
          </div>
        </div>
      </section>

      <section className="stats" id="pricing">
        {[
          ['44%', 'of planted saplings die within five years.'],
          ['$22/t', 'paid per ton for verified tree carbon.'],
          ['60 sec', 'to GPS-tag one newly planted tree.'],
          ['30 days', 'First survival proof arrives within thirty days.'],
        ].map(([value, label]) => (
          <article key={value}><b><CountUpText text={value} /></b><p>{label}</p></article>
        ))}
      </section>

      <section className="manage page-section" id="services">
        <div className="section-heading">
          <h2>Keep trees alive<br />with your team</h2>
          <p>Track trees, work together with your team, and never miss a watering day<br />with a powerful yet simple tree platform.</p>
        </div>
        <div className="tracking-tabs" role="tablist" aria-label="Task views">{['Tracking', 'Scheduling', 'Visibility'].map((tab, index) => <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)}>{['Planting', 'Caring', 'Proving'][index]}</button>)}</div>
        <div className="manage-layout">
          <div className="manage-copy">
            <h3>{activeTab === 'Tracking' ? <>Planting made simple<br />for every planter</> : activeTab === 'Scheduling' ? 'Keep every watering on schedule' : 'See the whole forest, live'}</h3>
            <p>{activeTab === 'Tracking' ? 'Break down drives into easy steps, track each tree in real time, and keep every planter focused.' : activeTab === 'Scheduling' ? 'Plan watering days for every tree, receive alerts in real time, and help every caretaker stay consistent.' : 'Watch maps update for every plot, share proof in real time, and show every funder verified impact.'}</p>
            <div className="button-row">
              <Button onClick={() => openModal('trial')}>Start planting free</Button>
              <Button secondary onClick={() => openModal('sales')}>Talk to our team</Button>
            </div>
          </div>
          <div className="activity-visual"><MiniNotifications /></div>
        </div>
      </section>

      <section className="projects page-section" id="product">
        <div className="section-heading">
          <h2>Plan plantations and track<br />trees effortlessly</h2>
          <p>Simplify tree survival with tools that help you plant, prioritize, and<br />collaborate so your team can keep more trees alive daily.</p>
        </div>
        <ProjectCards />
        <div className="project-points">
          <article><CheckIcon color="#42ba82" /><h3>Perfectly tracked</h3><p>Manage trees, work with your team, and stay ahead of watering days.</p></article>
          <article><CheckIcon color="#596dff" /><h3>Smart integrations</h3><p>Access the connected tools and apps ready for your tree work.</p></article>
          <article><CheckIcon color="#f06b55" /><h3>Upload Photos</h3><p>Upload tree photos to verify and improve your AI survival accuracy.</p></article>
        </div>
      </section>

      <section className="organize page-section" id="integrations">
        <div className="organize-copy">
          <h2>Organize planting and boost<br />tree survival</h2>
          <p>From one seedling to massive forests, manage everything in one place and keep your trees growing stronger with care and proof.</p>
          <div className="button-row">
            <Button onClick={() => openModal('trial')}>Start planting free</Button>
            <Button secondary onClick={() => openModal('sales')}>Talk to our team</Button>
          </div>
          <div className="loved">
            <div><span>A</span><span>S</span><span>F</span><span>B</span><span>Z</span></div>
            <p>Loved by so many, we help you plant trees easily and keep your forests growing strong.</p>
          </div>
        </div>
        <div className="integration-list">
          {([
            [MapPin, 'Maps', 'See every planted tree located precisely on live maps, updated in real time.'],
            [ChartNoAxesColumn, 'Reports', 'Organize drives, keep records, and manage all your plantation work from one place.'],
            [Leaf, 'Alerts', 'Get care reminders and stay on track, moving forward with confidence.'],
          ] satisfies [LucideIcon, string, string][]).map(([Icon, name, text]) => (
            <article key={name}><span><Icon size={23} aria-hidden="true" /></span><div><h3>{name}</h3><p>{text}</p></div></article>
          ))}
        </div>
      </section>

      <section className="smart page-section" id="dashboard">
        <div className="section-heading">
          <h2>Smart tree tracking<br />for growing forests</h2>
          <p>Organize plantings, assign caretakers, and monitor survival with a smart<br />platform built to improve growth and teamwork.</p>
          <div className="button-row">
            <Button onClick={() => openModal('trial')}>Start planting free</Button>
            <Button secondary onClick={() => openModal('sales')}>Talk to our team</Button>
          </div>
        </div>
        <TreeDashboard />
      </section>

      <section className="final-cta" id="insight">
        <span>GROW GREENER, TOGETHER</span>
        <h2>Make every planting<br />feel effortless.</h2>
        <p>Bring your planters, tools and trees together in one beautifully simple place.</p>
        <Button onClick={() => openModal('trial')}>Plant for free <ArrowIcon /></Button>
      </section>

    </main>
  )
}
