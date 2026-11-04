'use client'
import Image from 'next/image'
import React from 'react'

export interface IconProps {
  size?: number
  className?: string
}

export function TreedamLogo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const widthClass = size === 'sm' ? 'w-20' : size === 'lg' ? 'w-32' : 'w-28'
  return (
    <Image
      src={`${'/'}treedam-logo.png`}
      alt="TREEDAM"
      width={588}
      height={141}
      className={`inline-block h-auto shrink-0 select-none object-contain ${widthClass} ${className}`}
    />
  )
}

export function GoogleGLogo({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

export function TrustpilotStar({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77 5.82 21 7 14.14 2 9.27l7.1-1.01L12 2z" fill="#00B67A" />
      <path d="M16.2 15.6l-.36-2.08-3.84 2.73 4.2-.65z" fill="#005128" />
    </svg>
  )
}

export function SlackLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5z" fill="#E01E5A" />
      <path d="M9 6a2 2 0 1 1 2-2v2H9zm0 1a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4h5z" fill="#36C5F0" />
      <path d="M18 9a2 2 0 1 1 2 2h-2V9zm-1 0a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0v5z" fill="#2EB67D" />
      <path d="M15 18a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5z" fill="#ECB22E" />
    </svg>
  )
}

export function ZapierLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="#FF4F00" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
    </svg>
  )
}

export function ColorfulAsteriskLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v9" stroke="#EA4335" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M12 12v9" stroke="#34A853" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M4.2 7.5L12 12" stroke="#FBBC05" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M12 12l7.8 4.5" stroke="#4285F4" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M19.8 7.5L12 12" stroke="#EA4335" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M12 12L4.2 16.5" stroke="#4285F4" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  )
}

export const GoogleWorkspaceAsterisk = ColorfulAsteriskLogo

export function MetaLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 28 20" fill="none" aria-hidden="true">
      <path
        d="M6.5 4C3.5 4 1.5 6.8 1.5 10.2c0 3.1 2 5.8 4.8 5.8 2.2 0 3.9-1.5 5.8-4.5l1.9-3c1.8-2.8 3.5-4.5 6-4.5 3 0 5 2.7 5 6.1 0 3.2-2.1 5.9-4.9 5.9-2.2 0-3.8-1.4-5.5-4.1"
        stroke="#0866FF"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8.5L12.1 5.8C10.5 3.6 8.6 4 6.5 4"
        stroke="#0866FF"
        strokeWidth="2.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function MailchimpLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#FFE01B" />
      <circle cx="11.5" cy="12.5" r="5.5" fill="#1E1E1E" />
      <circle cx="13" cy="11.5" r="1.2" fill="#FFE01B" />
      <path d="M9 14.5c1.2 1 3.5 1 4.5 0" stroke="#FFE01B" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M7 8.5c2-2 6-2.5 8.5-.5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function GoogleAdsLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4.5 17.5L10.8 5.2a2.2 2.2 0 0 1 3.9 2L8.4 19.5a2.2 2.2 0 0 1-3.9-2z" fill="#FBBC04" />
      <path d="M13.2 5.2l6.3 12.3a2.2 2.2 0 0 1-3.9 2L9.3 7.2a2.2 2.2 0 0 1 3.9-2z" fill="#4285F4" />
      <circle cx="6.5" cy="18.2" r="2.3" fill="#34A853" />
    </svg>
  )
}

export function AwsLogo({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 32 24" fill="none" aria-hidden="true">
      <text x="4" y="13.5" fill="#1F242D" fontSize="9.5" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="-0.4">
        aws
      </text>
      <path d="M5.5 16.5c4.8 3.2 13.8 3.2 19.5.2" stroke="#FF9900" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23.5 15.2l2.3 1.2-1.1 2.2" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function JiraFLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6h12l-2 3.2H6V6z" fill="#2684FF" />
      <path d="M6 10.8h9.5l-2 3.2H6v-3.2z" fill="#0052CC" />
      <path d="M6 15.6h5.5L9.8 19H6v-3.4z" fill="#4C9AFF" />
    </svg>
  )
}

export const FIconLogo = JiraFLogo

export function ClickUpLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.5 11.5L12 6l6.5 5.5" stroke="url(#cu1)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 16c1.6 1.7 3.5 2.5 5.5 2.5s3.9-.8 5.5-2.5" stroke="url(#cu2)" strokeWidth="3.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="cu1" x1="5" y1="6" x2="19" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF02F0" />
          <stop offset="1" stopColor="#FFC800" />
        </linearGradient>
        <linearGradient id="cu2" x1="6" y1="16" x2="18" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8930FD" />
          <stop offset="1" stopColor="#49CCF9" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function AirtableLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4L3.5 7.5 12 11l8.5-3.5L12 4z" fill="#FCB400" />
      <path d="M12.5 12v8l8-3.4V8.6l-8 3.4z" fill="#18BFFF" />
      <path d="M11.5 12L3.5 8.6v8l8 3.4v-8z" fill="#F82B60" />
    </svg>
  )
}

export function GmailLogo({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8l6 4.5 6-4.5V20h2c1.1 0 2-.9 2-2V6.5c0-1.8-2.1-2.8-3.5-1.7L12 10 5.5 4.8C4.1 3.7 2 4.7 2 6.5z" fill="#EA4335" />
      <path d="M2 6.5V18c0 1.1.9 2 2 2h2V9.8L2 6.5z" fill="#4285F4" />
      <path d="M22 6.5V18c0 1.1-.9 2-2 2h-2V9.8l4-3.3z" fill="#34A853" />
      <path d="M18 9.8V4.8L12 9.3 6 4.8v5l6 4.5 6-4.5z" fill="#EA4335" />
      <path d="M22 6.5c0-1.8-2.1-2.8-3.5-1.7L18 5.2v4.6l4-3.3z" fill="#FBBC04" />
    </svg>
  )
}

export function GoogleDriveLogo({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.5 3.5h7l6 10.5h-7L8.5 3.5z" fill="#FBBC04" />
      <path d="M2.5 14l6-10.5 3.5 6-6 10.5-3.5-6z" fill="#0F9D58" />
      <path d="M6 20h12.5l3-6H9l-3 6z" fill="#4285F4" />
    </svg>
  )
}

export function DropboxLogo({ size = 16, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3L2 6.2 7 9.5l5-3.3L7 3zm10 0l-5 3.2 5 3.3 5-3.3L17 3zM2 12.8L7 16l5-3.2-5-3.3-5 3.3zm15-3.3l-5 3.3 5 3.2 5-3.2-5-3.3zM12 14.2L7 17.5 4.8 16v2.2L12 22.5l7.2-4.3V16L17 17.5 12 14.2z" fill="#0061FF" />
    </svg>
  )
}

export function NotionLogo({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" fill="#FFFFFF" stroke="#191919" strokeWidth="1.6" />
      <path d="M8 17V7.5h2.2l4.1 6.3V7.5H16V17h-2l-4.3-6.5V17H8z" fill="#191919" />
    </svg>
  )
}

export function LoomLogo({ size = 22, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="#625DF5" strokeWidth="2.1" strokeLinecap="round">
        <path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5M5.3 5.3l3.5 3.5M15.2 15.2l3.5 3.5M18.7 5.3l-3.5 3.5M8.8 15.2l-3.5 3.5" />
      </g>
      <circle cx="12" cy="12" r="2.8" fill="#FFFFFF" stroke="#625DF5" strokeWidth="1.8" />
    </svg>
  )
}

export function PdfIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="18" height="20" rx="4" fill="#FFEBEE" stroke="#FFCDD2" />
      <rect x="5" y="9" width="14" height="7" rx="2" fill="#EF4444" />
      <text x="6.8" y="14.2" fill="#FFF" fontSize="5.2" fontWeight="800" fontFamily="Inter, sans-serif">PDF</text>
    </svg>
  )
}

export function AvatarImg({
  src,
  alt,
  size = 30,
  badge,
}: {
  src: string
  alt: string
  size?: number
  badge?: 'blue' | 'green' | null
}) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <Image width={120} height={120}
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover border border-white shadow-xs bg-zinc-200"
      />
      {badge === 'blue' && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#3B82F6] border-[1.5px] border-white flex items-center justify-center text-[7px] text-white font-bold">
          ✓
        </span>
      )}
      {badge === 'green' && (
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#22C55E] border-[1.5px] border-white flex items-center justify-center text-[7px] text-white font-bold">
          ✓
        </span>
      )}
    </span>
  )
}

export const AVATARS = {
  wei: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces&auto=format',
  matthew: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces&auto=format',
  laura: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces&auto=format',
  albert: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces&auto=format',
  robert: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces&auto=format',
  smith: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces&auto=format',
  user5: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces&auto=format',
}
