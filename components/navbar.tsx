import Link from 'next/link'
import { MenuIcon } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { NavContent } from './navigation/nav-content'
import { Heading } from './ui/typography'

export function Navbar() {
  return (
    <header className="bg-background sticky top-0 z-10 block w-full lg:hidden">
      <div className="flex h-14 items-center border-b px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger className="lg:hidden" asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-full flex-col justify-between gap-0 px-0 py-4 sm:w-72">
              <DialogTitle className="sr-only">Navigation menu</DialogTitle>
              <NavContent />
            </DialogContent>
          </Dialog>

          <Link href="/" className="truncate font-semibold">
            <Heading>{siteConfig.name}</Heading>
          </Link>
        </div>
      </div>
    </header>
  )
}
