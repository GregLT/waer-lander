import Image from 'next/image'
import { config } from '@/lib/config'

export default function Hero() {
  return (
    <section className="hero">
      {/* Mobile only: logo over the image */}
      <div className="hero-logo-mobile">
        <Image
          src="/assets/WAER_Wordmark_Black.png"
          alt="WAER"
          width={3000}
          height={734}
          style={{ height: 16, width: 'auto' }}
          priority
        />
      </div>
      {/* image block — visible on mobile only, hidden on desktop */}
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-copy">
        {/* Desktop only: logo inline with copy */}
        <div className="hero-logo-desktop">
          <Image
            src="/assets/WAER_Wordmark_Black.png"
            alt="WAER"
            width={3000}
            height={734}
            style={{ height: 26, width: 'auto' }}
            priority
          />
        </div>
        <div className="hero-eyebrow">Launching A/W &rsquo;26</div>
        <h1>
          Your scent wardrobe.{" "}<span className="hero-accent">{config.headlineEm}</span>
        </h1>
        <p className="hero-lede">
          {config.lede} {config.subLede}
        </p>
      </div>
    </section>
  )
}
