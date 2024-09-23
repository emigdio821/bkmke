'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppearanceSettings() {
  const { setTheme, theme } = useTheme()

  return (
    <Card>
      <CardHeader className="justify-between gap-2 sm:flex-row">
        <div className="space-y-1.5">
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Change how the app looks and feels in your browser.</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="sm:size-9 sm:p-0">
              <IconMoon className="hidden size-4 dark:block" />
              <IconSun className="size-4 dark:hidden" />
              <span className="ml-2 sm:hidden">Toggle appearance</span>
              <span className="sr-only">Toggle app appearance</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={theme === 'system'}
              onClick={() => {
                setTheme('system')
              }}
            >
              System
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === 'light'}
              onClick={() => {
                setTheme('light')
              }}
            >
              Light
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={theme === 'dark'}
              onClick={() => {
                setTheme('dark')
              }}
            >
              Dark
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  )
}
