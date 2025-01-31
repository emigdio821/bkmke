import { cn } from '@/lib/utils'

export type InputProps = React.ComponentProps<'input'> & { hasError?: boolean }

function Input({ className, type, hasError, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/20 flex h-9 w-full rounded-lg border px-3 py-2 text-sm transition-shadow focus-visible:ring-[3px] focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
        type === 'search' &&
          '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
        type === 'file' &&
          'text-muted-foreground/70 file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic',
        hasError &&
          'border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
