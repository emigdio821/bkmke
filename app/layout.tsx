import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Providers } from '@/components/providers'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

interface RootLayoutProps {
  children: React.ReactNode
}

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  keywords: siteConfig.keywords,
  description: siteConfig.description,
  creator: 'Emigdio Torres',
  icons: siteConfig.icons,
  openGraph: siteConfig.og,
  metadataBase: new URL(siteConfig.url),
  twitter: siteConfig.ogTwitter,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('antialiased', fontSans.className, fontSans.variable)}>
        <Providers>
          <main className="relative flex min-h-dvh flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
