'use client'

import { IconInfoCircle } from '@tabler/icons-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from './ui/button'

export function DemoPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="plain">
          <IconInfoCircle size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="text-sm">
        <p className="leading-none font-medium tracking-tight">Demo credentials</p>
        <div className="text-muted-foreground mt-2 text-xs">
          <p>email: demo@bkmke.com</p>
          <p>password: demo</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
