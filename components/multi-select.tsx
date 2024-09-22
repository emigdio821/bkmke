import { useState } from 'react'
import { IconCheck, IconCirclePlus } from '@tabler/icons-react'
import type { Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  value?: string[]
  options: Array<{
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  onChange?: (values: string[]) => void
}

export function MultiSelect<TData, TValue>({
  title,
  options,
  onChange,
  value,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const [selectedValues, setSelectedValues] = useState<string[]>(value || [])

  function updateSelectedValues(newValues: string[]) {
    setSelectedValues(newValues)
    if (onChange) {
      onChange(newValues)
    }
  }

  function handleSelect(value: string) {
    const isSelected = selectedValues.includes(value)
    const newValues = isSelected ? selectedValues.filter((val) => val !== value) : [...selectedValues, value]
    updateSelectedValues(newValues)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="border-dashed">
          <IconCirclePlus className="mr-2 size-4" />
          {title}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm">
                {selectedValues.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className="max-h-full overflow-hidden">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleSelect(option.value)
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex size-4 items-center justify-center rounded-[4px] border',
                        isSelected ? 'bg-primary text-primary-foreground' : '[&_svg]:invisible',
                      )}
                    >
                      <IconCheck className="size-4" />
                    </div>
                    {option.icon && <option.icon className="mr-2 size-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {selectedValues.length > 0 ? (
                <CommandItem
                  onSelect={() => {
                    updateSelectedValues([])
                  }}
                  className="justify-center text-center"
                >
                  Clear selected
                </CommandItem>
              ) : (
                <CommandItem
                  onSelect={() => {
                    const allValues = options.map((option) => option.value)
                    updateSelectedValues(allValues)
                  }}
                  className="justify-center text-center"
                >
                  Select all
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
