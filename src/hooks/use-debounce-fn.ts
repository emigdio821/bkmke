import { useCallback, useRef } from 'react'

export function useDebounceFn<T extends (...args: never[]) => void>(fn: T, delay = 300) {
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => fn(...args), delay)
    },
    [fn, delay],
  )

  return debouncedFn
}
