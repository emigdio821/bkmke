const appName = 'bkmke'
const appDesc = 'bkmke is a simple bookmark manager.'
const appUrl = 'https://bkmke.vercel.app'
export const appOgUrl = 'https://bkmke.vercel.app/api/og'

export const siteConfig = {
  name: appName,
  url: appUrl,
  ogUrl: appOgUrl,
  ogImage: appOgUrl,
  description: appDesc,
  links: {
    github: 'https://github.com/emigdio821/bkmk',
  },
  icons: {
    icon: ['/images/favicon.ico'],
    shortcut: '/images/favicon-16x16.png',
    apple: '/images/apple-touch-icon.png',
    other: [
      {
        url: '/images/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/images/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/images/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/images/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  og: {
    title: appName,
    description: appDesc,
    url: appUrl,
    siteName: appName,
    locale: 'en-US',
    type: 'website',
    images: appOgUrl,
  },
  ogTwitter: {
    card: 'summary_large_image',
    title: appName,
    description: appDesc,
    images: [appOgUrl],
    creator: '@emigdio821',
  },
}

export type SiteConfig = typeof siteConfig
