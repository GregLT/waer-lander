'use client'

import { useEffect, useState, useMemo } from 'react'
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

type VoteRow = { choice_1: string; choice_2: string; choice_3: string; demographic: string }

function toCounts(rows: VoteRow[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const c of CASES) counts[c.id] = 0
  for (const row of rows) {
    if (counts[row.choice_1] !== undefined) counts[row.choice_1]++
    if (counts[row.choice_2] !== undefined) counts[row.choice_2]++
    if (counts[row.choice_3] !== undefined) counts[row.choice_3]++
  }
  return counts
}

export default function ResultsPage() {
  const [allVotes, setAllVotes] = useState<VoteRow[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()

    async function fetchAll() {
      const { data } = await sb.from('votes').select('choice_1, choice_2, choice_3, demographic')
      if (data) setAllVotes(data as VoteRow[])
      setLoading(false)
    }
    fetchAll()

    const channel = sb
      .channel('votes-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, payload => {
        const row = payload.new as VoteRow
        setAllVotes(prev => [...prev, row])
      })
      .subscribe()

    return () => { sb.removeChannel(channel) }
  }, [])

  // Distinct demographics, sorted alphabetically, Unknown last
  const demographics = useMemo(() => {
    const set = new Set(allVotes.map(v => v.demographic ?? 'Unknown'))
    set.delete('Unknown')
    return [...Array.from(set).sort(), 'Unknown']
  }, [allVotes])

  const filteredVotes = useMemo(() =>
    filter === 'All' ? allVotes : allVotes.filter(v => (v.demographic ?? 'Unknown') === filter),
    [allVotes, filter]
  )

  const counts = useMemo(() => toCounts(filteredVotes), [filteredVotes])
  const total = filteredVotes.length
  const unknownCount = filteredVotes.filter(v => (v.demographic ?? 'Unknown') === 'Unknown').length
  const unknownPct = total > 0 ? Math.round((unknownCount / total) * 100) : 0

  const sorted = [...CASES].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))
  const max = Math.max(...Object.values(counts), 1)

  return (
    <div className="results-page">
      <header className="vote-header">
        <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={3000} height={734} style={{ height: 16, width: 'auto' }} priority />
      </header>

      <section className="results-hero">
        <h1 className="results-hed">Live results</h1>
        <p className="results-total">{loading ? '—' : total} {total === 1 ? 'vote' : 'votes'} in view</p>
      </section>

      <div className="results-filter-row">
        <select
          className="results-filter-select"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All demographics</option>
          {demographics.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {filter === 'All' && total > 0 && (
          <span className="results-unknown-badge">
            {unknownCount} Unknown ({unknownPct}%)
          </span>
        )}
      </div>

      <div className="results-list">
        {sorted.map((c, i) => {
          const count = counts[c.id] ?? 0
          const barPct = Math.round((count / max) * 100)
          const sharePct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={c.id} className={`results-row${i < 3 ? ' results-row--top' : ''}`}>
              <div className="results-rank">{i + 1}</div>
              <div className="results-thumb">
                <Image src={c.img} alt={c.name} fill sizes="56px" style={{ objectFit: 'contain', objectPosition: 'bottom center' }} />
              </div>
              <div className="results-bar-wrap">
                <div className="results-name-row">
                  <span className="results-name">{c.name}</span>
                  <span className="results-count">{count} · {sharePct}%</span>
                </div>
                <div className="results-track">
                  <div className="results-fill" style={{ width: `${barPct}%` }} />
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
