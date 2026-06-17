import WaitlistForm from './WaitlistForm'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-pill">
            <span className="dot" aria-hidden="true" />
            Launching A/W &rsquo;26 — 1,000+ already on the list
          </span>
          <h1>
            Your scent wardrobe. <em>Finally.</em>
          </h1>
          <p className="hero-lede">
            WAER is the first fragrance wardrobe designed to be layered and rotated — so one
            scent never has to cover every mood.{' '}
            <strong>Your morning isn&rsquo;t your evening.</strong> Your Tuesday isn&rsquo;t
            your Saturday. Fourteen named scents. One considered rotation.
          </p>
          <div className="hero-check">
            <span className="tick" aria-hidden="true">✓</span>
            Founding members get priority access and an exclusive launch offer.
          </div>
          <WaitlistForm variant="hero" />
          <div className="hero-social">
            <div className="hero-avatars" aria-hidden="true">
              <span className="av" style={{ background: '#761205' }} />
              <span className="av" style={{ background: '#E050B0' }} />
              <span className="av" style={{ background: '#8CB07D' }} />
              <span className="av" style={{ background: '#F0D080' }} />
              <span className="av" style={{ background: '#607078' }} />
            </div>
            <div>
              <strong>1,000+ on the waitlist.</strong>
              <span className="hero-social-sub">
                Joining from London, Manchester, Bristol and beyond.
              </span>
            </div>
          </div>
        </div>
        <div className="hero-img" aria-hidden="true" />
      </div>
    </section>
  )
}
