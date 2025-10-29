import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ImageResponse } from '@vercel/og'
import { siteConfig } from '@/config/site'

async function loadFontData() {
  try {
    const fontPath = join(process.cwd(), 'public', 'fonts', 'Geist-Bold.ttf')
    const fontData = readFileSync(fontPath)
    return fontData.buffer
  } catch (error) {
    console.error('Failed to load font:', error)
    throw new Error('failed to load font data')
  }
}

export const Route = createFileRoute('/api/og-img')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const fontData = await loadFontData()
        const url = new URL(request.url)
        const title = url.searchParams.get('title')

        const html = React.createElement(
          'div',
          {
            style: {
              width: '100%',
              height: '100%',
              display: 'flex',
              color: '#ededed',
              textAlign: 'center',
              fontFamily: 'Figtree',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: '#09090b',
              backgroundImage: 'url("https://bkmke.vercel.app/images/og-bg.png")',
            },
          },
          React.createElement('img', {
            alt: 'bkmke',
            width: 120,
            height: 120,
            src: 'https://bkmke.vercel.app/images/favicon-192x192.png',
            style: { borderRadius: '100%', objectFit: 'cover' },
          }),
          React.createElement(
            'p',
            { style: { display: 'flex', alignItems: 'center', flexDirection: 'column' } },
            React.createElement('span', { style: { fontSize: 50 } }, siteConfig.name),
            React.createElement('span', { style: { fontSize: 30, opacity: 0.8 } }, 'Bookmark manager'),
            title && React.createElement('span', { style: { fontSize: 24, opacity: 0.8 } }, title),
          ),
        )

        return new ImageResponse(html, {
          width: 1000,
          height: 600,
          fonts: [
            {
              name: 'Figtree',
              data: fontData,
              style: 'normal',
            },
          ],
        })
      },
    },
  },
})
