import type { Metadata, Viewport } from 'next'
import { Figtree } from 'next/font/google'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import '@/styles/globals.css'

interface RootLayoutProps {
  children: React.ReactNode
}

const fontSans = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  creator: 'Emigdio Torres',
  icons: siteConfig.icons,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn('bg-background antialiased', fontSans.className)}>
        <Providers>
          <main className="relative m-auto flex min-h-dvh w-full max-w-6xl flex-col">{children}</main>
        </Providers>
        <TailwindIndicator />
      </body>
    </html>
  )
}
