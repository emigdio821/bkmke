'use client'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { ThemeToggler } from '@/components/theme-toggler'

export function Footer({ noPadding = false }: { noPadding?: boolean }) {
  return (
    <footer
      className={cn('mt-auto flex items-center justify-center gap-2 p-4', {
        // 'ml-0': noPadding,
        // 'sm:ml-64 lg:ml-72': !noPadding,
      })}
    >
      <span className="flex h-5 items-center gap-2 text-sm">
        <span>{new Date().getFullYear()}</span>
        <Separator orientation="vertical" />
        <span className="font-semibold">{siteConfig.name}</span>
        <Separator orientation="vertical" />
        <ThemeToggler />
      </span>
    </footer>
  )
}
