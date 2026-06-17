import Image from 'next/image'
import WaitlistForm from './WaitlistForm'

export default function SiteFooter() {
  return (
    <footer>
      <div className="footer-cta">
        <h3>We look forward to seeing your rotations.</h3>
        <div className="footer-sign">
          <WaitlistForm variant="footer" submitLabel="Join →" successLabel="Added." />
          <span className="footer-fine-text">No launch blasts. One letter when doors open.</span>
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
        <span>n.01 → n.15</span>
      </div>
    </footer>
  )
}
