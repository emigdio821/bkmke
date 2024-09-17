'use client'

import { useEffect, useState } from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'

export function AppearanceSettings() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, theme } = useTheme()

  function getThemeIcon() {
    switch (theme) {
      case 'system':
        return <MonitorIcon className="size-4" />
      case 'dark':
        return <MoonIcon className="size-4" />
      case 'light':
        return <SunIcon className="size-4" />
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card>
      <CardHeader className="justify-between gap-2 sm:flex-row">
        <div className="space-y-1.5">
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Change how the app looks and feels in your browser.</CardDescription>
        </div>

        {mounted ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                {getThemeIcon()}
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
        ) : (
          <Skeleton className="size-9" />
        )}
      </CardHeader>
    </Card>
  )
}
