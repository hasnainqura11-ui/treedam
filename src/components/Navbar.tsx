import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Sparkles,
  Layers,
  Workflow,
  ShieldCheck,
  BarChart3,
  Cpu,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  FolderKanban,
  Users,
  Zap,
  Globe,
  Menu,
  X,
  Command,
  FileText,
  Bot,
  MapPin,
  Camera,
  Leaf
} from 'lucide-react';
import { TreedamLogo } from './BrandIcons';

export type PageView =
  | 'home'
  | 'products'
  | 'solutions'
  | 'services'
  | 'pricing'
  | 'insight'
  | 'signin'
  | 'contact';

export interface SolutionItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  metric: string;
  icon: React.ReactNode;
  accent: string;
}

export const SOLUTIONS_LIST: SolutionItem[] = [
  {
    id: 'ai-task-automation',
    title: 'AI Task Automation',
    subtitle: 'Auto-assign, prioritize, and break down complex sprints effortlessly',
    badge: 'POPULAR',
    metric: '5 hrs/wk saved',
    icon: <Bot className="w-4 h-4 text-blue-600" />,
    accent: 'bg-blue-50 border-blue-100',
  },
  {
    id: 'cross-team-alignment',
    title: 'Cross-Team Alignment',
    subtitle: 'Keep product, design, and engineering synced in real-time',
    metric: '100% visibility',
    icon: <Users className="w-4 h-4 text-indigo-600" />,
    accent: 'bg-indigo-50 border-indigo-100',
  },
  {
    id: 'enterprise-workflows',
    title: 'Enterprise Workflows',
    subtitle: 'Custom multi-stage approvals, SOC2 compliance & permissions',
    badge: 'NEW',
    metric: '384% ROI',
    icon: <Workflow className="w-4 h-4 text-emerald-600" />,
    accent: 'bg-emerald-50 border-emerald-100',
  },
  {
    id: 'resource-scheduling',
    title: 'Smart Scheduling & Timeline',
    subtitle: 'Predict bottlenecks before they happen with AI capacity planning',
    metric: '10% lower churn',
    icon: <Clock className="w-4 h-4 text-amber-600" />,
    accent: 'bg-amber-50 border-amber-100',
  },
  {
    id: 'executive-analytics',
    title: 'Executive Revenue Insights',
    subtitle: 'Real-time portfolio tracking, velocity metrics & ROI reporting',
    metric: '$3.9M gains',
    icon: <BarChart3 className="w-4 h-4 text-purple-600" />,
    accent: 'bg-purple-50 border-purple-100',
  },
  {
    id: 'document-intelligence',
    title: 'AI Document Hub',
    subtitle: 'Turn PRDs, PDFs, and meeting notes into actionable checklists',
    metric: '92.4k hrs saved',
    icon: <FileText className="w-4 h-4 text-rose-600" />,
    accent: 'bg-rose-50 border-rose-100',
  },
];

export const SERVICES_LIST = [
  {
    id: ' dedicated-onboarding',
    title: 'White-Glove Workspace Migration',
    desc: 'Zero-downtime import from Jira, Asana, Linear, or Notion in under 48 hours.',
    tag: 'Included in Pro',
  },
  {
    id: 'custom-ai-agents',
    title: 'Custom AI Workflow Engineering',
    desc: 'Bespoke AI agents trained on your internal documentation and sprint rituals.',
    tag: 'NEW',
  },
  {
    id: 'solutions-architect',
    title: 'Dedicated Solutions Architect',
    desc: '1-on-1 quarterly workflow audits and executive KPI dashboard design.',
    tag: 'Enterprise',
  },
];

interface NavbarProps {
  activePage: PageView;
  selectedSolutionId: string;
  onNavigate: (page: PageView, subId?: string) => void;
  onOpenDemoModal: () => void;
}

export function Navbar({
  activePage,
  selectedSolutionId,
  onNavigate,
  onOpenDemoModal,
}: NavbarProps) {
  const [openMenu, setOpenMenu] = useState<'products' | 'solutions' | 'services' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<'solutions' | 'services' | 'products' | null>('solutions');
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const handleMouseEnter = (menu: 'products' | 'solutions' | 'services') => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null);
    }, 160);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 sm:pt-4 pb-2 pointer-events-none">
      <div className="max-w-[1040px] mx-auto pointer-events-auto relative">
        {/* Main Floating Pill Container matching screenshot 4 & mobile screenshot 1 */}
        <div className="bg-white/95 backdrop-blur-xl border border-[#eef1f6] shadow-[0_4px_24px_-4px_rgba(15,23,42,0.05)] rounded-2xl px-4 sm:px-5 h-[56px] flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <button
            onClick={() => {
              onNavigate('home');
              setOpenMenu(null);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
          >
            <TreedamLogo />
          </button>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Products */}
            <div
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button
                onClick={() => {
                  setOpenMenu(openMenu === 'products' ? null : 'products');
                  onNavigate('products');
                }}
                className={`px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  activePage === 'products' || openMenu === 'products'
                    ? 'text-[#090a0f] bg-slate-100/80'
                    : 'text-[#475569] hover:text-[#090a0f] hover:bg-slate-50'
                }`}
              >
                Products
              </button>
            </div>

            {/* Solutions with Chevron */}
            <div
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button
                onClick={() =>
                  setOpenMenu(openMenu === 'solutions' ? null : 'solutions')
                }
                className={`px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  activePage === 'solutions' || openMenu === 'solutions'
                    ? 'text-[#090a0f] bg-slate-100/80'
                    : 'text-[#475569] hover:text-[#090a0f] hover:bg-slate-50'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    openMenu === 'solutions' ? 'rotate-180 text-[#090a0f]' : ''
                  }`}
                />
              </button>
            </div>

            {/* Services with NEW pill */}
            <div
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
              className="relative"
            >
              <button
                onClick={() => {
                  setOpenMenu(openMenu === 'services' ? null : 'services');
                  onNavigate('services');
                }}
                className={`px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activePage === 'services' || openMenu === 'services'
                    ? 'text-[#090a0f] bg-slate-100/80'
                    : 'text-[#475569] hover:text-[#090a0f] hover:bg-slate-50'
                }`}
              >
                <span>Services</span>
                <span className="inline-flex items-center px-1.5 py-[1px] rounded-[5px] text-[10px] font-semibold tracking-wide bg-[#eef4ff] text-[#3b82f6] border border-[#dbeafe]">
                  NEW
                </span>
              </button>
            </div>

            {/* Pricing */}
            <button
              onClick={() => {
                setOpenMenu(null);
                onNavigate('pricing');
              }}
              className={`px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
                activePage === 'pricing'
                  ? 'text-[#090a0f] bg-slate-100/80'
                  : 'text-[#475569] hover:text-[#090a0f] hover:bg-slate-50'
              }`}
            >
              Pricing
            </button>

            {/* Insight */}
            <button
              onClick={() => {
                setOpenMenu(null);
                onNavigate('insight');
              }}
              className={`px-3 py-1.5 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
                activePage === 'insight'
                  ? 'text-[#090a0f] bg-slate-100/80'
                  : 'text-[#475569] hover:text-[#090a0f] hover:bg-slate-50'
              }`}
            >
              Insight
            </button>
          </nav>

          {/* Desktop Right CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => {
                setOpenMenu(null);
                onNavigate('signin');
              }}
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#090a0f] bg-white border border-[#e2e8f0] hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setOpenMenu(null);
                onNavigate('contact');
              }}
              className="px-4 py-1.5 rounded-full text-[13px] font-medium text-white bg-[#0a0b10] hover:bg-[#1e2029] shadow-xs transition-all cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Mobile Hamburger Button matching screenshot 1 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden w-9 h-9 rounded-[10px] bg-[#0a0b10] text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Luxury Desktop Mega Dropdowns */}
        <AnimatePresence>
          {openMenu === 'solutions' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => handleMouseEnter('solutions')}
              onMouseLeave={handleMouseLeave}
              className="hidden md:block absolute left-0 right-0 top-[64px] bg-white/98 backdrop-blur-2xl rounded-3xl border border-[#e6ebf2] shadow-[0_24px_60px_-12px_rgba(15,23,42,0.14)] p-5 z-50 overflow-hidden"
            >
              <div className="grid grid-cols-12 gap-5">
                {/* Left 8 Columns: Solutions Selector Grid */}
                <div className="col-span-8">
                  <div className="flex items-center justify-between px-2 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Tailored AI Workspace Solutions
                    </span>
                    <button
                      onClick={() => {
                        onNavigate('solutions');
                        setOpenMenu(null);
                      }}
                      className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      Explore all solutions <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {SOLUTIONS_LIST.map((item) => {
                      const isSelected = selectedSolutionId === item.id && activePage === 'solutions';
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate('solutions', item.id);
                            setOpenMenu(null);
                          }}
                          className={`group text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                              : 'bg-white border-transparent hover:border-slate-200/80 hover:bg-slate-50/70'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105 ${item.accent}`}
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13.5px] font-semibold text-[#090a0f] group-hover:text-blue-600 transition-colors truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="px-1.5 py-[1px] text-[9px] font-bold rounded bg-blue-100 text-blue-700">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                              {item.subtitle}
                            </p>
                            <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              {item.metric}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right 4 Columns: Luxury Live Solution Preview Card */}
                <div className="col-span-4 rounded-2xl soft-panel-glow border border-blue-100/80 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-blue-100 text-[11px] font-semibold text-blue-600 shadow-2xs">
                      <Sparkles className="w-3 h-3" /> TREEDAM AI Engine 2.4
                    </div>
                    <h4 className="text-[16px] font-bold text-[#090a0f] mt-3 leading-snug">
                      Turn plans into completed tasks automatically
                    </h4>
                    <p className="text-[12.5px] text-slate-500 mt-1.5 leading-relaxed">
                      Trusted by 200,000+ users worldwide to deliver 384% ROI and save 5+ hours every week.
                    </p>

                    {/* Mini Live Stack Card Preview */}
                    <div className="mt-4 bg-white/95 rounded-xl p-3 border border-slate-100 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-800">
                          Regent App Redesign
                        </span>
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-indigo-50 text-indigo-600">
                          ● In progress
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-3/4 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] text-slate-400">
                        <span>Robert E. • Smith K.</span>
                        <span>Mar 26, 2026</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setOpenMenu(null);
                        onOpenDemoModal();
                      }}
                      className="text-[12.5px] font-semibold text-[#090a0f] hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                    >
                      Book interactive demo <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-400">&lt;6 mo payback</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {openMenu === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
              className="hidden md:block absolute left-12 right-12 top-[64px] bg-white/98 backdrop-blur-2xl rounded-3xl border border-[#e6ebf2] shadow-[0_24px_60px_-12px_rgba(15,23,42,0.14)] p-5 z-50"
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    TREEDAM Professional Services
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                    NEW FOR GROWING TEAMS
                  </span>
                </div>
                <button
                  onClick={() => {
                    onNavigate('services');
                    setOpenMenu(null);
                  }}
                  className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  Open full Services page <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SERVICES_LIST.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => {
                      onNavigate('services', srv.id);
                      setOpenMenu(null);
                    }}
                    className="text-left p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-blue-100/80 text-[10px] font-semibold text-slate-600 group-hover:text-blue-700">
                        {srv.tag}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <h5 className="text-[14px] font-bold text-[#090a0f] group-hover:text-blue-600">
                      {srv.title}
                    </h5>
                    <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                      {srv.desc}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {openMenu === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => handleMouseEnter('products')}
              onMouseLeave={handleMouseLeave}
              className="hidden md:block absolute left-10 right-10 top-[64px] bg-white/98 backdrop-blur-2xl rounded-3xl border border-[#e6ebf2] shadow-[0_24px_60px_-12px_rgba(15,23,42,0.14)] p-5 z-50"
            >
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    onNavigate('products', 'workspace');
                    setOpenMenu(null);
                  }}
                  className="text-left p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div className="text-[14px] font-bold text-[#090a0f]">
                    All-in-One Workspace
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1">
                    Kanban boards, checklists, timelines, and real-time team docs in one place.
                  </p>
                </button>
                <button
                  onClick={() => {
                    onNavigate('products', 'integrations');
                    setOpenMenu(null);
                  }}
                  className="text-left p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-[#36C5F0]" aria-hidden="true" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Camera className="w-4 h-4 text-[#191919]" aria-hidden="true" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-[#625DF5]" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-[14px] font-bold text-[#090a0f]">
                    Native Integrations Hub
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1">
                    Connect Slack, Notion, Google Drive, Dropbox, and Loom with 1-click sync.
                  </p>
                </button>
                <button
                  onClick={() => {
                    onNavigate('products', 'dashboard');
                    setOpenMenu(null);
                  }}
                  className="text-left p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                    <Command className="w-4 h-4" />
                  </div>
                  <div className="text-[14px] font-bold text-[#090a0f]">
                    Smart Team Dashboard
                  </div>
                  <p className="text-[12px] text-slate-500 mt-1">
                    Live sprint tracking, scheduling & visibility built for growing modern teams.
                  </p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Luxury Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden mt-2 bg-white/98 backdrop-blur-2xl rounded-3xl border border-[#e6ebf2] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.16)] overflow-hidden z-50"
            >
              <div className="p-4 space-y-2 max-h-[80vh] overflow-y-auto">
                {/* Mobile Solutions Accordion */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() =>
                      setMobileAccordion(mobileAccordion === 'solutions' ? null : 'solutions')
                    }
                    className="w-full px-4 py-3 bg-slate-50/70 flex items-center justify-between text-[14px] font-semibold text-[#090a0f]"
                  >
                    <span>Solutions</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        mobileAccordion === 'solutions' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileAccordion === 'solutions' && (
                    <div className="p-2.5 bg-white space-y-1.5">
                      {SOLUTIONS_LIST.map((sol) => (
                        <button
                          key={sol.id}
                          onClick={() => {
                            onNavigate('solutions', sol.id);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/50 flex items-center gap-3 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${sol.accent}`}>
                            {sol.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-semibold text-[#090a0f] flex items-center gap-1.5">
                              {sol.title}
                              {sol.badge && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-100 text-blue-700 rounded">
                                  {sol.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {sol.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Services Accordion */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() =>
                      setMobileAccordion(mobileAccordion === 'services' ? null : 'services')
                    }
                    className="w-full px-4 py-3 bg-slate-50/70 flex items-center justify-between text-[14px] font-semibold text-[#090a0f]"
                  >
                    <div className="flex items-center gap-2">
                      <span>Services</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#eef4ff] text-[#3b82f6] border border-[#dbeafe]">
                        NEW
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        mobileAccordion === 'services' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileAccordion === 'services' && (
                    <div className="p-2.5 bg-white space-y-1.5">
                      {SERVICES_LIST.map((srv) => (
                        <button
                          key={srv.id}
                          onClick={() => {
                            onNavigate('services', srv.id);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold text-[#090a0f]">
                              {srv.title}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {srv.tag}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-500 mt-0.5">{srv.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Links */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onNavigate('products');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 text-[13px] font-semibold text-[#090a0f] text-center"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('pricing');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 text-[13px] font-semibold text-[#090a0f] text-center"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('insight');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 text-[13px] font-semibold text-[#090a0f] text-center"
                  >
                    Insight
                  </button>
                </div>

                {/* Mobile Auth & CTA */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onNavigate('signin');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2.5 rounded-full text-[13px] font-semibold text-[#090a0f] border border-slate-200 bg-white"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2.5 rounded-full text-[13px] font-semibold text-white bg-[#0a0b10]"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
