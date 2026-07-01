'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const QUESTIONS = [
  {
    key: 'q1_count' as const,
    setup: "You already know the feeling of reaching for a different scent depending on your day. That was the heart of DIEM, and it's the whole idea behind WAER.",
    question: "How many fragrances belong in a wardrobe?",
    answers: ['2–3', '4–5', '6+', 'Just one'],
  },
  {
    key: 'q2_cases' as const,
    setup: "With DIEM, one case carried your scent. We're wondering whether one is still right, or whether different moods deserve their own.",
    question: "One refillable case, or a few?",
    answers: ['One is all I need', 'A couple for different moods', 'A little collection'],
  },
  {
    key: 'q3_subscription' as const,
    setup: "You've lived the refill model, so you know what works and what doesn't. That experience is what we want to build around.",
    question: "What would make a subscription genuinely worth it?",
    answers: ['A better price', 'Freedom to swap scents', 'Discovering new ones', 'Never running out'],
  },
  {
    key: 'q4_refill_frequency' as const,
    setup: "Back in your DIEM days, everyone refilled at their own pace. It helps us to know yours.",
    question: "How often did you refill?",
    answers: ['Monthly or more', 'Every few months', 'Now and then', "I can't remember"],
  },
]

type Answers = {
  q1_count?: string
  q2_cases?: string
  q3_subscription?: string
  q4_refill_frequency?: string
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
  const [answers, setAnswers] = useState<Answers>({})
  const [klaviyoId, setKlaviyoId] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawId = params.get('id')
    // "None" is what Klaviyo's {{ person.id }} resolves to when unset — treat as absent
    setKlaviyoId(rawId && rawId !== 'None' ? rawId : null)
    setName(sanitiseName(params.get('name')))
  }, [])

  function pick(key: keyof Answers, value: string) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const answeredCount = QUESTIONS.filter(q => answers[q.key]).length
  const allAnswered = answeredCount === 4

  async function handleSubmit() {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          klaviyo_id: klaviyoId,
          q1_count: answers.q1_count,
          q2_cases: answers.q2_cases,
          q3_subscription: answers.q3_subscription,
          q4_refill_frequency: answers.q4_refill_frequency,
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
            <h1 className="vote-hero-hed">Four questions.</h1>
            <p className="vote-intro">We want to build WAER around how you actually use fragrance. Takes about a minute.</p>
          </section>

          <div className="wardrobe-questions">
            {QUESTIONS.map(q => (
              <section key={q.key} className="wardrobe-question">
                <p className="wardrobe-question-setup">{q.setup}</p>
                <h2 className="wardrobe-question-hed">{q.question}</h2>
                <div className="wardrobe-answers">
                  {q.answers.map(a => (
                    <button
                      key={a}
                      className={`wardrobe-answer${answers[q.key] === a ? ' wardrobe-answer--selected' : ''}`}
                      onClick={() => pick(q.key, a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="vote-bar">
            <span className="vote-bar-count">{answeredCount} / 4 answered</span>
            {error && <span className="form-error" style={{ margin: 0 }}>{error}</span>}
            <button
              className="vote-submit"
              disabled={!allAnswered || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting…' : 'Submit →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
