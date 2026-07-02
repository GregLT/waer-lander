'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const Q1_ANSWERS = ['Case + 1 x 10ml', 'Case + 2 x 10ml', 'Case + 3 x 10ml'] as const
const Q2_ANSWERS = ['Yes', 'Maybe', 'Not for me'] as const
const Q2B_ANSWERS = ['Exclusive scents', 'Free delivery', 'A discount on orders', 'Never running out'] as const
const Q3_ANSWERS = ['Monthly', 'Every 2 months', 'Quarterly'] as const
const Q4_ANSWERS = ['Great value', 'About right', 'A bit much', 'Too expensive'] as const

function q4Text(q1: string) {
  if (q1 === 'Case + 1 x 10ml') {
    return 'Your starter set, case and one 10ml scent, is £30, or £24 on subscription. How does that feel?'
  }
  if (q1 === 'Case + 2 x 10ml') {
    return 'Your starter wardrobe, case and two 10ml scents, is £45, or £36 on subscription. How does that feel?'
  }
  return 'Your starter wardrobe, case and three 10ml scents, is £60, or £50 on subscription. How does that feel?'
}

function sanitiseName(raw: string | null): string | null {
  if (!raw) return null
  let val: string
  try { val = decodeURIComponent(raw) } catch { return null }
  val = val.replace(/<[^>]*>/g, '').trim()
  if (!val || val.toLowerCase() === 'there') return null
  return val
}

export default function WardrobePage() {
  const [q1, setQ1] = useState<string | null>(null)
  const [q2, setQ2] = useState<string | null>(null)
  const [q2b, setQ2b] = useState<string | null>(null)
  const [q3, setQ3] = useState<string | null>(null)
  const [q4, setQ4] = useState<string | null>(null)
  const [q5, setQ5] = useState('')
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // Email is the reliable identifier — {{ person.email }} always resolves correctly
    const rawEmail = params.get('email')
    setEmail(rawEmail ? decodeURIComponent(rawEmail) : null)
    setName(sanitiseName(params.get('name')))
  }, [])

  // Changing Q1 invalidates Q4 (the question text changes)
  useEffect(() => { setQ4(null) }, [q1])
  // Switching Q2 away from Yes/Maybe clears Q2b
  useEffect(() => { if (q2 !== 'Yes' && q2 !== 'Maybe') setQ2b(null) }, [q2])

  const showQ2b = q2 === 'Yes' || q2 === 'Maybe'
  const showQ4 = q1 !== null
  const q4Locked = !q1

  let answeredCount = [q1, q2, q3].filter(Boolean).length
  let totalRequired = 3
  if (showQ2b) { totalRequired++; if (q2b) answeredCount++ }
  if (showQ4)  { totalRequired++; if (q4)  answeredCount++ }

  const canSubmit = answeredCount === totalRequired

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          q1_starter: q1,
          q2_subscription: q2,
          q2b_benefit: q2b ?? null,
          q3_cadence: q3,
          q4_price_reaction: q4,
          q4_bundle_shown: q1 === 'Case + 2 x 10ml' ? 'case-2' : q1 === 'Case + 3 x 10ml' ? 'case-3' : 'case-1',
          q5_text: q5.trim() || null,
          ts: Date.now(),
        }),
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
      <header className="vote-header">
        <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={3000} height={734} style={{ height: 16, width: 'auto' }} priority />
      </header>

      {submitted ? (
        <div className="vote-thanks">
          <h1 className="vote-thanks-hed">Thank you</h1>
          <p className="vote-thanks-sub">That&rsquo;s really helpful. We&rsquo;re building WAER around answers like yours &mdash; more soon.</p>
        </div>
      ) : (
        <>
          <section className="vote-hero">
            {name && <p className="vote-hero-eyebrow">{name}, your turn.</p>}
            <h1 className="vote-hero-hed">A few questions.</h1>
            <p className="vote-intro">Help us build WAER around how fragrance actually fits into your life.</p>
          </section>

          <div className="wardrobe-questions">

            {/* Q1 */}
            <section className="wardrobe-question">
              <p className="wardrobe-question-setup">Everyone started their DIEM wardrobe somewhere. We&rsquo;re choosing what WAER&rsquo;s first step looks like.</p>
              <h2 className="wardrobe-question-hed">Your ideal starter wardrobe?</h2>
              <div className="wardrobe-answers">
                {Q1_ANSWERS.map(a => (
                  <button key={a} className={`wardrobe-answer${q1 === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ1(a)}>{a}</button>
                ))}
              </div>
              <p className="wardrobe-freetext-hint">10ml lasts 20&ndash;30 days depending on usage.</p>
            </section>

            {/* Q2 */}
            <section className="wardrobe-question">
              <p className="wardrobe-question-setup">The subscription was what made DIEM effortless. We&rsquo;re deciding how WAER&rsquo;s should work.</p>
              <h2 className="wardrobe-question-hed">Would a subscription interest you?</h2>
              <div className="wardrobe-answers">
                {Q2_ANSWERS.map(a => (
                  <button key={a} className={`wardrobe-answer${q2 === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ2(a)}>{a}</button>
                ))}
              </div>
            </section>

            {/* Q2b – conditional follow-up */}
            {showQ2b && (
              <section className="wardrobe-question wardrobe-question--follow-up">
                <p className="wardrobe-question-setup">Good to know. So we build the right one:</p>
                <h2 className="wardrobe-question-hed">What would make it worth it?</h2>
                <div className="wardrobe-answers">
                  {Q2B_ANSWERS.map(a => (
                    <button key={a} className={`wardrobe-answer${q2b === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ2b(a)}>{a}</button>
                  ))}
                </div>
              </section>
            )}

            {/* Q3 */}
            <section className="wardrobe-question">
              <p className="wardrobe-question-setup">With DIEM, refills arrived at your pace. We&rsquo;re setting WAER&rsquo;s rhythm.</p>
              <h2 className="wardrobe-question-hed">With a subscription, how often would you like refills sent?</h2>
              <div className="wardrobe-answers">
                {Q3_ANSWERS.map(a => (
                  <button key={a} className={`wardrobe-answer${q3 === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ3(a)}>{a}</button>
                ))}
              </div>
            </section>

            {/* Q4 – price reaction; locked until Q1 answered */}
            {(
              <section className={`wardrobe-question${q4Locked ? ' wardrobe-question--locked' : ''}`}>
                <p className="wardrobe-question-setup">We&rsquo;re pricing WAER now, and your gut reaction genuinely helps.</p>
                <h2 className="wardrobe-question-hed">
                  {q1 ? q4Text(q1) : 'Choose your starter wardrobe above to unlock this.'}
                </h2>
                <div className="wardrobe-answers">
                  {Q4_ANSWERS.map(a => (
                    <button
                      key={a}
                      className={`wardrobe-answer${q4 === a ? ' wardrobe-answer--selected' : ''}`}
                      onClick={() => { if (!q4Locked) setQ4(a) }}
                      disabled={q4Locked}
                      aria-disabled={q4Locked}
                    >{a}</button>
                  ))}
                </div>
              </section>
            )}

            {/* Q5 – optional free text */}
            <section className="wardrobe-question">
              <p className="wardrobe-question-setup">Here&rsquo;s something we found: 85% of the people we spoke to said they don&rsquo;t actually enjoy buying fragrance. We&rsquo;re building WAER to change that.</p>
              <h2 className="wardrobe-question-hed">So tell us, what&rsquo;s the one thing WAER should get right?</h2>
              <div className="wardrobe-freetext">
                <textarea
                  className="vote-feedback-input"
                  placeholder="Optional"
                  rows={3}
                  maxLength={500}
                  value={q5}
                  onChange={e => setQ5(e.target.value)}
                  disabled={submitting}
                />
                <p className="wardrobe-freetext-hint">A sentence is plenty. No wrong answers.</p>
              </div>
            </section>

          </div>

          <div className="vote-bar">
            <span className="vote-bar-count">{answeredCount} / {totalRequired} answered</span>
            {error && <span className="form-error" style={{ margin: 0 }}>{error}</span>}
            <button className="vote-submit" disabled={!canSubmit || submitting} onClick={handleSubmit}>
              {submitting ? 'Submitting…' : 'Submit →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
