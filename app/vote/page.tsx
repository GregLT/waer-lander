'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const CASES = [
  { id: 'zest',      name: 'Zest',      img: '/assets/cases/zest.png' },
  { id: 'ink',       name: 'Ink',       img: '/assets/cases/ink.png' },
  { id: 'chrome',    name: 'Chrome',    img: '/assets/cases/chrome.png' },
  { id: 'petal',     name: 'Petal',     img: '/assets/cases/petal.png' },
  { id: 'forest',    name: 'Forest',    img: '/assets/cases/forest.png' },
  { id: 'berry',     name: 'Berry',     img: '/assets/cases/berry.png' },
  { id: 'bubblegum', name: 'Bubblegum', img: '/assets/cases/bubblegum.png' },
  { id: 'ecru',      name: 'Ecru',      img: '/assets/cases/ecru.png' },
]

// URL params are untrusted input. React JSX auto-escapes string values so {name}
// won't render HTML, but we also strip tags here before it reaches the JSX layer.
function sanitiseName(raw: string | null): string | null {
  if (!raw) return null
  let val: string
  try { val = decodeURIComponent(raw) } catch { return null }
  // Strip any HTML tags (belt-and-braces on top of JSX auto-escaping)
  val = val.replace(/<[^>]*>/g, '').trim()
  if (!val || val.toLowerCase() === 'there') return null
  return val
}

export default function VotePage() {
  const [selected, setSelected] = useState<string[]>([])
  const [klaviyoId, setKlaviyoId] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawId = params.get('id')
    // Klaviyo's {{ person.id }} resolves to the string "None" when unset — treat as null
    setKlaviyoId(rawId && rawId !== 'None' ? rawId : null)
    setName(sanitiseName(params.get('name')))
  }, [])

  function toggle(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  async function handleSubmit() {
    if (selected.length !== 3 || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ klaviyo_id: klaviyoId, choices: selected, feedback: feedback.trim() || null, ts: Date.now() }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!data.ok) { setError(data.error ?? 'Something went wrong.'); return }
      setSubmitted(true)
    } catch {
      setError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="vote-page">
      {/* Header */}
      <header className="vote-header">
        <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={3000} height={734} style={{ height: 16, width: 'auto' }} priority />
      </header>

      {submitted ? (
        <div className="vote-thanks">
          <h1 className="vote-thanks-hed">Thank you</h1>
          <p className="vote-thanks-sub">Your vote&rsquo;s in. We&rsquo;ll share the three we&rsquo;re making very soon.</p>
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="vote-hero">
            <h1 className="vote-hero-hed">Choose your three</h1>
            <p className="vote-hero-accent">
              Help us shape the line-up{name ? `, ${name}` : ''}.
            </p>
            <p className="vote-intro">
              We&rsquo;ve designed eight case colourways and we&rsquo;re narrowing down to a final few. Tell us the three you&rsquo;d reach for &mdash; your picks help guide what we make.
            </p>
          </section>

          {/* Grid */}
          <section className="vote-grid-wrap">
            <div className="vote-grid">
              {CASES.map(c => {
                const isSel = selected.includes(c.id)
                const isBlocked = !isSel && selected.length >= 3
                return (
                  <button
                    key={c.id}
                    className={`vote-tile${isSel ? ' vote-tile--selected' : ''}${isBlocked ? ' vote-tile--blocked' : ''}`}
                    onClick={() => toggle(c.id)}
                    aria-pressed={isSel}
                  >
                    <div className="vote-tile-img-wrap">
                      <Image src={c.img} alt={c.name} fill sizes="(max-width: 600px) 50vw, 25vw" style={{ objectFit: 'contain', objectPosition: 'bottom center' }} />
                    </div>
                    {isSel && (
                      <span className="vote-tile-check" aria-hidden="true">✓</span>
                    )}
                    <span className="vote-tile-name">{c.name}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Optional feedback */}
          <div className="vote-feedback-wrap">
            <label className="vote-feedback-label" htmlFor="vote-feedback">
              Any colour or finish you&rsquo;d love to see in the future?
            </label>
            <textarea
              id="vote-feedback"
              className="vote-feedback-input"
              placeholder="Optional"
              rows={3}
              maxLength={500}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              disabled={submitting}
            />
          </div>

          {/* Fixed bottom bar */}
          <div className="vote-bar">
            <span className="vote-bar-count">{selected.length} / 3 selected</span>
            {error && <span className="form-error" style={{ margin: 0 }}>{error}</span>}
            <button
              className="vote-submit"
              disabled={selected.length !== 3 || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting…' : 'Submit vote →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
