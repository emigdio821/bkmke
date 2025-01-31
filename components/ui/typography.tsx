import { cn } from '@/lib/utils'

function Heading({ className, ...props }: React.ComponentProps<'h4'>) {
  return (
    <h4
      slot="title"
      className={cn('text-base leading-none font-semibold tracking-tight sm:text-lg', className)}
      {...props}
    />
  )
}

function InlineCode({ className, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      className={cn('bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
      {...props}
    />
  )
}
export { Heading, InlineCode }
