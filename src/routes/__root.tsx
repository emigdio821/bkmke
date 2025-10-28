/// <reference types="vite/client" />

import { devtools } from '@/integrations/tanstack-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import appCss from '@/styles/app.css?url'

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s · ${siteConfig.name}`,
//   },
//   keywords: siteConfig.keywords,
//   description: siteConfig.description,
//   creator: 'Emigdio Torres',
//   icons: siteConfig.icons,
//   openGraph: siteConfig.og,
//   metadataBase: new URL(siteConfig.url),
//   twitter: siteConfig.ogTwitter,
// }

// export const viewport: Viewport = {
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: '#ffffff' },
//     { media: '(prefers-color-scheme: dark)', color: '#09090b' },
//   ],
//   initialScale: 1,
//   maximumScale: 1,
//   viewportFit: 'cover',
//   width: 'device-width',
// }

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'TanStack Start Starter' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className={cn('relative flex min-h-dvh flex-col antialiased')}>
        <Outlet />

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={devtools}
        />
        <Scripts />
      </body>
    </html>
  )
}
