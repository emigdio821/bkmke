import Link from 'next/link'
import { IconMenu } from '@tabler/icons-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { NavContent } from './navigation/nav-content'
import { Heading } from './ui/typography'

export function Navbar() {
  return (
    <header className="bg-background sticky top-0 z-10 block w-full lg:hidden">
      <div className="flex h-14 items-center border-b px-4 lg:px-6">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
              <Button variant="outline" size="icon">
                <IconMenu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-subtle flex h-full w-5/6 flex-col justify-between gap-0 px-0 py-4 sm:w-72"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <NavContent />
            </SheetContent>
          </Sheet>

          <Link href="/" className="truncate font-semibold">
            <Heading>{siteConfig.name}</Heading>
          </Link>
        </div>
      </div>
    </header>
  )
}
