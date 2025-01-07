import { useCallback, useState } from 'react'

export function useDebounceFn<T extends (...args: never[]) => void>(fn: T, delay = 300) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timer) {
        clearTimeout(timer)
      }

      const newTimer = setTimeout(() => {
        fn(...args)
      }, delay)

      setTimer(newTimer)
    },
    [fn, delay, timer],
  )

  return debouncedFn
}
