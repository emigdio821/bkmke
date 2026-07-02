import type { ErrorComponentProps } from '@tanstack/react-router'
import { BugIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export function DefaultErrorBoundary({ error }: ErrorComponentProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BugIcon />
        </EmptyMedia>
        <EmptyTitle>Error</EmptyTitle>
        <EmptyDescription>
          <code className="block max-h-96 w-full overflow-auto rounded-md bg-muted p-2 font-mono text-xs wrap-break-word">
            {error.message}
          </code>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </EmptyContent>
    </Empty>
  )
}
