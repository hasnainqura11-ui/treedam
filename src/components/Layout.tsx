import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { TreedamLogo } from './BrandIcons'
import { TreePine, Trophy, Leaf, MapPin, ChartNoAxesColumn, TreeDeciduous } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import { SiteMotion, luxuryTransition } from './SiteMotion'

export type ModalType = 'trial' | 'sales' | 'demo' | null

export const ModalContext = React.createContext<{
  openModal: (kind: ModalType) => void
}>({
  openModal: () => {},
})

export function useAppModal() {
  return React.useContext(ModalContext)
}

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [submitted, setSubmitted] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMobileMenuOpen(false)
    setSolutionsOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const openModal = (kind: ModalType) => {
    setSubmitted(false)
    setModal(kind)
  }

  return (
    <MotionConfig reducedMotion="user" transition={luxuryTransition}>
    <ModalContext.Provider value={{ openModal }}>
      <div data-site-motion className="luxury-motion min-h-screen bg-[#F3F4F6] text-[#111113] font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <SiteMotion />
        {/* Main outer shell matching reference canvas */}
        <div className="max-w-[1440px] mx-auto px-2.5 sm:px-4 md:px-6 pt-2.5 sm:pt-4 pb-8">
          <Outlet />

          {/* Luxury Footer matching reference */}
          <footer className="mt-4 bg-white rounded-[24px] sm:rounded-[28px] border border-[#ECECEE] px-6 sm:px-12 lg:px-20 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F0F0F2]">
              <div className="md:col-span-4 space-y-4">
                <Link to="/" className="inline-block">
                  <TreedamLogo />
                </Link>
                <p className="text-[13px] text-[#72737A] leading-relaxed max-w-xs">
                  From one seedling to whole forests, track every tree in one place and keep the planet breathing.
                </p>
                <div className="pt-2">
                  <p className="text-[12px] font-semibold text-[#111113] mb-2">Subscribe to our newsletter</p>
                  <p className="text-[11px] text-[#85868E] mb-3">
                    Tips for faster tree tracking, and smarter planting.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      openModal('trial')
                    }}
                    className="flex flex-col sm:flex-row gap-2 max-w-xs"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className="h-9 px-3.5 rounded-[9px] border border-[#E5E6EB] text-[12px] bg-[#FAFAFC] focus:bg-white focus:border-[#111] outline-none flex-1"
                    />
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-[9px] bg-[#0F0F12] text-white text-[12px] font-medium hover:bg-black transition"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <h4 className="text-[12px] font-semibold text-[#111113] tracking-tight">Product</h4>
                <ul className="space-y-2 text-[12px] text-[#6E6F77]">
                  <li><Link to="/platform" className="hover:text-[#111] transition">Platform Overview</Link></li>
                  <li><Link to="/solutions" className="hover:text-[#111] transition">Tree Tracking</Link></li>
                  <li><Link to="/plans" className="hover:text-[#111] transition">Care Plans <span className="text-[9px] text-[#4F60FF] border border-[#C6CEFF] bg-[#F2F4FF] px-1 py-0.5 rounded ml-1 font-semibold">NEW</span></Link></li>
                  <li><Link to="/pricing" className="hover:text-[#111] transition">Pricing Plans</Link></li>
                  <li><Link to="/impact" className="hover:text-[#111] transition">Impact &amp; Insights</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <h4 className="text-[12px] font-semibold text-[#111113] tracking-tight">Solutions</h4>
                <ul className="space-y-2 text-[12px] text-[#6E6F77]">
                  <li><Link to="/solutions" className="hover:text-[#111] transition">Plantation Planning</Link></li>
                  <li><Link to="/solutions" className="hover:text-[#111] transition">Team Competitions</Link></li>
                  <li><Link to="/solutions" className="hover:text-[#111] transition">AI Survival Checks</Link></li>
                  <li><Link to="/impact" className="hover:text-[#111] transition">Use Cases</Link></li>
                  <li><Link to="/plans" className="hover:text-[#111] transition">Institutions</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <h4 className="text-[12px] font-semibold text-[#111113] tracking-tight">Company</h4>
                <ul className="space-y-2 text-[12px] text-[#6E6F77]">
                  <li><Link to="/about" className="hover:text-[#111] transition">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-[#111] transition">Contact Us</Link></li>
                  <li><Link to="/stories" className="hover:text-[#111] transition">Planter Stories</Link></li>
                  <li><Link to="/careers" className="hover:text-[#111] transition">Careers</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2 space-y-2.5">
                <h4 className="text-[12px] font-semibold text-[#111113] tracking-tight">Account</h4>
                <ul className="space-y-2 text-[12px] text-[#6E6F77]">
                  <li><Link to="/signin" className="hover:text-[#111] transition">Sign in</Link></li>
                  <li><Link to="/signup" className="hover:text-[#111] transition">Start planting free</Link></li>
                  <li><button onClick={() => openModal('demo')} className="hover:text-[#111] transition">Book a Demo</button></li>
                  <li><button onClick={() => openModal('sales')} className="hover:text-[#111] transition">Talk to us</button></li>
                </ul>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94959E]">
              <p>© 2026 TREEDAM Inc. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link to="/privacy" className="hover:text-[#111] transition">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-[#111] transition">Terms of Service</Link>
                <Link to="/security" className="hover:text-[#111] transition">Security</Link>
              </div>
            </div>
          </footer>
        </div>

        {/* Interactive Modal for Quick Actions */}
        {modal && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
            onMouseDown={() => setModal(null)}
          >
            <div
              className="bg-white rounded-[22px] border border-[#EAECEF] shadow-2xl max-w-[420px] w-full p-7 relative animate-in fade-in zoom-in-95 duration-200"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4F4F6] hover:bg-[#E8E8EC] flex items-center justify-center text-[#555] text-sm"
                aria-label="Close modal"
              >
                ✕
              </button>

              {submitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">
                    ✓
                  </div>
                  <h3 className="text-[22px] font-semibold tracking-tight text-[#111]">Preview completed</h3>
                  <p className="text-[13px] text-[#6E6F77]">
                    This form is a preview. No request or confirmation email has been sent; a backend connection is required.
                  </p>
                  <div className="pt-3 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setModal(null)
                        navigate('/signup')
                      }}
                      className="h-10 px-5 rounded-[10px] bg-[#0F0F12] text-white text-[12px] font-medium"
                    >
                      Explore Planting Setup
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <TreedamLogo size="sm" />
                  <h3 className="mt-5 text-[24px] font-semibold tracking-[-0.03em] text-[#111]">
                    {modal === 'trial'
                      ? 'Start your planting journey'
                      : modal === 'demo'
                      ? 'Book a personalized demo'
                      : 'Talk to our sales team'}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] text-[#6E6F77]">
                    {modal === 'trial'
                      ? 'Explore GPS tree tagging, care reminders, and tree-survival evidence for your planting community.'
                      : 'Explore care plans and survival verification for your next plantation drive.'}
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSubmitted(true)
                    }}
                    className="mt-5 space-y-3"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      className="w-full h-10 px-3.5 rounded-[10px] border border-[#E5E6EB] bg-[#FAFAFC] text-[12.5px] focus:bg-white focus:border-[#111] outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Work email"
                      className="w-full h-10 px-3.5 rounded-[10px] border border-[#E5E6EB] bg-[#FAFAFC] text-[12.5px] focus:bg-white focus:border-[#111] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Institution & planting team size"
                      className="w-full h-10 px-3.5 rounded-[10px] border border-[#E5E6EB] bg-[#FAFAFC] text-[12.5px] focus:bg-white focus:border-[#111] outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full h-10 rounded-[10px] bg-[#0F0F12] text-white text-[12.5px] font-medium hover:bg-black transition shadow-sm"
                    >
                      {modal === 'trial' ? 'Start Planting Free' : modal === 'demo' ? 'Schedule Demo' : 'Talk to our team'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ModalContext.Provider>
    </MotionConfig>
  )
}

export function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [solutionsHover, setSolutionsHover] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
    setSolutionsHover(false)
  }, [location.pathname])

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-[13px] font-medium transition-colors whitespace-nowrap ${
      isActive ? 'text-[#0F0F12] font-semibold' : 'text-[#343539] hover:text-[#0F0F12]'
    }`

  return (
    <header className="relative z-30 mx-auto w-[min(1120px,calc(100%-24px))] sm:w-[min(1120px,calc(100%-56px))] pt-4 sm:pt-5">
      <div className="h-[56px] sm:h-[62px] px-4 sm:px-5 rounded-[16px] bg-white/95 backdrop-blur-md border border-[#EAEAEA] shadow-[0_6px_24px_rgba(0,0,0,0.03)] flex items-center justify-between">
        {/* Left: Brand */}
        <Link to="/" className="shrink-0" aria-label="TREEDAM Home">
          <TreedamLogo />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
          <NavLink to="/platform" className={navLinkClass}>
            Platform
          </NavLink>

          {/* Solutions with Luxury Hover Mega Menu */}
          <div
            className="relative py-4"
            onMouseEnter={() => setSolutionsHover(true)}
            onMouseLeave={() => setSolutionsHover(false)}
            onFocus={() => setSolutionsHover(true)}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setSolutionsHover(false) }}
            onKeyDown={event => { if (event.key === 'Escape') setSolutionsHover(false) }}
          >
            <NavLink
              to="/solutions"
              className={({ isActive }) =>
                `inline-flex items-center gap-1 text-[13px] font-medium transition-colors ${
                  isActive ? 'text-[#0F0F12] font-semibold' : 'text-[#343539] hover:text-[#0F0F12]'
                }`
              }
            >
              Solutions
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                className={`transition-transform duration-200 text-[#666] ${solutionsHover ? 'rotate-180' : ''}`}
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NavLink>

            {/* Luxury Dropdown Mega Menu */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 top-[54px] w-[740px] rounded-[22px] bg-white/98 backdrop-blur-xl border border-[#E8E9EF] shadow-[0_28px_80px_rgba(15,18,38,0.14)] p-5 grid grid-cols-12 gap-4 transition-all duration-200 origin-top ${
                solutionsHover
                  ? 'opacity-100 visible translate-y-0 scale-100'
                  : 'opacity-0 invisible -translate-y-2 scale-[0.98] pointer-events-none'
              }`}
            >
              <div className="col-span-4 space-y-1">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9496A1]">
                  By Purpose
                </p>
                <Link
                  to="/solutions"
                  className="group flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-[#F6F7FB] transition"
                >
                  <span className="w-8 h-8 rounded-[9px] bg-[#EEF0FF] text-[#5B68FF] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs">
                    <TreePine size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#111] group-hover:text-[#4F5EFF]">
                      Tree & Forest Tracking
                    </p>
                    <p className="text-[11px] text-[#7A7B85] leading-snug mt-0.5">
                      Turn planting drives into verified living forests
                    </p>
                  </div>
                </Link>
                <Link
                  to="/solutions"
                  className="group flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-[#F6F7FB] transition"
                >
                  <span className="w-8 h-8 rounded-[9px] bg-[#E9FBF3] text-[#18A96B] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs">
                    <Trophy size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#111] group-hover:text-[#18A96B]">
                      Team Competitions & Goals
                    </p>
                    <p className="text-[11px] text-[#7A7B85] leading-snug mt-0.5">
                      Keep every planter motivated together with live leaderboard updates
                    </p>
                  </div>
                </Link>
                <Link
                  to="/impact"
                  className="group flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-[#F6F7FB] transition"
                >
                  <span className="w-8 h-8 rounded-[9px] bg-[#FDF0F7] text-[#E6499B] flex items-center justify-center shrink-0 mt-0.5 font-semibold text-xs">
                    <Leaf size={16} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#111] group-hover:text-[#E6499B]">
                      AI Survival & Care
                    </p>
                    <p className="text-[11px] text-[#7A7B85] leading-snug mt-0.5">
                      Detect weak trees early & automate reminders
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-span-4 space-y-1 border-l border-[#F1F2F6] pl-4">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9496A1]">
                  Partners & Teams
                </p>
                <Link
                  to="/platform"
                  className="group flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-[#F6F7FB] transition"
                >
                  <span className="w-8 h-8 rounded-[9px] bg-white border border-[#ECEEF2] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-[#36C5F0]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#111]">Maps & Photo Sync</p>
                    <p className="text-[11px] text-[#7A7B85] leading-snug mt-0.5">
                      Instant tree updates & live photo verification
                    </p>
                  </div>
                </Link>
                <Link
                  to="/platform"
                  className="group flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-[#F6F7FB] transition"
                >
                  <span className="w-8 h-8 rounded-[9px] bg-white border border-[#ECEEF2] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    <ChartNoAxesColumn size={16} className="text-[#191919]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#111]">Reports & Data Hub</p>
                    <p className="text-[11px] text-[#7A7B85] leading-snug mt-0.5">
                      Create and download reports, PDFs & impact summaries
                    </p>
                  </div>
                </Link>
                <Link
                  to="/about"
                  className="group flex items-start gap-3 p-2.5 rounded-[12px] hover:bg-[#F6F7FB] transition"
                >
                  <span className="w-8 h-8 rounded-[9px] bg-white border border-[#ECEEF2] shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                    <TreeDeciduous size={16} className="text-[#0F9D58]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold text-[#111]">About TREEDAM</p>
                    <p className="text-[11px] text-[#7A7B85] leading-snug mt-0.5">
                      Made for everyone who plants
                    </p>
                  </div>
                </Link>
              </div>

              <div className="col-span-4 rounded-[16px] bg-gradient-to-br from-[#EEF5FF] via-[#F3F0FF] to-[#FFF5FA] p-4 flex flex-col justify-between border border-[#E6EAFF]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-md bg-white/90 text-[#4F5EFF] text-[10px] font-semibold border border-[#DCE1FF]">
                      44% Die Unverified
                    </span>
                    <TreeDeciduous size={18} className="text-[#625DF5]" aria-hidden="true" />
                  </div>
                  <h4 className="text-[14px] font-semibold text-[#111] tracking-tight">
                    Your all-in-one tree survival workspace
                  </h4>
                  <p className="text-[11px] text-[#656774] mt-1.5 leading-relaxed">
                    Plant it, track it, verify alive and show real proof in 30 days.
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-white/70">
                  <Link
                    to="/signup"
                    className="text-[11.5px] font-semibold text-[#111] hover:text-[#4F5EFF] inline-flex items-center gap-1"
                  >
                    Start Planting Free <span>→</span>
                  </Link>
                  <Link
                    to="/solutions"
                    className="text-[11px] text-[#666] hover:text-[#111]"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <NavLink to="/plans" className={navLinkClass}>
            <span className="inline-flex items-center gap-1.5">
              Plans
              <span className="text-[8.5px] font-bold tracking-wider uppercase px-1.5 py-[1px] rounded-[4px] bg-[#EEF1FF] text-[#4E60FF] border border-[#BBC5FF]">
                NEW
              </span>
            </span>
          </NavLink>

          <NavLink to="/pricing" className={navLinkClass}>
            Pricing
          </NavLink>

          <NavLink to="/impact" className={navLinkClass}>
            Impact
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/signin"
            className="h-[34px] px-4 rounded-[9px] bg-[#F6F6F7] hover:bg-[#ECECEE] text-[#1D1D20] text-[12px] font-medium inline-flex items-center justify-center transition"
          >
            Sign in
          </Link>
          <Link
            to="/contact"
            className="h-[34px] px-4 rounded-[9px] bg-[#0F0F12] hover:bg-black text-white text-[12px] font-medium inline-flex items-center justify-center transition shadow-xs"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Hamburger Button matching reference (black rounded square on right) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-[34px] h-[34px] rounded-[9px] bg-[#0F0F12] text-white flex flex-col items-center justify-center gap-[3.5px]"
          aria-label="Toggle Menu"
        >
          <span className="w-3.5 h-[1.5px] bg-white rounded-full" />
          <span className="w-3.5 h-[1.5px] bg-white rounded-full" />
          <span className="w-3.5 h-[1.5px] bg-white rounded-full" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 rounded-[18px] bg-white border border-[#EAEAEA] shadow-xl p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 gap-1">
            <Link to="/" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50">
              Home
            </Link>
            <Link to="/platform" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50">
              Platform
            </Link>
            <Link to="/solutions" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50 flex items-center justify-between">
              <span>Solutions</span>
              <span className="text-[11px] text-indigo-600 font-medium">Explore tree survival →</span>
            </Link>
            <Link to="/plans" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50 flex items-center gap-2">
              <span>Plans</span>
              <span className="text-[8.5px] font-bold uppercase px-1.5 py-[1px] rounded bg-[#EEF1FF] text-[#4E60FF] border border-[#BBC5FF]">
                NEW
              </span>
            </Link>
            <Link to="/pricing" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50">
              Pricing
            </Link>
            <Link to="/impact" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50">
              Impact
            </Link>
            <Link to="/about" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50">
              About Us
            </Link>
            <Link to="/contact" className="px-3 py-2.5 rounded-xl text-[13px] font-medium hover:bg-zinc-50">
              Contact Us
            </Link>
          </div>
          <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-2">
            <Link
              to="/signin"
              className="h-9 rounded-[9px] bg-[#F5F5F7] text-[#111] text-[12px] font-medium flex items-center justify-center"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="h-9 rounded-[9px] bg-[#0F0F12] text-white text-[12px] font-medium flex items-center justify-center"
            >
              Start Planting Free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
