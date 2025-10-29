const appName = 'bkmke'
const appDesc = 'bkmke is a simple bookmark manager.'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return import.meta.env.VITE_APP_URL || 'https://bkmke.netlify.app'
}

const appUrl = getBaseUrl()
export const appOgUrl = `${appUrl}/api/og-img`

export const siteConfig = {
  name: appName,
  url: appUrl,
  ogUrl: appOgUrl,
  ogImage: appOgUrl,
  keywords: [
    'Emigdio Torres',
    'Emigdio',
    'Torres',
    'bkmke',
    'Bookmark manager',
    'bookmarks',
    'Next.js',
    'Tailwind',
    'Mexico',
    'opensource',
  ],
  description: appDesc,
  links: {
    github: 'https://github.com/emigdio821/bkmk',
  },
  icons: {
    icon: ['/favicon.ico'],
    shortcut: '/images/favicon-16x16.png',
    apple: '/images/favicon-apple.png',
    i16: {
      url: '/images/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    i32: {
      url: '/images/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    i192: {
      url: '/images/favicon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    i512: {
      url: '/images/favicon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
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
    images: appOgUrl,
    creator: '@emigdio821',
  },
}

export type SiteConfig = typeof siteConfig
