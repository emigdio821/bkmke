import * as React from 'react'
import { IconEye, IconEyeOff, IconSearch } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface InputProps extends React.ComponentProps<'input'> {
  hasError?: boolean
}

function Input({ className, hasError, type, ...props }: InputProps) {
  const [typeState, setTypeState] = React.useState(type)

  const isPassword = type === 'password'
  const isSearch = type === 'search'
  const isFile = type === 'file'

  return (
    <div className="relative">
      <input
        type={isPassword ? typeState : type}
        className={cn(
          'border-input bg-background text-foreground placeholder:text-muted-foreground read-only:bg-muted flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-xs shadow-black/5 transition-shadow',
          'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px] focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          isSearch &&
            'ps-9 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          isFile &&
            'text-muted-foreground file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic',
          hasError && 'text-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
          isPassword && 'pe-9',
          className,
        )}
        {...props}
      />
      {isSearch && (
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <IconSearch size={16} strokeWidth={2} aria-hidden />
        </div>
      )}
      {isPassword && (
        <Button
          size="icon"
          type="button"
          variant="unstyled"
          aria-label={typeState === 'password' ? 'Show password' : 'Hide password'}
          onClick={() => setTypeState((prev) => (prev === 'password' ? 'text' : 'password'))}
          className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 h-full px-3 focus:z-10"
        >
          {typeState === 'password' ? <IconEye size={16} aria-hidden /> : <IconEyeOff size={16} aria-hidden />}
        </Button>
      )}
    </div>
  )
}

export { Input, type InputProps }
