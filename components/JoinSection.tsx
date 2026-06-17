'use client'

import { useState } from 'react'
import WaitlistForm from './WaitlistForm'

const INITIAL_COUNT = 1284

function formatCount(n: number) {
  return `n.${n.toLocaleString('en-GB')}`
}

export default function JoinSection() {
  const [count, setCount] = useState(INITIAL_COUNT)

  return (
    <section className="join">
      <div className="join-form-pane">
        <h2>Join the list.</h2>
        <p>
          We&rsquo;re letting a small group in first — to pair, layer and rotate before the
          doors open to anyone else. No launch emails. No countdowns. One note when your vials
          are ready.
        </p>
        <WaitlistForm
          variant="join"
          onSuccess={(position) => setCount(prev => position > prev ? position : prev + 1)}
        />
        <div className="form-fine">We only write when it matters. Unsubscribe any time.</div>
        <div className="waitlist-meta">
          <div>
            <span className="meta-num">{formatCount(count)}</span>
            <span className="meta-lbl">On the list</span>
          </div>
          <div>
            <span className="meta-num">14</span>
            <span className="meta-lbl">Named scents</span>
          </div>
          <div>
            <span className="meta-num">A/W &rsquo;26</span>
            <span className="meta-lbl">Doors open</span>
          </div>
        </div>
      </div>
      <div className="join-img" aria-hidden="true" />
    </section>
  )
}
