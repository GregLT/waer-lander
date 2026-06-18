import Image from 'next/image'
import WaitlistForm from './WaitlistForm'
import { config } from '@/lib/config'

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-cta">
        <h3>{config.footerLine}</h3>
        <div className="footer-sign">
          <WaitlistForm variant="footer" submitLabel={config.ctaLabel} successLabel="You're on the waitlist!" />
        </div>
      </div>

      <div className="footer-wm">
        <Image
          src="/assets/WAER_Wordmark_White.png"
          alt="WAER"
          width={3000}
          height={734}
          style={{ width: '100%', maxWidth: 1100, height: 'auto' }}
        />
      </div>

      <div className="footer-fine-bar">
        <span>© WAER 2026 — Made in France</span>
        <span>K.01 → K.14</span>
      </div>
    </footer>
  )
}
