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
    toast.error('Error', { description: 'Unable to copy to your clipboard, try again' })
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
  const formattedUrl = new URL(url)
  formattedUrl.searchParams.append('utm_source', siteConfig.url)

  return formattedUrl.toString()
}
