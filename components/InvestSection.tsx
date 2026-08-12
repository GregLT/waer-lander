'use client'

import { useState } from 'react'
import InvestForm from './InvestForm'

export default function InvestSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      {!submitted && (
        <section className="invest-hero">
          <div className="invest-hero-eyebrow">Investor Interest</div>
          <h1 className="invest-hero-hed">Reserve your allocation</h1>
          <p className="invest-intro">
            Expressing an interest is not a commitment to invest. Tell us a little about yourself
            and how much you&rsquo;d like to invest, and our team will follow up with next steps.
          </p>
        </section>
      )}

      <section className="invest-form-wrap">
        <InvestForm onSubmitted={() => setSubmitted(true)} />
      </section>
    </>
  )
}
