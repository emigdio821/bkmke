import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
}

export function TypographyH3({ children }: TypographyProps) {
  return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>
}

export function TypographyH4({ children }: TypographyProps) {
  return <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>
}

export function TypographyInlineCode({ children, className }: TypographyProps & { className?: string }) {
  return (
    <code
      className={cn('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
    >
      {children}
    </code>
  )
}
