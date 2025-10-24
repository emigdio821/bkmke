import { useState } from 'react'
import type { Column } from '@tanstack/react-table'
import { CheckCheckIcon, CheckIcon, ChevronDownIcon, EraserIcon } from 'lucide-react'
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

interface DataTableFacetedFilterProps<TData, TValue> {
  id?: string
  name?: string
  column?: Column<TData, TValue>
  placeholder?: string
  value?: string[]
  emptyText?: string
  options: Array<{
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  onChange?: (values: string[]) => void
}

export function MultiSelect<TData, TValue>(props: DataTableFacetedFilterProps<TData, TValue>) {
  const { placeholder, options, onChange, value, emptyText, id, name } = props
  const [selectedValues, setSelectedValues] = useState<string[]>(value || [])
  const isAllSelected = options.length === selectedValues.length

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
        <Button
          id={id}
          name={name}
          type="button"
          variant="outline"
          disabled={options.length === 0}
          className="hover:bg-background data-[state=open]:bg-background data-[state=open]:dark:bg-input/30 w-full justify-start gap-0.5 px-3 font-normal"
        >
          {options.length === 0 ? (
            <span className="text-muted-foreground">{emptyText || 'Empty data'}</span>
          ) : (
            <>
              {selectedValues.length > 0 ? 'Selected' : <span className="text-muted-foreground">{placeholder}</span>}
              {selectedValues.length > 0 && (
                <>
                  <div className="bg-border mx-2 h-4 w-px" />
                  <Badge variant="outline">{selectedValues.length}</Badge>
                </>
              )}
            </>
          )}

          <ChevronDownIcon className="text-muted-foreground ml-auto size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandInput placeholder="Seach" />
          <CommandList className="max-h-full overflow-hidden">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value)
                return (
                  <CommandItem key={option.value} onSelect={() => handleSelect(option.value)}>
                    <div
                      className={cn(
                        'border-input flex size-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary text-primary-foreground' : '[&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className="text-primary-foreground size-3.5" />
                    </div>
                    {option.icon && <option.icon className="text-muted-foreground mr-2 size-4" />}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {selectedValues.length > 0 && !isAllSelected && (
                <CommandItem
                  onSelect={() => {
                    updateSelectedValues([])
                  }}
                >
                  <EraserIcon className="size-4" />
                  Diselect selection
                </CommandItem>
              )}

              <CommandItem
                onSelect={() => {
                  if (isAllSelected) {
                    updateSelectedValues([])
                  } else {
                    const allValues = options.map((option) => option.value)
                    updateSelectedValues(allValues)
                  }
                }}
              >
                {isAllSelected ? <EraserIcon className="size-4" /> : <CheckCheckIcon className="size-4" />}
                {isAllSelected ? 'Diselect all' : 'Select all'}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
