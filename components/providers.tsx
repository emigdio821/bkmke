'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { Spinner } from './spinner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
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
    </NextThemesProvider>
  )
}
