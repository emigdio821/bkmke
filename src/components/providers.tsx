import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Spinner } from './spinner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NuqsAdapter>
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
    </NuqsAdapter>
  )
}
