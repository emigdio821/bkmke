import * as React from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <div className="relative">
      <Input className="pr-9" type={isVisible ? 'text' : 'password'} ref={ref} {...props} />
      <button
        type="button"
        aria-controls="password"
        aria-pressed={isVisible}
        onClick={toggleVisibility}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className={cn(
          'absolute inset-y-px right-px flex h-full w-9 items-center justify-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:border focus-visible:border-input focus-visible:text-foreground focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        {isVisible ? (
          <IconEyeOff size={16} aria-hidden="true" role="presentation" />
        ) : (
          <IconEye size={16} aria-hidden="true" role="presentation" />
        )}
      </button>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input, PasswordInput }
