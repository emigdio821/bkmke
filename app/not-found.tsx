import Link from 'next/link'
import type { Metadata } from 'next/types'
import { IconGhost3 } from '@tabler/icons-react'
import { siteConfig } from '@/config/site'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: {
    default: 'Not found',
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: 'Emigdio Torres',
      url: siteConfig.url,
    },
  ],
  creator: 'Emigdio Torres',
  icons: siteConfig.icons,
  openGraph: siteConfig.og,
  metadataBase: new URL(siteConfig.url),
  twitter: siteConfig.ogTwitter,
}

export default function NotFound() {
  return (
    <>
      <section className="p-4">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center text-4xl font-extrabold">
              <IconGhost3 size={32} className="text-muted-foreground mx-auto mb-2" />
              404
            </CardTitle>
            <CardContent className="text-center text-sm">This page does not exist.</CardContent>
            <CardFooter className="items-center justify-center">
              <Button asChild>
                <Link href="/">Back to home</Link>
              </Button>
            </CardFooter>
          </CardHeader>
        </Card>
      </section>
      <Footer />
    </>
  )
}
