import type { NextRequest } from 'next/server'
import type { OGInfo } from '@/types'
import ogs from 'open-graph-scraper'
import { originURL } from '@/lib/utils'

interface FaviconStatus {
  ok: boolean
  url: string
}

function getFaviconFromGoogle(url: string) {
  return `https://www.google.com/s2/favicons?domain=${url}&sz=128`
}

function normalizeFaviconUrl(url: string) {
  try {
    const newUrl = new URL(url)
    return { ok: true, url: newUrl.href }
  } catch {
    return { ok: false, url: url.startsWith('/') ? url.slice(1) : url }
  }
}

async function fetchOgData(url: string) {
  const { error, result } = await ogs({ url })

  if (error) throw new Error('Failed to get URL info')

  const origin = originURL(url)
  const faviconStatus = normalizeFaviconUrl(result.favicon || '')

  const faviconUrl = constructFavicon(faviconStatus, origin, url)
  const imageUrl = result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || ''

  return {
    imageUrl,
    faviconUrl,
    title: result.ogTitle || '',
    description: result.ogDescription || '',
  } satisfies OGInfo
}

function constructFavicon(faviconStatus: FaviconStatus, origin: string | null, url: string) {
  if (faviconStatus.ok) {
    return faviconStatus.url
  }

  if (origin) {
    const hostname = new URL(origin).hostname
    return `${origin}/${faviconStatus.url.replace(hostname, '')}`
  }

  return getFaviconFromGoogle(url)
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) return Response.json({ error: 'Missing URL param' }, { status: 400 })

  const encodedUrl = encodeURI(url)

  try {
    const response = await fetchOgData(encodedUrl)
    return Response.json(response, { status: 200 })
  } catch {
    const imageUrl = getFaviconFromGoogle(encodedUrl)
    const response: OGInfo = {
      imageUrl: '',
      title: url,
      description: '',
      faviconUrl: imageUrl,
    }

    return Response.json(response, { status: 200 })
  }
}
