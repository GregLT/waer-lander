import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const f37Ginger = localFont({
  src: './fonts/F37Ginger-Regular.otf',
  variable: '--font-display',
  weight: '400 700',
  display: 'swap',
})

const toLeaf = localFont({
  src: './fonts/ToLeaf-Regular.otf',
  variable: '--font-body',
  weight: '300 600',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WAER — Join the wardrobe',
  description:
    "Fourteen scents. One considered rotation. Join the WAER founding waitlist for A/W '26.",
  icons: { icon: '/assets/favicon-grey-black.png' },
  openGraph: {
    title: 'WAER — Join the wardrobe',
    description:
      "Your morning isn't your evening. Your Tuesday isn't your Saturday. Doors open A/W '26.",
    images: [{ url: '/assets/og-image.png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${f37Ginger.variable} ${toLeaf.variable}`}>
      <body>{children}</body>
    </html>
  )
}
