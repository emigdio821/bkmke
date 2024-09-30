import type { NextRequest } from 'next/server'
import type { OGInfo } from '@/types'
import ogs from 'open-graph-scraper'

function getFaviconFromGoogle(url: string) {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=128`
}

async function fetchOgData(url: string) {
  const { error, result } = await ogs({ url })

  if (error) throw new Error('Failed to get URL info')

  const faviconUrl = getFaviconFromGoogle(url)
  const imageUrl = result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || ''

  return {
    imageUrl,
    faviconUrl,
    title: result.ogTitle || '',
    description: result.ogDescription || '',
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
