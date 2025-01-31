import Link from 'next/link'
import { IconMenu } from '@tabler/icons-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavContent } from './navigation/nav-content'
import { TypographyH4 } from './ui/typography'

export function Navbar() {
  return (
    <header className="bg-background sticky top-0 z-10 block w-full md:hidden">
      <div className="flex h-14 items-center border-b px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <IconMenu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex h-full max-w-72 flex-col justify-between p-0 sm:w-72">
              <NavContent />
            </SheetContent>
          </Sheet>

          <Link href="/" className="truncate font-semibold">
            <TypographyH4>{siteConfig.name}</TypographyH4>
          </Link>
        </div>
      </div>
    </header>
  )
}
