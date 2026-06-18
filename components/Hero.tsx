'use client'

import { useState } from 'react'
import WaitlistForm from './WaitlistForm'
import { config } from '@/lib/config'

function formatCount(n: number) {
  return n.toLocaleString('en-GB')
}

export default function Hero() {
  const [count, setCount] = useState(config.initialCount)

  return (
    <section className="hero">
      <div className="hero-grid">
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
          <WaitlistForm
            variant="hero"
            submitLabel={config.ctaLabel}
            onSuccess={(position) => setCount(prev => position > prev ? position : prev + 1)}
          />
          <div className="hero-stats">
            <div>
              <span className="hero-stat-num">{formatCount(count)}</span>
              <span className="hero-stat-lbl">Founding members</span>
            </div>
            <div>
              <span className="hero-stat-num">14</span>
              <span className="hero-stat-lbl">Scents</span>
            </div>
            <div>
              <span className="hero-stat-num">A/W &rsquo;26</span>
              <span className="hero-stat-lbl">First drop</span>
            </div>
          </div>
        </div>
        <div className="hero-img" aria-hidden="true" />
      </div>
    </section>
  )
}
