'use client'

import { useState } from 'react'
import WaitlistForm from './WaitlistForm'

const INITIAL_COUNT = 1284

function formatCount(n: number) {
  return n.toLocaleString('en-GB')
}

export default function JoinSection() {
  const [count, setCount] = useState(INITIAL_COUNT)

  return (
    <section className="join">
      <div className="join-form-pane">
        <h2>Join the list.</h2>
        <p>
          We&rsquo;re releasing WAER to a small group first.<br /><br />
          Not retailers.<br /><br />
          Not department stores.<br /><br />
          Not everyone.<br /><br />
          First access starts here.
        </p>
        <WaitlistForm
          variant="join"
          submitLabel="Reserve access →"
          onSuccess={(position) => setCount(prev => position > prev ? position : prev + 1)}
        />
        <div className="waitlist-meta">
          <div>
            <span className="meta-num">{formatCount(count)}</span>
            <span className="meta-lbl">FOUNDING MEMBERS</span>
          </div>
          <div>
            <span className="meta-num">14</span>
            <span className="meta-lbl">SCENTS</span>
          </div>
          <div>
            <span className="meta-num">A/W &rsquo;26</span>
            <span className="meta-lbl">FIRST DROP</span>
          </div>
        </div>
      </div>
      <div className="join-img" aria-hidden="true" />
    </section>
  )
}
