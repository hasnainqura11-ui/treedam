import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Pause, Play, type LucideIcon } from 'lucide-react'
import { TopNavbar } from './Layout'

const mediaBase = `${import.meta.env.BASE_URL}media/`

export function PageFrame({ children }: { children: ReactNode }) {
  return <main className="inner-page treedam-pages"><TopNavbar />{children}</main>
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return <motion.div
    className={className}
    initial={reduced ? false : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: reduced ? 0 : 0.5, delay, ease: 'easeOut' }}
  >{children}</motion.div>
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
    <Reveal className="page-intro">
      <span className="eyebrow">TREEDAM / {eyebrow}</span>
      <h1>{title}</h1><p>{text}</p><PageActions />
    </Reveal>
    <Reveal className="page-hero-media page-media-grid">
      <FieldMedia film />
      <FieldMedia image={image === 'forest' ? 'planting' : image} />
    </Reveal>
    <Reveal className="stats page-stats page-journey-stats">
      <article><b><AnimatedNumber value={1} /></b><p>tree. One lasting planting promise.</p></article>
      <article><b><AnimatedNumber value={3} /></b><p>steps: Planting, Caring, Proving.</p></article>
      <article><b><AnimatedNumber value={30} suffix=" days" /></b><p>to return for a first survival check.</p></article>
    </Reveal>
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

export function FieldMedia({ image = 'forest', film = false }: { image?: keyof typeof imageDescriptions; film?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(videoRef, { amount: 0.2 })
  const reduced = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  useEffect(() => {
    const video = videoRef.current
    if (!video || !film) return
    if (inView && !reduced && !userPaused) {
      void video.play().catch(() => setPlaying(false))
    } else video.pause()
  }, [inView, reduced, userPaused, film])
  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      setUserPaused(false)
      void video.play().catch(() => setVideoFailed(true))
    } else {
      setUserPaused(true)
      video.pause()
    }
  }
  return <figure className="field-media">
    {film && !videoFailed ? <video
      ref={videoRef}
      muted loop playsInline preload="none"
      poster={`${mediaBase}forest.jpg`}
      aria-label="Sunlight moving through a tranquil forest"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => setVideoFailed(true)}
    ><source src={`${mediaBase}forest-film.mp4`} type="video/mp4" /></video>
      : <img src={`${mediaBase}${image}.jpg`} alt={imageDescriptions[image]} loading="lazy" width={1600} height={900} />}
    <figcaption>
      <span>{film && !videoFailed ? 'A living forest, worth protecting' : imageDescriptions[image]}<small>{film && !videoFailed ? 'Forest footage / Mixkit' : imageCredits[image]}</small></span>
      {film && !videoFailed && <button type="button" className="btn btn-secondary" onClick={toggle} aria-label={playing ? 'Pause forest film' : 'Play forest film'}>
        {playing ? <Pause size={14} /> : <Play size={14} />}{playing ? 'Pause film' : 'Play film'}
      </button>}
    </figcaption>
  </figure>
}

export type Feature = { title: string; text: string; icon: LucideIcon }

export function FeatureSection({ title, text, items, twoColumns = false }: {
  title: string; text?: string; items: readonly Feature[]; twoColumns?: boolean
}) {
  return <section className="page-section">
    <Reveal className="section-heading"><h2>{title}</h2>{text && <p>{text}</p>}</Reveal>
    <div className={twoColumns ? 'benefit-grid' : 'detail-grid page-detail-grid'}>
      {items.map(({ title: itemTitle, text: description, icon: Icon }, index) =>
        <Reveal key={itemTitle} delay={(index % 3) * 0.06}>
          <article className="page-feature-card">
            <span className="detail-icon"><Icon size={23} /></span>
            <h3>{itemTitle}</h3><p>{description}</p>
          </article>
        </Reveal>)}
    </div>
  </section>
}

export function EditorialSection({ eyebrow, title, text, image = 'planter', children }: {
  eyebrow: string; title: string; text: string; image?: 'forest' | 'planting' | 'planter'; children?: ReactNode
}) {
  return <section className="page-section">
    <Reveal className="organize page-editorial">
      <div className="organize-copy"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{text}</p>{children || <PageActions />}</div>
      <FieldMedia image={image} />
    </Reveal>
  </section>
}

export function PageCTA() {
  return <section className="final-cta">
    <Reveal><span className="eyebrow">GROW GREENER, TOGETHER</span><h2>Make every planting<br />feel effortless.</h2>
      <p>Bring your planters, tools and trees together in one beautifully simple place.</p>
      <Link to="/signup" className="btn btn-primary">Plant for free <ArrowRight size={16} /></Link>
    </Reveal>
  </section>
}

export function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref, { once: true })
  const reduced = useReducedMotion()
  const [number, setNumber] = useState(0)
  useEffect(() => {
    if (!visible || reduced) return
    let frame: number
    let start: number | undefined
    const tick = (time: number) => {
      start ??= time
      const fraction = Math.min((time - start) / 1100, 1)
      setNumber(Math.round(value * (1 - (1 - fraction) ** 3)))
      if (fraction < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [visible, reduced, value])
  return <span ref={ref} aria-label={`${prefix}${value}${suffix}`}><span aria-hidden="true">{prefix}{reduced ? value : number}{suffix}</span></span>
}
