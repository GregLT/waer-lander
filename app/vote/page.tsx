'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const CASES = [
  { id: 'verdant-spice',  name: 'Verdant Spice',  color: 'hsl(88 20% 48%)',  hex: '#76926a' },
  { id: 'lychee-flair',   name: 'Lychee Flair',   color: 'hsl(327 90% 67%)', hex: '#f85cb0' },
  { id: 'warm-blush',     name: 'Warm Blush',     color: 'hsl(9 20% 80%)',   hex: '#d6c3bd' },
  { id: 'amber-sundown',  name: 'Amber Sundown',  color: 'hsl(44 89% 55%)',  hex: '#f4b624' },
  { id: 'ebony-pepper',   name: 'Ebony Pepper',   color: 'hsl(9 54% 26%)',   hex: '#66301f' },
  { id: 'bergamot-sky',   name: 'Bergamot Sky',   color: 'hsl(198 73% 55%)', hex: '#36a8e0' },
]

export default function VotePage() {
  const [selected, setSelected] = useState<string[]>([])
  const [klaviyoId, setKlaviyoId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setKlaviyoId(params.get('id'))
  }, [])

  function toggle(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 2) return prev
      return [...prev, id]
    })
  }

  async function handleSubmit() {
    if (selected.length !== 2 || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ klaviyo_id: klaviyoId, choices: selected, ts: Date.now() }),
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
          <p className="vote-thanks-sub">Your vote&rsquo;s in. We&rsquo;ll share the four we&rsquo;re making very soon.</p>
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="vote-hero">
            <h1 className="vote-hero-hed">Choose your two</h1>
            <p className="vote-hero-accent">Pick the cases we make.</p>
            <p className="vote-intro">
              We&rsquo;ve designed six case colourways and we&rsquo;re only making four.
              The two you pick are a vote for the ones we make.
            </p>
          </section>

          {/* Grid */}
          <section className="vote-grid-wrap">
            <div className="vote-grid">
              {CASES.map(c => {
                const isSel = selected.includes(c.id)
                const isBlocked = !isSel && selected.length >= 2
                return (
                  <button
                    key={c.id}
                    className={`vote-tile${isSel ? ' vote-tile--selected' : ''}${isBlocked ? ' vote-tile--blocked' : ''}`}
                    onClick={() => toggle(c.id)}
                    aria-pressed={isSel}
                  >
                    <div className="vote-tile-swatch" style={{ background: c.color }} />
                    {isSel && (
                      <span className="vote-tile-check" aria-hidden="true">✓</span>
                    )}
                    <span className="vote-tile-name">{c.name}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Fixed bottom bar */}
          <div className="vote-bar">
            <span className="vote-bar-count">{selected.length} / 2 selected</span>
            {error && <span className="form-error" style={{ margin: 0 }}>{error}</span>}
            <button
              className="vote-submit"
              disabled={selected.length !== 2 || submitting}
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
