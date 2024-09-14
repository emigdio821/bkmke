'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function ThemeToggler() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className="h-6 w-6"
          aria-label="Toggle theme"
          onClick={() => {
            setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
          }}
        >
          <SunIcon className="hidden size-3.5 dark:block" />
          <MoonIcon className="block size-3.5 dark:hidden" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Toggle theme</span>
      </TooltipContent>
    </Tooltip>
  )
}
