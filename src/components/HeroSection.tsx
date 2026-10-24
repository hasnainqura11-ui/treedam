import React from 'react';
import { motion } from 'motion/react';
import { MoreVertical, Check } from 'lucide-react';
import {
  GmailLogo,
  GoogleGLogo,
  TrustpilotStar,
  NotionLogo,
} from './BrandIcons';

interface HeroSectionProps {
  onStartTrial: () => void;
  onTalkToSales: () => void;
}

export function HeroSection({
  onStartTrial,
  onTalkToSales,
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden pt-6 sm:pt-10 pb-14 sm:pb-20">
      <div className="hero-world-map pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={`${import.meta.env.BASE_URL}world-map-pencil.svg`}
          alt=""
          width={1440}
          height={760}
          className="h-full w-full object-contain"
          decoding="async"
        />
      </div>
      {/* Concentric Orbital Rings Background (Desktop & Tablet visible, subtle on mobile) */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden">
        <div className="relative w-[1280px] h-[760px] -mt-12 shrink-0">
          {/* SVG Concentric Arcs & Blue Accent Segments */}
          <svg
            className="w-full h-full"
            viewBox="0 0 1280 760"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ring 1 (Innermost) - R = 310 */}
            <circle
              cx="640"
              cy="280"
              r="310"
              stroke="#EEF2F6"
              strokeWidth="1.2"
            />
            {/* Ring 2 - R = 415 */}
            <circle
              cx="640"
              cy="280"
              r="415"
              stroke="#EEF2F6"
              strokeWidth="1.2"
            />
            {/* Blue Accent Arc on Ring 2 Left */}
            <path
              d="M 229 338 A 415 415 0 0 1 226 235"
              stroke="#3B82F6"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Blue Accent Arc on Ring 2 Right */}
            <path
              d="M 1042 382 A 415 415 0 0 1 1018 450"
              stroke="#3B82F6"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Ring 3 - R = 525 */}
            <circle
              cx="640"
              cy="280"
              r="525"
              stroke="#F1F5F9"
              strokeWidth="1.2"
            />
            {/* Blue Accent Arc on Ring 3 Left */}
            <path
              d="M 135 424 A 525 525 0 0 1 118 335"
              stroke="#3B82F6"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Blue Accent Arc on Ring 3 Right */}
            <path
              d="M 1164 252 A 525 525 0 0 1 1154 368"
              stroke="#3B82F6"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Ring 4 (Outermost) - R = 635 */}
            <circle
              cx="640"
              cy="280"
              r="635"
              stroke="#F8FAFC"
              strokeWidth="1.2"
            />
          </svg>


        </div>
      </div>

      {/* Central Hero Content Container */}
      <div className="relative z-10 max-w-[780px] mx-auto px-4 sm:px-6 text-center pt-4 sm:pt-8">
        {/* Ratings Row: G 4.6 Google + * 4.9 Trustpilot */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center justify-center gap-4 mb-5"
        >
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569]">
            <GoogleGLogo className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#090a0f]">4.6</span>
            <span className="text-slate-500">Google</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569]">
            <TrustpilotStar className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#090a0f]">4.9</span>
            <span className="text-slate-500">Trustpilot</span>
          </div>
        </motion.div>

        <div className="hero-copy-readability relative isolate">
        {/* Main Display Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-[36px] sm:text-[52px] md:text-[58px] font-bold tracking-[-0.035em] text-[#090a0f] leading-[1.08] max-w-[600px] mx-auto"
        >
          From one seed, a whole forest
        </motion.h1>

        {/* Subcopy */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 sm:mt-5 text-[14.5px] sm:text-[16px] text-[#64748b] leading-[1.6] max-w-[460px] mx-auto font-normal"
        >
          <span className="bg-blue-200/25 rounded-sm box-decoration-clone">
            From one seedling to a whole forest, track every tree in one place and watch the Earth breathe again.
          </span>
        </motion.p>
        </div>

        {/* Action Buttons (Desktop: Get started free / Talk to sales team; Mobile: Start a Free Trial / Book a Demo) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-7 sm:mt-8 flex items-center justify-center gap-3"
        >
          <button
            onClick={onStartTrial}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0a0b10] hover:bg-[#1e2029] text-white text-[13.5px] sm:text-[14px] font-semibold shadow-[0_8px_20px_-4px_rgba(10,11,16,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(10,11,16,0.4)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">Get started free</span>
            <span className="sm:hidden">Start a Free Trial</span>
          </button>
          <button
            onClick={onTalkToSales}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-slate-50 text-[#090a0f] border border-[#e2e8f0] text-[13.5px] sm:text-[14px] font-medium shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">Talk to sales team</span>
            <span className="sm:hidden">Book a Demo</span>
          </button>
        </motion.div>

        {/* Stacked Notification Cards with Soft Blue Glow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="relative mt-10 sm:mt-12 mx-auto max-w-[420px] pb-6"
        >
          {/* Ambient Blue Aura Behind Stack */}
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-6 hero-blue-glow blur-2xl rounded-full z-0" />
          <div className="pointer-events-none absolute inset-x-6 top-6 bottom-0 bg-blue-400/20 blur-2xl rounded-full z-0" />

          {/* Card 1 (Top / Foremost): Wei Chen */}
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="relative z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-white shadow-[0_12px_32px_-8px_rgba(30,64,175,0.14)] px-4 py-3 flex items-center gap-3 text-left"
          >
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces&auto=format"
                alt="Wei Chen"
                className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-100"
              />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center ring-2 ring-white">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-[#090a0f] truncate">
                <span className="font-bold">Ayesha Khan</span>{' '}
                <span className="text-slate-500 font-normal">planted a</span>{' '}
                <span className="font-bold">Chinar tree</span>
              </p>
              <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">
                8 min ago • Skardu, Gilgit-Baltistan
              </p>
            </div>
          </motion.div>

          {/* Card 2 (Middle): Matthew Johnson */}
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="relative z-20 -mt-2 mx-3 sm:mx-4 bg-white/92 backdrop-blur-md rounded-2xl border border-white/90 shadow-[0_12px_28px_-6px_rgba(30,64,175,0.14)] px-4 py-2.5 flex items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&auto=format"
                  alt="Matthew Johnson"
                  className="w-9 h-9 rounded-full object-cover bg-slate-100 border border-slate-100"
                />
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold text-[#090a0f] truncate">
                  Bilal Ahmed
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Planter • <span className="text-slate-300">@bilalplants</span>
                </p>
              </div>
            </div>
            <MoreVertical className="w-4 h-4 text-slate-300 shrink-0" />
          </motion.div>

          {/* Card 3 (Bottom): Terry Lipshutz with Gmail M logo */}
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="relative z-10 -mt-2 mx-7 sm:mx-8 bg-white/85 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_14px_30px_-6px_rgba(37,99,235,0.18)] px-4 py-2.5 flex items-center gap-3 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <GmailLogo className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-bold text-slate-700 truncate">
                TREEDAM Alert
              </p>
              <p className="text-[10.5px] text-slate-400 truncate">
                Your tree passed its survival check...
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Trusted by 200,000+ users worldwide */}
        <div className="mt-10 sm:mt-14">
          <p className="text-[12.5px] font-medium text-slate-400 tracking-tight">
            Trusted by 200,000+ users worldwide
          </p>
        </div>
      </div>

      {/* Community and organization strip */}
      <div className="mt-6 max-w-[1040px] mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-7 sm:gap-x-9 gap-y-4 opacity-75">
          <span className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-slate-500 hover:text-slate-800 transition-colors select-none text-center">
            Forest Departments • Trillion Tree • Climate NGOs • Universities &amp; Colleges • CSR Teams • Farmers &amp; Planters
          </span>
        </div>
      </div>
    </section>
  );
}
