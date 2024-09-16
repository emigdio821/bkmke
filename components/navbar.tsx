import { MenuIcon } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from './navigation/menu'
import { TypographyH4 } from './ui/typography'

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 block w-full bg-background sm:hidden">
      <div className="flex h-14 items-center border-b px-4 sm:px-6">
        <div className="flex items-center space-x-4 sm:space-x-0">
          <Sheet>
            <SheetTrigger className="sm:hidden" asChild>
              <Button className="h-8" variant="outline" size="icon">
                <MenuIcon size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex h-full max-w-72 flex-col justify-between p-0 sm:w-72"
            >
              <SheetHeader>
                <SheetTitle asChild className="p-4 pb-0 text-left sm:p-6 sm:pb-0">
                  <TypographyH4>{siteConfig.name}</TypographyH4>
                </SheetTitle>
              </SheetHeader>
              <Menu />
            </SheetContent>
          </Sheet>
          <TypographyH4>{siteConfig.name}</TypographyH4>
        </div>
      </div>
    </header>
  )
}
