import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SettingsProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="my-1.5 h-2 w-14" />
        </CardTitle>
        <div>
          <Skeleton className="my-1 h-2 w-44" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-between gap-2 sm:flex-row">
        <div className="flex items-center space-x-2">
          <Skeleton className="size-16 rounded-lg" />
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
