import { cn } from '@/lib/utils'
import styles from '@/styles/spinner.module.css'

interface SpinnerProps {
  className?: string
  barsClassName?: string
}

export function Spinner({ className, barsClassName }: SpinnerProps) {
  return (
    <div className={cn('size-4', className)}>
      <div className="relative left-1/2 top-1/2 h-[inherit] w-[inherit]">
        {Array.from(Array(12).keys()).map((n) => (
          <div
            key={`spinner-bar-${n}`}
            className={cn(
              'absolute -left-[10%] -top-[3.9%] h-[8%] w-[24%] animate-spinner rounded-[6px] bg-current',
              styles['spinner-bar'],
              barsClassName,
            )}
          />
        ))}
      </div>
    </div>
  )
}
