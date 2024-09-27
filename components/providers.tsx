'use client'

import NiceModal from '@ebay/nice-modal-react'
import { IconAlertTriangle, IconCircleCheck, IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProgressBar } from 'next-nprogress-bar'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Spinner } from './spinner'

interface ProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <NiceModal.Provider>
            {children}
            <AppProgressBar height="2px" color="#6c6ea7" options={{ showSpinner: false }} shallowRouting />
            <Toaster
              expand
              icons={{
                error: <IconExclamationCircle className="size-4" />,
                warning: <IconAlertTriangle className="size-4" />,
                info: <IconInfoCircle className="size-4" />,
                success: <IconCircleCheck className="size-4" />,
                loading: <Spinner />,
              }}
            />
          </NiceModal.Provider>
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </NextThemesProvider>
  )
}
