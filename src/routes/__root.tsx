/// <reference types="vite/client" />

import { devtools } from '@/integrations/tanstack-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
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

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: siteConfig.name },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootLayout,
})

function RootLayout() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className={cn('relative flex min-h-dvh flex-col antialiased')}>
        <Providers>
          <Outlet />
        </Providers>

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
