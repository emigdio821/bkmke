const FONT_URL = 'https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap'

export function createFontLinks() {
  return [
    // Preconnect to Google Fonts
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous' as const,
    },
    // Preload font
    {
      rel: 'preload',
      as: 'style',
      href: FONT_URL,
    },
    {
      rel: 'stylesheet',
      href: FONT_URL,
    },
  ]
}
