import { siteConfig } from '@/config/site'

interface SEOOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
}

export function createTitle(title?: string, includeBase = true) {
  if (!title) {
    return siteConfig.name
  }

  return includeBase ? `${title} · ${siteConfig.name}` : title
}

export function createSEOMeta(options?: SEOOptions) {
  const title = createTitle(options?.title)
  const description = options?.description || siteConfig.description
  const image = options?.image || siteConfig.ogTwitter.images
  const url = options?.url || siteConfig.url

  return [
    { charSet: 'utf-8' },
    {
      name: 'creator',
      content: 'Emigdio Torres',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
    },
    { title },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: light)',
      content: '#ffffff',
    },
    {
      name: 'theme-color',
      media: '(prefers-color-scheme: dark)',
      content: '#09090b',
    },
    { name: 'keywords', content: siteConfig.keywords.join(',') },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:creator',
      content: '@emigdio821',
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: image,
    },
    // Open Graph
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:site_name',
      content: siteConfig.og.siteName,
    },
    {
      property: 'og:locale',
      content: siteConfig.og.locale,
    },
    {
      property: 'og:type',
      content: siteConfig.og.type,
    },
    {
      property: 'og:image',
      content: image,
    },
    // Robots
    ...(options?.noIndex
      ? [
          {
            name: 'robots',
            content: 'noindex, nofollow',
          },
        ]
      : []),
  ]
}

export function createSEOLinks() {
  return [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'icon',
      href: siteConfig.icons.i16.url,
      type: siteConfig.icons.i16.type,
      sizes: siteConfig.icons.i16.sizes,
    },
    {
      rel: 'icon',
      href: siteConfig.icons.i32.url,
      type: siteConfig.icons.i32.type,
      sizes: siteConfig.icons.i32.sizes,
    },
    {
      rel: 'icon',
      href: siteConfig.icons.i192.url,
      type: siteConfig.icons.i192.type,
      sizes: siteConfig.icons.i192.sizes,
    },
    {
      rel: 'icon',
      href: siteConfig.icons.i512.url,
      type: siteConfig.icons.i512.type,
      sizes: siteConfig.icons.i512.sizes,
    },
    {
      rel: 'apple-touch-icon',
      href: siteConfig.icons.apple,
    },
    {
      rel: 'shortcut icon',
      href: siteConfig.icons.shortcut,
    },
  ]
}
