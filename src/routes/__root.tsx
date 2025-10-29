/// <reference types="vite/client" />

import { devtools } from '@/integrations/tanstack-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { createSEOLinks, createSEOMeta } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import appCss from '@/styles/app.css?url'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: createSEOMeta(),
    links: [
      ...createSEOLinks(),
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
