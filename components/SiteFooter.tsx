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

      <div className="footer-fine-bar">
        <Image
          src="/assets/WAER_Wordmark_White.png"
          alt="WAER"
          width={3000}
          height={734}
          style={{ height: 11, width: 'auto', opacity: 0.55 }}
        />
        <span className="footer-fine-center">© WAER 2026 — Made in France</span>
        <span style={{ whiteSpace: 'nowrap' }}>K.01 → K.14</span>
      </div>
    </footer>
  )
}
