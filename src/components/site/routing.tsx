'use client'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string }
export function Link({ to, ...props }: LinkProps) { return <NextLink href={to} {...props} /> }
export function NavLink({ to, className, ...props }: Omit<LinkProps, 'className'> & {
  className?: string | ((state: { isActive: boolean }) => string)
}) {
  const isActive = usePathname() === to
  return <NextLink href={to} aria-current={isActive ? 'page' : undefined} className={typeof className === 'function' ? className({ isActive }) : className} {...props} />
}
export function useLocation() { return { pathname: usePathname() } }
export function useNavigate() { const router = useRouter(); return (to: string) => router.push(to) }
