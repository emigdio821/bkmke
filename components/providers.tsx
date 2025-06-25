'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Spinner } from './spinner'

interface ProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          {children}
          <Toaster
            expand
            icons={{
              error: <CircleAlertIcon className="size-4" />,
              warning: <TriangleAlertIcon className="size-4" />,
              info: <InfoIcon className="size-4" />,
              success: <CircleCheckIcon className="size-4" />,
              loading: <Spinner />,
            }}
          />
        </TooltipProvider>
        <ReactQueryDevtools buttonPosition="top-right" />
      </QueryClientProvider>
    </NextThemesProvider>
  )
}
