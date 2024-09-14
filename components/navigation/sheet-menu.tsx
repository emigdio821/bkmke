import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon, ShoppingBasketIcon } from 'lucide-react'
import { Menu } from './menu'

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="sm:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        aria-describedby={undefined}
        className="p-0 h-full flex flex-col justify-between max-w-72 sm:w-72"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center p-4 pb-0 max-h-14 sm:p-6 sm:pb-0">
            <ShoppingBasketIcon className="size-6 hidden" />
            <h1 className="font-bold text-2xl flex-nowrap ml-2">Título</h1>
          </SheetTitle>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}
