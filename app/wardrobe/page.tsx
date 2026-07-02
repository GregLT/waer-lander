'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const Q1_ANSWERS = ['Case + 1 Fragrance', 'Case + 2 Fragrances', 'Case + 3 Fragrances'] as const
const Q2_ANSWERS = ["Yes, I'd subscribe", "Maybe, if it was flexible", "No, I'd rather buy when I need"] as const
const Q3_CADENCE = ['Monthly', 'Every 2 months', 'Every 3 months', "I'd choose each time"] as const
const Q3_BUY = ['When I run out', 'When a new scent drops', 'Seasonally', 'As a gift / treat'] as const
const Q4_ANSWERS = ['Great value', 'About right', 'A bit much', 'Too expensive'] as const
const Q5_ANSWERS = ['Yes, definitely', 'Probably', 'Not sure yet', 'Not for me'] as const

const PRICES: Record<string, { full: string; sub: string }> = {
  'Case + 1 Fragrance': { full: '£30', sub: '£24' },
  'Case + 2 Fragrances': { full: '£45', sub: '£36' },
  'Case + 3 Fragrances': { full: '£60', sub: '£50' },
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
  const [q3, setQ3] = useState<string | null>(null)
  const [q3b, setQ3b] = useState<string | null>(null)
  const [q4, setQ4] = useState<string | null>(null)
  const [q5, setQ5] = useState<string | null>(null)
  const [q6, setQ6] = useState('')
  const [email, setEmail] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawEmail = params.get('email')
    setEmail(rawEmail ? decodeURIComponent(rawEmail) : null)
    setName(sanitiseName(params.get('name')))
  }, [])

  useEffect(() => { setQ4(null) }, [q1])
  useEffect(() => { setQ3(null); setQ3b(null) }, [q2])

  const isSubscriber = q2 === "Yes, I'd subscribe" || q2 === "Maybe, if it was flexible"
  const isNonSubscriber = q2 === "No, I'd rather buy when I need"
  const q4Locked = !q1

  const q3Answer = isSubscriber ? q3 : isNonSubscriber ? q3b : null
  const answeredCount = [q1, q2, q3Answer, q4, q5].filter(Boolean).length
  const totalRequired = 5

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
          q3_cadence: isSubscriber ? q3 : null,
          q3_buy_timing: isNonSubscriber ? q3b : null,
          q4_price_reaction: q4,
          q4_bundle_shown: q1 === 'Case + 2 Fragrances' ? 'case-2' : q1 === 'Case + 3 Fragrances' ? 'case-3' : 'case-1',
          q5_purchase_intent: q5,
          q5_text: q6.trim() || null,
          survey_version: 'v2',
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
          <h1 className="vote-thanks-hed">Thank you. You&rsquo;re helping shape WAER.</h1>
          <p className="vote-thanks-sub">We&rsquo;ll share the results soon, along with what the first WAER wardrobe will look like.</p>
          <div className="wardrobe-thanks-ctas">
            <a className="wardrobe-cta-primary" href="https://waer.co" target="_blank" rel="noopener noreferrer">Join the WAER waiting list</a>
            <a className="wardrobe-cta-secondary" href="/vote/results">See what others chose</a>
          </div>
        </div>
      ) : (
        <>
          <section className="vote-hero">
            {name && <p className="vote-hero-eyebrow">{name}, your turn.</p>}
            <h1 className="vote-hero-hed">A few questions.</h1>
            <p className="vote-intro">We&rsquo;re building WAER with the people who wore DIEM first. Help shape the first WAER starter set, refill rhythm and launch price.</p>
          </section>

          <div className="wardrobe-questions">

            {/* Q1 */}
            <section className="wardrobe-question">
              <h2 className="wardrobe-question-hed">What should WAER&rsquo;s starter set include?</h2>
              <div className="wardrobe-answers">
                {Q1_ANSWERS.map(a => (
                  <button key={a} className={`wardrobe-answer${q1 === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ1(a)}>{a}</button>
                ))}
              </div>
              <p className="wardrobe-freetext-hint">Each 10ml fragrance lasts around 20&ndash;30 days, depending on how often you wear it.</p>
            </section>

            {/* Q2 */}
            <section className="wardrobe-question">
              <p className="wardrobe-question-setup">DIEM made refills effortless. WAER should feel even easier.</p>
              <h2 className="wardrobe-question-hed">Would you want automatic refills?</h2>
              <div className="wardrobe-answers">
                {Q2_ANSWERS.map(a => (
                  <button key={a} className={`wardrobe-answer${q2 === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ2(a)}>{a}</button>
                ))}
              </div>
            </section>

            {/* Q3 – cadence for subscribers */}
            {isSubscriber && (
              <section className="wardrobe-question wardrobe-question--follow-up">
                <p className="wardrobe-question-setup">Some people rotate often. Some refill slowly. We&rsquo;re setting WAER&rsquo;s rhythm around real wardrobes.</p>
                <h2 className="wardrobe-question-hed">If refills were on autopilot, how often would feel right?</h2>
                <div className="wardrobe-answers">
                  {Q3_CADENCE.map(a => (
                    <button key={a} className={`wardrobe-answer${q3 === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ3(a)}>{a}</button>
                  ))}
                </div>
              </section>
            )}

            {/* Q3b – buy timing for non-subscribers */}
            {isNonSubscriber && (
              <section className="wardrobe-question wardrobe-question--follow-up">
                <h2 className="wardrobe-question-hed">How would you prefer to buy refills?</h2>
                <div className="wardrobe-answers">
                  {Q3_BUY.map(a => (
                    <button key={a} className={`wardrobe-answer${q3b === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ3b(a)}>{a}</button>
                  ))}
                </div>
              </section>
            )}

            {/* Q4 – price reaction, hidden until Q1 answered */}
            {q1 && (
              <section className="wardrobe-question">
                <p className="wardrobe-question-setup">We&rsquo;re pricing WAER now, and your gut reaction genuinely helps.</p>
                <h2 className="wardrobe-question-hed">{`How does ${PRICES[q1].full} for ${q1} feel?`}</h2>
                <p className="wardrobe-question-setup">{`${PRICES[q1].full} to buy outright, or ${PRICES[q1].sub} on subscription.`}</p>
                <div className="wardrobe-answers">
                  {Q4_ANSWERS.map(a => (
                    <button
                      key={a}
                      className={`wardrobe-answer${q4 === a ? ' wardrobe-answer--selected' : ''}`}
                      onClick={() => setQ4(a)}
                    >{a}</button>
                  ))}
                </div>
              </section>
            )}

            {/* Q5 – purchase intent */}
            <section className="wardrobe-question">
              <p className="wardrobe-question-setup">No pressure. We just want to understand what feels exciting enough to buy, not just what sounds good.</p>
              <h2 className="wardrobe-question-hed">Would you buy this at launch?</h2>
              <div className="wardrobe-answers">
                {Q5_ANSWERS.map(a => (
                  <button key={a} className={`wardrobe-answer${q5 === a ? ' wardrobe-answer--selected' : ''}`} onClick={() => setQ5(a)}>{a}</button>
                ))}
              </div>
            </section>

            {/* Q6 – optional free text */}
            <section className="wardrobe-question">
              <p className="wardrobe-question-setup">Here&rsquo;s something we found: 85% of the people we spoke to said they don&rsquo;t actually enjoy buying fragrance. We&rsquo;re building WAER to change that.</p>
              <h2 className="wardrobe-question-hed">So tell us, what&rsquo;s the one thing WAER should get right?</h2>
              <div className="wardrobe-freetext">
                <textarea
                  className="vote-feedback-input"
                  placeholder="Optional"
                  rows={3}
                  maxLength={500}
                  value={q6}
                  onChange={e => setQ6(e.target.value)}
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
