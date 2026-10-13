import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WAER — Got two minutes?',
  description: "Fine fragrance, made to switch. Discover 10ml scents created by master perfumers, designed to layer, rotate and wear your way in a reusable travel case.",
  openGraph: {
    title: 'WAER — Got two minutes?',
    description: "Fine fragrance, made to switch. Discover 10ml scents created by master perfumers, designed to layer, rotate and wear your way in a reusable travel case.",
    images: [{ url: '/assets/og-image.png' }],
  },
}

export default function LaunchSurveyLayout({ children }: { children: React.ReactNode }) {
  return children
}
