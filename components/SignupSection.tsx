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
        <p className="signup-label">Be the first to know</p>
        <WaitlistForm
          variant="hero"
          submitLabel={config.ctaLabel}
          onSuccess={(position) => setCount(prev => position > prev ? position : prev + 1)}
        />
        <div className="signup-count">
          <span className="signup-count-num">{formatCount(count)}</span>
          <span className="signup-count-lbl">People on the waitlist</span>
        </div>
      </div>
    </section>
  )
}
