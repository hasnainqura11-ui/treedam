'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

const base = `${'/'}media/`
const scenes = [
  { source: 'forest-film.mp4', label: 'A calm green forest' },
  { source: 'planting-film.mp4', label: 'Hands planting a small seedling in soil' },
  { source: 'sunlight-film.mp4', label: 'Sunlight passing through tree leaves' },
]

/** Three quiet, cross-faded scenes; only visible, active scenes keep playing. */
export function CinematicFilm({ paused = false, userStarted = false, onPlayingChange, onError, decorative = false }: {
  paused?: boolean
  userStarted?: boolean
  onPlayingChange?: (playing: boolean) => void
  onError?: () => void
  decorative?: boolean
}) {
  const container = useRef<HTMLDivElement>(null)
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const inView = useInView(container, { amount: 0.15 })
  const reduced = useReducedMotion()
  const [requested, setRequested] = useState(0)
  const [visible, setVisible] = useState(0)
  const [tabVisible, setTabVisible] = useState(true)
  const saveData = typeof navigator !== 'undefined' && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const shouldPlay = inView && tabVisible && !paused && (userStarted || (!reduced && !saveData))

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const video = videos.current[requested]
    if (shouldPlay && video) {
      video.playbackRate = 0.8
      if (requested !== visible) video.currentTime = 0
      void video.play().catch(() => onPlayingChange?.(false))
    } else {
      videos.current.forEach(item => item?.pause())
      onPlayingChange?.(false)
    }
    return () => { video?.pause() }
  }, [shouldPlay, requested, onPlayingChange])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      videos.current.forEach((video, index) => { if (index !== visible) video?.pause() })
    }, 1000)
    return () => clearTimeout(timeout)
  }, [visible])

  useEffect(() => {
    if (!shouldPlay) return
    const timer = window.setTimeout(() => setRequested((visible + 1) % scenes.length), 14000)
    return () => clearTimeout(timer)
  }, [shouldPlay, visible])

  return <div ref={container} className="cinematic-film" aria-hidden={decorative || undefined}>
    {scenes.map((scene, index) => <video
      key={scene.source}
      ref={element => { videos.current[index] = element }}
      className={index === visible ? 'cinematic-scene is-active' : 'cinematic-scene'}
      muted loop playsInline
      preload={shouldPlay && index === (visible + 1) % scenes.length ? 'auto' : 'none'}
      autoPlay={shouldPlay && index === requested}
      poster={`${base}forest.jpg`}
      aria-label={decorative ? undefined : scene.label}
      aria-hidden={decorative || index !== visible}
      onPlaying={() => {
        if (index !== requested) return
        setVisible(index)
        onPlayingChange?.(true)
      }}
      onError={() => {
        if (index === 0) onError?.()
        else setRequested(0)
      }}
    ><source src={`${base}${scene.source}`} type="video/mp4" /></video>)}
  </div>
}
