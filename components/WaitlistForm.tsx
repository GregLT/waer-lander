'use client'

import { useState, type FormEvent } from 'react'

type Variant = 'hero' | 'join' | 'footer'

interface Props {
  variant: Variant
  submitLabel?: string
  successLabel?: string
  onSuccess?: (position: number) => void
}

export default function WaitlistForm({
  variant,
  submitLabel = 'Request access →',
  successLabel = "You're on the list.",
  onSuccess,
}: Props) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { ok: boolean; position?: number; error?: string }

      if (!data.ok) {
        setError(data.error ?? 'Something went wrong.')
        return
      }

      setSubmitted(true)
      onSuccess?.(data.position ?? 0)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const formClass = `wf-${variant}`

  return (
    <div>
      <form className={formClass} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitted || submitting}
          aria-label="Email address"
        />
        <button type="submit" disabled={submitted || submitting}>
          {submitted ? successLabel : submitting ? 'Sending…' : submitLabel}
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
