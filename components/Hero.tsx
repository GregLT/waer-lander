import { config } from '@/lib/config'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="hero-pill">
          <span className="dot" aria-hidden="true" />
          {config.pill}
        </span>
        <h1>
          {config.headline} <em>{config.headlineEm}</em>
        </h1>
        <p className="hero-lede">
          {config.lede}<br /><br />{config.subLede}
        </p>
      </div>
    </section>
  )
}
