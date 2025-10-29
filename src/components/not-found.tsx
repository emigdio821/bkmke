import { Link } from '@tanstack/react-router'
import { GhostIcon, RotateCwIcon } from 'lucide-react'
import { createTitle } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <>
      <title>{createTitle('Not found')}</title>
      <section className="p-4">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-4xl font-extrabold">
              <GhostIcon className="text-muted-foreground mx-auto mb-2 size-8" />
              404
            </CardTitle>
            <CardDescription className="text-center">This page does not exist.</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button className="grow" asChild>
              <Link to="/">
                <RotateCwIcon className="size-4" />
                Start over
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
      <Footer />
    </>
  )
}
