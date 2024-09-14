import { type Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { Footer } from '@/components/footer'

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
      <Footer noPadding />
    </>
  )
}
