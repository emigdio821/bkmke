export const siteConfig = {
  name: 'bkmk',
  url: 'tbd',
  ogImage: 'tbd',
  description: 'Simple bookmark manager.',
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
}

export type SiteConfig = typeof siteConfig