import { clsx, type ClassValue } from 'clsx'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractUrlDomain(url: string) {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

export async function handleCopyToClipboard(text: string, message?: string) {
  const promise = navigator.clipboard.writeText(text)
  toast.promise(promise, {
    success: message || 'Text copied to your clipboard',
    error: (err) => {
      console.log('Copy to clipboard error', err)
      return 'Unable to copy to your clipboard at this time, try again'
    },
  })
}
