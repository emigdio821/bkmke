import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export function SidebarSkeleton() {
  return (
    <aside className="sticky top-0 hidden h-screen min-w-52 sm:block lg:min-w-60">
      <div className="relative flex h-full flex-col border-r">
        <span className="flex h-11 max-h-14 items-center p-4 pb-0">
          <Skeleton className="h-2 w-14" />
        </span>
        <nav className="h-full w-full overflow-y-auto p-4">
          <ul className="flex h-full flex-col items-start space-y-1">
            <li className="w-full">
              <Skeleton className="h-9 w-full" />
            </li>
            <li className="flex h-9 w-full items-center space-x-2 pl-4">
              <Skeleton className="size-4" />
              <Skeleton className="h-2 w-24" />
            </li>

            <li className="flex w-full grow flex-col justify-end gap-1 pt-10">
              <Skeleton className="h-9 w-full" />
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export function SettingsProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="my-1 h-2 w-14" />
        </CardTitle>
        <div>
          <Skeleton className="my-1.5 h-2 w-44" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between gap-2 sm:flex-row">
        <div className="flex items-center space-x-2">
          <Skeleton className="size-16" />
          <div>
            <Skeleton className="mb-2 h-2 w-32" />
            <Skeleton className="my-2 h-2 w-40" />
            <Skeleton className="mt-2 h-2 w-40" />
          </div>
        </div>
        <Skeleton className="h-9 w-[60px]" />
      </CardContent>
    </Card>
  )
}
