'use client'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { Link } from './routing'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { TopNavbar } from './Layout'

const mediaBase = `${'/'}media/`

export function PageFrame({ children }: { children: ReactNode }) {
  return <main className="inner-page treedam-pages"><TopNavbar />{children}</main>
}

export function ContentBlock({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

export function PageActions() {
  return <div className="button-row">
    <Link className="btn btn-primary" to="/signup">Start planting free <ArrowRight size={15} /></Link>
    <Link className="btn btn-secondary" to="/contact">Talk to our team</Link>
  </div>
}

export function PageHero({ eyebrow, title, text, image = 'planting' }: {
  eyebrow: string; title: string; text: string; image?: 'forest' | 'planting' | 'planter'
}) {
  return <section className="page-hero">
    <ContentBlock className="page-intro">
      <span className="eyebrow">TREEDAM / {eyebrow}</span>
      <h1>{title}</h1><p>{text}</p><PageActions />
    </ContentBlock>
    <ContentBlock className="page-hero-media page-media-grid">
      <FieldMedia forestPanel />
      <FieldMedia image={image === 'forest' ? 'planting' : image} />
    </ContentBlock>
    <ContentBlock className="stats page-stats page-journey-stats">
      <article><b><StatNumber value={1} /></b><p>tree. One lasting planting promise.</p></article>
      <article><b><StatNumber value={3} /></b><p>steps: Planting, Caring, Proving.</p></article>
      <article><b><StatNumber value={30} suffix=" days" /></b><p>to return for a first survival check.</p></article>
    </ContentBlock>
  </section>
}

const imageDescriptions = {
  forest: 'Aerial view of a dense green forest canopy',
  planting: 'Gloved hands carefully planting a seedling in the soil',
  planter: 'A planter tending a young plant in the field',
}
const imageCredits = {
  forest: 'Geranimo / Unsplash',
  planting: 'Jonathan Kemper / Unsplash',
  planter: 'Dmitry Dreyer / Unsplash',
}

export function FieldMedia({ image = 'forest', forestPanel = false }: { image?: keyof typeof imageDescriptions; forestPanel?: boolean }) {
  return <figure className="field-media">
    <Image
      src={`${mediaBase}${image}.jpg`} alt={imageDescriptions[image]} loading="lazy" width={1600} height={900}
    />
    <figcaption>
      <span>{forestPanel ? 'A living forest, worth protecting' : imageDescriptions[image]}<small>{imageCredits[image]}</small></span>
    </figcaption>
  </figure>
}

export type Feature = { title: string; text: string; icon: LucideIcon }

export function FeatureSection({ title, text, items, twoColumns = false }: {
  title: string; text?: string; items: readonly Feature[]; twoColumns?: boolean
}) {
  return <section className="page-section">
    <ContentBlock className="section-heading"><h2>{title}</h2>{text && <p>{text}</p>}</ContentBlock>
    <div className={twoColumns ? 'benefit-grid' : 'detail-grid page-detail-grid'}>
      {items.map(({ title: itemTitle, text: description, icon: Icon }) =>
        <ContentBlock key={itemTitle}>
          <article className="page-feature-card">
            <span className="detail-icon"><Icon size={23} /></span>
            <h3>{itemTitle}</h3><p>{description}</p>
          </article>
        </ContentBlock>)}
    </div>
  </section>
}

export function EditorialSection({ eyebrow, title, text, image = 'planter', children }: {
  eyebrow: string; title: string; text: string; image?: 'forest' | 'planting' | 'planter'; children?: ReactNode
}) {
  return <section className="page-section">
    <ContentBlock className="organize page-editorial">
      <div className="organize-copy"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p>{children || <PageActions />}</div>
      <FieldMedia image={image} />
    </ContentBlock>
  </section>
}

export function PageCTA() {
  return <section className="final-cta">
    <ContentBlock><span className="eyebrow">GROW GREENER, TOGETHER</span><h2>Make every planting<br />feel effortless.</h2>
      <p>Bring your planters, tools and trees together in one beautifully simple place.</p>
      <Link to="/signup" className="btn btn-primary">Plant for free <ArrowRight size={16} /></Link>
    </ContentBlock>
  </section>
}

export function StatNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  return <span>{prefix}{value}{suffix}</span>
}

export function StatText({ text }: { text: string }) {
  return text
}
