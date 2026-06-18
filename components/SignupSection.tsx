'use client'

import { useState } from 'react'
import WaitlistForm from './WaitlistForm'
import { config } from '@/lib/config'

function formatCount(n: number) {
  return n.toLocaleString('en-GB')
}

export default function SignupSection() {
  const [count, setCount] = useState(config.initialCount)

  return (
    <section className="signup">
      <div className="signup-inner">
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
    </section>
  )
}
