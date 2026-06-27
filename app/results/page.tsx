'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase'

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

type Counts = Record<string, number>

function toCounts(rows: { choice_1: string; choice_2: string }[]): Counts {
  const counts: Counts = {}
  for (const c of CASES) counts[c.id] = 0
  for (const row of rows) {
    if (counts[row.choice_1] !== undefined) counts[row.choice_1]++
    if (counts[row.choice_2] !== undefined) counts[row.choice_2]++
  }
  return counts
}

export default function ResultsPage() {
  const [counts, setCounts] = useState<Counts>({})
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()

    async function fetchAll() {
      const { data } = await sb.from('votes').select('choice_1, choice_2')
      if (data) {
        setCounts(toCounts(data))
        setTotal(data.length)
      }
      setLoading(false)
    }
    fetchAll()

    const channel = sb
      .channel('votes-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, payload => {
        const row = payload.new as { choice_1: string; choice_2: string }
        setCounts(prev => ({
          ...prev,
          [row.choice_1]: (prev[row.choice_1] ?? 0) + 1,
          [row.choice_2]: (prev[row.choice_2] ?? 0) + 1,
        }))
        setTotal(prev => prev + 1)
      })
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [])

  const sorted = [...CASES].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))
  const max = Math.max(...Object.values(counts), 1)

  return (
    <div className="results-page">
      <header className="vote-header">
        <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={3000} height={734} style={{ height: 16, width: 'auto' }} priority />
      </header>

      <section className="results-hero">
        <h1 className="results-hed">Live results</h1>
        <p className="results-total">{loading ? '—' : total} {total === 1 ? 'vote' : 'votes'} cast</p>
      </section>

      <div className="results-list">
        {sorted.map((c, i) => {
          const count = counts[c.id] ?? 0
          const pct = Math.round((count / max) * 100)
          return (
            <div key={c.id} className={`results-row${i < 4 ? ' results-row--top' : ''}`}>
              <div className="results-rank">{i + 1}</div>
              <div className="results-thumb">
                <Image src={c.img} alt={c.name} fill sizes="56px" style={{ objectFit: 'contain' }} />
              </div>
              <div className="results-bar-wrap">
                <div className="results-name-row">
                  <span className="results-name">{c.name}</span>
                  <span className="results-count">{count}</span>
                </div>
                <div className="results-track">
                  <div className="results-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="results-live-badge">● Live</p>
    </div>
  )
}
