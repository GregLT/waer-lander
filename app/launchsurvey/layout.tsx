import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WAER — Got two minutes?',
  description: "We're building WAER with the people who use it. Tell us what you honestly think. No right answers, and a few words is plenty.",
  openGraph: {
    title: 'WAER — Got two minutes?',
    description: "We're building WAER with the people who use it. Tell us what you honestly think. No right answers, and a few words is plenty.",
    images: [{ url: '/assets/og-image.png' }],
  },
}

export default function LaunchSurveyLayout({ children }: { children: React.ReactNode }) {
  return children
}
