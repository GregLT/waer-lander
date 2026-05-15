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

      <div className="footer-cols">
        <div>
          <h5>WAER</h5>
          <p>
            A considered collection of fragrances designed to be styled, layered and rotated.
            Curate. Layer. Rotate.
          </p>
        </div>
        <div>
          <h5>Follow</h5>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">TikTok</a></li>
            <li><a href="#">Substack</a></li>
          </ul>
        </div>
        <div>
          <h5>About</h5>
          <ul>
            <li><a href="#">Our story</a></li>
            <li><a href="#">Perfumers</a></li>
            <li><a href="#">Journal</a></li>
          </ul>
        </div>
        <div>
          <h5>Support</h5>
          <ul>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Shipping</a></li>
            <li><a href="#">Terms</a></li>
          </ul>
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
