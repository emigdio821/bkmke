import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { siteConfig } from '@/config/site'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function simplifiedURL(url: string) {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export function originURL(url: string) {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.origin
  } catch {
    return null
  }
}

export async function handleCopyToClipboard(text: string, message?: string) {
  try {
    const promise = navigator.clipboard.writeText(text)
    toast.promise(promise, {
      success: message || 'Text copied to your clipboard',
      error: (err) => {
        console.log('Copy to clipboard error', err)
        return 'Unable to copy to your clipboard at this time, try again'
      },
    })
  } catch {
    toast.error('Error', { description: 'Unable to copy to your clipboard, try again.' })
  }
}

export function formatDateFromString(str: string) {
  const date = new Date(str)

  const formattedDate = date.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return formattedDate
}

export function urlWithUTMSource(url: string) {
  try {
    const formattedUrl = new URL(url)
    formattedUrl.searchParams.append('utm_source', siteConfig.url)
    return formattedUrl.toString()
  } catch {
    return ''
  }
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {},
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? accurateSizes[i] || 'Bytest' : sizes[i] || 'Bytes'
  }`
}

export function debounce<T extends (...args: never[]) => unknown>(fn: T, delay = 300) {
  let timeoutId: NodeJS.Timeout | null = null

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
