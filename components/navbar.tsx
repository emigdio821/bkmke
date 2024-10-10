import { IconMenu } from '@tabler/icons-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { NavContent } from './navigation/nav-content'
import { TypographyH4 } from './ui/typography'

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 block w-full bg-background md:hidden">
      <div className="flex h-14 items-center border-b px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger className="md:hidden" asChild>
              <Button className="h-8" variant="outline" size="icon">
                <IconMenu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex h-full max-w-72 flex-col justify-between p-0 sm:w-72">
              <SheetHeader>
                <SheetTitle asChild className="p-4 pb-0 text-left">
                  <TypographyH4>{siteConfig.name}</TypographyH4>
                </SheetTitle>
              </SheetHeader>
              <NavContent />
            </SheetContent>
          </Sheet>
          <TypographyH4>{siteConfig.name}</TypographyH4>
        </div>
      </div>
    </header>
  )
}
