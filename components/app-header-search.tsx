import { SearchIcon } from 'lucide-react'
import { useGlobalSearch } from '@/hooks/use-global-search'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export function AppHeaderSearch() {
  const isMobile = useIsMobile(640)
  const [search, setSearch] = useGlobalSearch()

  return (
    <>
      <InputGroup className="hidden w-full max-w-xs min-w-52 sm:flex">
        <InputGroupInput
          value={search}
          placeholder="Search"
          name="global-search"
          onChange={(event) => setSearch(event.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {isMobile && (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" type="button" variant="outline">
              <SearchIcon className="size-4" />
              <span className="sr-only">Toggle search</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent sideOffset={16} className="w-full max-w-xs">
            <Input
              value={search}
              placeholder="Search"
              name="global-search-mobile"
              onChange={(event) => setSearch(event.target.value)}
            />
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}
