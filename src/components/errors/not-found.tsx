import { Link } from '@tanstack/react-router'
import { GhostIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GhostIcon />
        </EmptyMedia>
        <EmptyTitle className="text-4xl font-extrabold">404</EmptyTitle>
        <EmptyDescription>
          The page you're looking for doesn't exist. It may have been removed or the URL may be incorrect.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button nativeButton={false} render={<Link to="/">Home</Link>} />
      </EmptyContent>
    </Empty>
  )
}
