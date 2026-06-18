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
    <section className="join join--no-img">
      <div className="join-form-pane">
        <h2>Become a<br />founding member.</h2>
        <p>
          One scent no longer covers it all.<br /><br />
          A/W &rsquo;26.<br /><br />
          Reserve your place.
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
    </section>
  )
}
