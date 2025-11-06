import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: {
    default: 'Log in',
    template: `%s · ${siteConfig.name}`,
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return (
    <>
      <section className="p-4">{children}</section>
      <Footer />
    </>
  )
}
