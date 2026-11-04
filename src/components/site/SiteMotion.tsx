'use client'
import { useLayoutEffect } from 'react'
import { useLocation } from './routing'
import { useReducedMotion } from 'motion/react'

export const luxuryEase = [0.16, 1, 0.3, 1] as const
export const luxuryTransition = { type: 'tween' as const, duration: 0.85, ease: luxuryEase }

/** Adds motion to existing DOM, without introducing layout wrappers. */
export function SiteMotion() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-site-motion]')
    if (!root || reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animations = new Set<Animation>()
    const targets = new Set<HTMLElement>()
    const delays = new WeakMap<HTMLElement, number>()
    const sectionSelector = 'main > .page-section, main > .stats, main > .final-cta, main > .account-layout, main > .page-hero, footer'
    const cardSelector = '.benefit-grid > article, .project-points > article, .integration-list > article, .project-visual > div, .kanban article, .notifications > .notice, .stats > article'
    root.querySelectorAll<HTMLElement>(`${sectionSelector}, ${cardSelector}`).forEach(element => {
      // React's shared Reveal component owns its own stagger and opacity.
      if (element.closest('[data-motion-reveal]')) return
      targets.add(element)
      if (element.matches(cardSelector)) {
        delays.set(element, Array.from(element.parentElement!.children).indexOf(element) % 4 * 90)
      }
      element.dataset.siteReveal = 'pending'
    })
    const reveal = (element: HTMLElement) => {
      if (element.dataset.siteReveal !== 'pending') return
      element.dataset.siteReveal = 'visible'
      const animation = element.animate(
        [{ opacity: 0, translate: '0 12px' }, { opacity: 1, translate: '0 0' }],
        { duration: 850, delay: delays.get(element) || 0, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
      )
      animations.add(animation)
      animation.onfinish = () => animations.delete(animation)
      observer.unobserve(element)
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target as HTMLElement) })
    }, { threshold: 0.05, rootMargin: '0px 0px -24px 0px' })
    targets.forEach(element => observer.observe(element))

    // Keep keyboard navigation usable even before an offscreen reveal begins.
    const focusReveal = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      targets.forEach(element => { if (element.contains(event.target as Node)) reveal(element) })
    }
    root.addEventListener('focusin', focusReveal)

    const media = Array.from(root.querySelectorAll<HTMLElement>('.hero-world-map, .field-media img, .field-media video'))
    const activeMedia = new Set<HTMLElement>()
    let frame = 0
    const updateParallax = () => {
      frame = 0
      if (document.hidden || !window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) return
      activeMedia.forEach(element => {
        const bounds = element.getBoundingClientRect()
        const progress = (innerHeight / 2 - bounds.top - bounds.height / 2) / innerHeight
        element.style.setProperty('--media-drift', `${Math.max(-7, Math.min(7, progress * 12)).toFixed(2)}px`)
      })
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateParallax) }
    const mediaObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const element = entry.target as HTMLElement
        if (entry.isIntersecting) activeMedia.add(element)
        else activeMedia.delete(element)
      })
      onScroll()
    })
    media.forEach(element => mediaObserver.observe(element))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    const onVisibility = () => {
      if (document.hidden) root.dataset.motionPaused = 'true'
      else { delete root.dataset.motionPaused; onScroll() }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      observer.disconnect()
      mediaObserver.disconnect()
      root.removeEventListener('focusin', focusReveal)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      delete root.dataset.motionPaused
      cancelAnimationFrame(frame)
      animations.forEach(animation => animation.cancel())
      targets.forEach(element => { delete element.dataset.siteReveal })
      media.forEach(element => element.style.removeProperty('--media-drift'))
    }
  }, [pathname, reduced])

  return null
}
