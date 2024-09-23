'use client'

import { IconBrandGithub } from '@tabler/icons-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-center gap-2 p-4">
      <span className="flex h-5 items-center gap-2 text-sm">
        <span>{new Date().getFullYear()}</span>
        <Separator orientation="vertical" />
        <span className="font-semibold">{siteConfig.name}</span>
        <Separator orientation="vertical" />
        <Button asChild variant="link" className="text-foreground">
          <a href={siteConfig.links.github} target="_blank">
            Source
            <IconBrandGithub className="ml-2 size-4" />
          </a>
        </Button>
      </span>
    </footer>
  )
}
