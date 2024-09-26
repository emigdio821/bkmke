import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { siteConfig } from '@/config/site'

export const runtime = 'edge'

const fontReq = fetch(new URL('../../../public/fonts/Figtree-Bold.ttf', import.meta.url)).then(
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
            gap: '20px',
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
          }}
        >
          <img
            alt="em"
            width={240}
            height={240}
            src="https://bkmke.vercel.app/images/android-chrome-512x512.png"
            style={{
              borderRadius: 128,
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
                fontSize: 54,
              }}
            >
              {siteConfig.name}
            </span>
            {title && (
              <span
                style={{
                  fontSize: 34,
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
            name: 'Figtree',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    )
  } catch (e) {
    console.log(e)
    return new Response('Failed to generate the image', {
      status: 500,
    })
  }
}
