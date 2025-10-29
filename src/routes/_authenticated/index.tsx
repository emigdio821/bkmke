import { createFileRoute } from '@tanstack/react-router'
import { BookmarkPlusIcon, BugIcon, FileUpIcon, RotateCwIcon, WindIcon } from 'lucide-react'
import { createTitle } from '@/lib/seo'
import { useBookmarks } from '@/hooks/bookmarks/use-bookmarks'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export const Route = createFileRoute('/_authenticated/')({
  head: () => ({
    meta: [{ title: createTitle('Bookmarks') }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { data: bookmarks, isLoading, refetch, error } = useBookmarks()

  if (isLoading) return <Loader msg="Fetching your bookmarks" />

  if (error)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-4">
            <BugIcon className="size-6" />
          </CardTitle>
          <TypographyH4>Error</TypographyH4>
          <CardDescription>Unable to fetch bookmarks at this time, try again.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            <RotateCwIcon className="size-4" />
            Refetch
          </Button>
        </CardFooter>
      </Card>
    )

  return (
    <>
      {bookmarks &&
        (bookmarks.length > 0 ? (
          <DataTable columns={columns} data={bookmarks} refetch={refetch} />
        ) : (
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <CardTitle className="mb-4">
                <WindIcon className="size-6" />
              </CardTitle>
              <TypographyH4>Emtpy</TypographyH4>
              <CardDescription className="text-center">You have no bookmarks yet.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center gap-2">
              <CreateBookmarkDialog
                trigger={
                  <Button variant="outline">
                    <BookmarkPlusIcon className="size-4" />
                    Create
                  </Button>
                }
              />

              <ImportBookmarksDialog
                trigger={
                  <Button variant="outline">
                    <FileUpIcon className="size-4" />
                    Import
                  </Button>
                }
              />
            </CardFooter>
          </Card>
        ))}
    </>
  )
}
