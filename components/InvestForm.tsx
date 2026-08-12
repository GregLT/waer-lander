'use client'

import { useState, type FormEvent } from 'react'

const MIN_AMOUNT = 5000

export default function InvestForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (Number(amount) < MIN_AMOUNT) {
      setError(`Minimum investment is £${MIN_AMOUNT.toLocaleString('en-GB')}.`)
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('https://formsubmit.co/ajax/gregletocq@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Name: name,
          Email: email,
          'Investment Amount (GBP)': amount,
          _subject: 'New WAER Investment Interest',
          _template: 'table',
          _captcha: 'false',
        }),
      })

      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <p className="invest-success">
        Thank you for your interest in WAER, we will be in touch shortly with more information.
      </p>
    )
  }

  return (
    <form className="invest-form" onSubmit={handleSubmit}>
      <div className="invest-field">
        <label htmlFor="invest-name">Full name</label>
        <input
          id="invest-name"
          type="text"
          placeholder="Jane Smith"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="invest-field">
        <label htmlFor="invest-email">Email address</label>
        <input
          id="invest-email"
          type="email"
          placeholder="jane@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div className="invest-field">
        <label htmlFor="invest-amount">Investment amount (minimum £{MIN_AMOUNT.toLocaleString('en-GB')})</label>
        <div className="invest-amount-wrap">
          <span className="invest-currency">£</span>
          <input
            id="invest-amount"
            type="number"
            placeholder="5,000"
            min={MIN_AMOUNT}
            step={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      <button type="submit" className="invest-submit" disabled={submitting}>
        {submitting ? 'Sending…' : 'Submit interest →'}
      </button>

      {error && <p className="form-error">{error}</p>}
    </form>
  )
}
