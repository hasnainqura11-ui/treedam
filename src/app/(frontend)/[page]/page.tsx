import { notFound } from 'next/navigation'
import { Layout } from '@/components/site/Layout'
import { ContentPage, InformationPage, PricingPage, ContactPage } from '@/components/site/Pages'
import { AuthPage } from '@/components/product/AuthPage'

const content = ['platform','products','product','solutions','solution','plans','services','service','impact','strategy','insight','about']
const information = ['privacy','terms','security','stories','careers'] as const
export const dynamicParams = false
export function generateStaticParams() { return [...content, ...information, 'pricing', 'contact', 'signup', 'signin'].map(page => ({ page })) }
export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  let body
  if (content.includes(page)) body = <ContentPage kind={page} />
  else if ((information as readonly string[]).includes(page)) body = <InformationPage kind={page as typeof information[number]} />
  else if (page === 'pricing') body = <PricingPage />
  else if (page === 'contact') body = <ContactPage />
  else if (page === 'signup' || page === 'signin') body = <AuthPage mode={page} />
  else notFound()
  return <Layout>{body}</Layout>
}
