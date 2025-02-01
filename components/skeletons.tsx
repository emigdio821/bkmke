import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export function SettingsProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="my-2 h-2 w-14" />
        </CardTitle>
        <div>
          <Skeleton className="my-1.5 h-2 w-44" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between gap-2 sm:flex-row">
        <div className="flex items-center space-x-2">
          <Skeleton className="size-16 rounded-full" />
          <div>
            <Skeleton className="mb-2 h-2 w-32" />
            <Skeleton className="my-2 h-2 w-40" />
            <Skeleton className="mt-2 h-2 w-40" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-[60px]" />
      </CardFooter>
    </Card>
  )
}

export function NavItemsSkeleton() {
  return (
    <div className="flex h-9 w-full items-center justify-between">
      <div className="flex items-center">
        <Skeleton className="mr-2 size-4" />
        <Skeleton className="h-2 w-16" />
      </div>
      <Skeleton className="size-4" />
    </div>
  )
}
