import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavItemContentProps {
  href?: string
  active: boolean
  children: React.ReactNode
}

export function NavItemContent({ children, active, href }: NavItemContentProps) {
  return (
    <Button
      variant="ghost"
      asChild={!!href}
      className={cn('block flex-auto overflow-hidden', {
        'bg-accent font-semibold': active,
      })}
    >
      {href ? <Link href={href}>{children}</Link> : children}
    </Button>
  )
}
