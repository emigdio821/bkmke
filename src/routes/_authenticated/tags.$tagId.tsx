import { useEffect } from 'react'
import { getTagDetails } from '@/server-functions/get-tag-details'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookmarkIcon, BookmarkPlusIcon, BugIcon, FileUpIcon, RotateCwIcon, WindIcon } from 'lucide-react'
import { useHeaderTitleStore } from '@/lib/stores/header-title'
import { useTagItems } from '@/hooks/tags/use-tag-items'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TypographyH4 } from '@/components/ui/typography'
import { columns } from '@/components/bookmarks/columns'
import { DataTable } from '@/components/bookmarks/data-table'
import { CreateBookmarkDialog } from '@/components/dialogs/bookmarks/create'
import { ImportBookmarksDialog } from '@/components/dialogs/bookmarks/import'
import { Loader } from '@/components/loader'

export const Route = createFileRoute('/_authenticated/tags/$tagId')({
  loader: async ({ params }) => {
    const { tagId } = params
    const tagDetails = await getTagDetails({
      data: { tagId },
    })

    return tagDetails
  },
  component: RouteComponent,
  pendingComponent: () => <Loader msg="Fetching tag details" />,
})

function RouteComponent() {
  const { tagId } = Route.useParams()
  const tagDetails = Route.useLoaderData()
  const { data: tagItems, isLoading, refetch, error } = useTagItems(tagId)
  const setLoadingTitle = useHeaderTitleStore((state) => state.setLoadingTitle)
  const updateHeaderTitle = useHeaderTitleStore((state) => state.updateTitle)

  useEffect(() => {
    if (tagDetails) {
      updateHeaderTitle(tagDetails[0]?.name || 'Tag items')
      setLoadingTitle(false)
    }
  }, [tagDetails, updateHeaderTitle, setLoadingTitle])

  if (error)
    return (
      <Card>
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="mb-2">
            <BugIcon className="size-6" />
          </CardTitle>
          <TypographyH4>Error</TypographyH4>
          <CardDescription className="text-center">
            Unable to fetch this tag at this time, try again or check if the tag still exists.
          </CardDescription>
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
      {isLoading ? (
        <Loader msg="Fetching tag bookmarks" />
      ) : (
        tagItems &&
        (tagItems.length > 0 ? (
          <DataTable columns={columns} data={tagItems} refetch={refetch} />
        ) : (
          <Card>
            <CardHeader className="flex flex-col items-center justify-center gap-2">
              <CardTitle className="mb-2">
                <WindIcon className="size-6" />
              </CardTitle>
              <TypographyH4>Emtpy</TypographyH4>
              <CardDescription className="text-center">This tag does not contain items yet.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/">
                  <BookmarkIcon className="size-4" />
                  Bookmarks
                </Link>
              </Button>

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
        ))
      )}
    </>
  )
}
