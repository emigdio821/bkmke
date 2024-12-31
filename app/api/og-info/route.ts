import type { NextRequest } from 'next/server'
import type { OGInfo } from '@/types'
import ogs from 'open-graph-scraper'
import { MAX_DESC_LENGTH, MAX_NAME_LENGTH } from '@/lib/constants'
import { truncateString } from '@/lib/utils'

function getFaviconFromGoogle(url: string) {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=128`
}

function handleTruncateString(text: string, maxLength: number): string {
  return text.length > maxLength ? truncateString(text, maxLength - 3) : text
}

async function fetchOgData(url: string) {
  const { error, result } = await ogs({ url })

  if (error) throw new Error('Failed to get URL info')

  const { ogImage, twitterImage, ogTitle, ogDescription } = result

  const imageUrl = ogImage?.[0]?.url || twitterImage?.[0]?.url || ''
  const title = ogTitle ? handleTruncateString(ogTitle.trim(), MAX_NAME_LENGTH) : ''
  const description = ogDescription ? handleTruncateString(ogDescription.trim(), MAX_DESC_LENGTH) : ''

  return {
    imageUrl,
    faviconUrl: getFaviconFromGoogle(url),
    title,
    description,
  } satisfies OGInfo
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) return Response.json({ error: 'Missing URL param' }, { status: 400 })

  const encodedUrl = encodeURI(url)

  try {
    const response = await fetchOgData(encodedUrl)
    return Response.json(response, { status: 200 })
  } catch {
    const faviconUrl = getFaviconFromGoogle(encodedUrl)
    const response: OGInfo = {
      imageUrl: '',
      title: url,
      description: '',
      faviconUrl,
    }

    return Response.json(response, { status: 200 })
  }
}
