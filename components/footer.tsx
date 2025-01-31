'use client'

import { IconBrandGithub } from '@tabler/icons-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-center gap-2 p-4">
      <span className="flex h-5 items-center gap-2 text-sm">
        <span>{new Date().getFullYear()}</span>
        <div className="bg-border h-4 w-px" />
        <span className="font-semibold">{siteConfig.name}</span>
        <div className="bg-border h-4 w-px" />
        <Button asChild variant="link" className="text-foreground">
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
            Source
            <IconBrandGithub className="ml-2 size-4" />
          </a>
        </Button>
      </span>
    </footer>
  )
}
