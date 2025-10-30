/** biome-ignore-all lint/performance/noImgElement: Next.js does not support Image component here */

import type { NextRequest } from 'next/server'
import { ImageResponse } from 'next/og'
import { siteConfig } from '@/config/site'

export const runtime = 'edge'

const fontReq = fetch(new URL('../../../public/fonts/Geist-Bold.ttf', import.meta.url)).then(
  async (res) => await res.arrayBuffer(),
)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title')

  try {
    const fontData = await fontReq

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            color: '#ededed',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            fontFamily: 'Geist Bold, sans-serif',
            backgroundImage: 'url("https://bkmke.vercel.app/images/og-bg.png")',
          }}
        >
          <img
            alt="bkmke"
            width={120}
            height={120}
            src="https://bkmke.vercel.app/images/favicon-192x192.png"
            style={{
              borderRadius: '100%',
              objectFit: 'cover',
            }}
          />
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: 50,
              }}
            >
              {siteConfig.name}
            </span>
            <span
              style={{
                fontSize: 30,
                opacity: 0.8,
              }}
            >
              Bookmark manager
            </span>
            {title && (
              <span
                style={{
                  fontSize: 24,
                  opacity: 0.8,
                }}
              >
                {title}
              </span>
            )}
          </p>
        </div>
      ),
      {
        width: 1000,
        height: 600,
        fonts: [
          {
            name: 'Geist Bold',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    )
  } catch (e) {
    const errorMsg = 'Failed to generate OG image'
    console.error(errorMsg, e)
    return new Response(errorMsg, {
      status: 500,
    })
  }
}
