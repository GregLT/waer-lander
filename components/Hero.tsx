import { config } from '@/lib/config'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-eyebrow">Launching A/W &rsquo;26</div>
        <h1>
          {config.headline} <em>{config.headlineEm}</em>
        </h1>
        <p className="hero-lede">
          {config.lede} <em className="hero-lede-em">{config.subLede}</em>
        </p>
      </div>
    </section>
  )
}
