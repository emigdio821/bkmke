import { Skeleton } from './ui/skeleton'

export function SidebarSkeleton() {
  return (
    <aside className="hidden h-screen min-w-52 sm:block lg:min-w-60">
      <div className="relative flex h-full flex-col border-r">
        <span className="flex h-11 max-h-14 items-center p-4 pb-0">
          <Skeleton className="h-2 w-14" />
        </span>
        <nav className="h-full w-full overflow-y-auto p-4">
          <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 sm:min-h-[calc(100vh-32px-40px-32px)]">
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
