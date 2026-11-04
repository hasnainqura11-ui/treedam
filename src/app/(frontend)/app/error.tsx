'use client'
import Link from 'next/link'
export default function ErrorPage({reset}:{error:Error;reset:()=>void}) {
  return <main className="flex min-h-screen items-center justify-center bg-app-canvas p-6"><div className="w-full max-w-md rounded-3xl border border-app-border bg-white p-8 shadow-panel"><h1 className="text-2xl font-semibold">Let’s get your forest back in view.</h1><p className="my-5 text-sm leading-relaxed text-app-muted">This workspace couldn’t render. Your saved demo records have not been reset.</p><div className="flex gap-3"><button className="btn btn-primary" onClick={reset}>Try again</button><Link href="/signin" className="btn btn-secondary">Return to entry</Link></div></div></main>
}
