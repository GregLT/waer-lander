import WaitlistForm from './WaitlistForm'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="hero-pill">
            <span className="dot" aria-hidden="true" />
            A/W &rsquo;26 &bull; 1,000+ FOUNDING MEMBERS
          </span>
          <h1>
            Your scent wardrobe. <em>Finally.</em>
          </h1>
          <p className="hero-lede">
            One scent can&rsquo;t carry your whole life.<br /><br />Curate. Layer. Rotate.
          </p>
          <WaitlistForm variant="hero" submitLabel="Reserve access →" />
          <div className="hero-social">
            <div className="hero-avatars" aria-hidden="true">
              <span className="av" style={{ background: '#761205' }} />
              <span className="av" style={{ background: '#E050B0' }} />
              <span className="av" style={{ background: '#8CB07D' }} />
              <span className="av" style={{ background: '#F0D080' }} />
              <span className="av" style={{ background: '#607078' }} />
            </div>
            <div>
              <strong>1,000+ founding members.</strong>
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
