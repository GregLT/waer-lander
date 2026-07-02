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
type WardrobeRow = {
  q1_starter: string | null
  q2_subscription: string | null
  q3_cadence: string | null
  q3_buy_timing: string | null
  q4_price_reaction: string | null
  q4_preferred_price: string | null
  q4_bundle_shown: string | null
  q5_purchase_intent: string | null
  survey_version: string | null
  customer_demographic: string | null
}

const BUNDLE_LABELS_V2: Record<string, string> = {
  'case-1': 'Case + 1 Fragrance — £20 sub / £25 one-off',
  'case-2': 'Case + 2 Fragrances — £35 sub / £42 one-off',
  'case-3': 'Case + 3 Fragrances — £42 sub / £50 one-off',
}

const BUNDLE_LABELS_V1: Record<string, string> = {
  'case-1': 'Case + 1 Fragrance — £35 (no sub/one-off stated)',
  'case-2': 'Case + 2 Fragrances — £40 (no sub/one-off stated)',
  'case-3': 'Case + 3 Fragrances — £45 (no sub/one-off stated)',
}

const VERSION_TABS = [
  { key: 'all', label: 'All responses' },
  { key: 'v2', label: 'v2 — current pricing' },
  { key: 'v1-price-unclear', label: 'v1 — old pricing' },
]

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

function countField(rows: WardrobeRow[], field: keyof WardrobeRow): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const row of rows) {
    const val = row[field]
    if (val) counts[val] = (counts[val] ?? 0) + 1
  }
  return counts
}

function QuestionBreakdown({ label, counts, total }: { label: string; counts: Record<string, number>; total: number }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (!entries.length) return null
  const max = Math.max(...entries.map(e => e[1]), 1)
  return (
    <div className="wardrobe-q-block">
      <p className="wardrobe-q-label">{label}</p>
      {entries.map(([key, count]) => {
        const barPct = Math.round((count / max) * 100)
        const sharePct = total > 0 ? Math.round((count / total) * 100) : 0
        return (
          <div key={key} className="results-bar-wrap" style={{ marginBottom: 8 }}>
            <div className="results-name-row">
              <span className="results-name">{key}</span>
              <span className="results-count">{count} · {sharePct}%</span>
            </div>
            <div className="results-track">
              <div className="results-fill" style={{ width: `${barPct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PreferredPrices({ rows, bundleLabels }: { rows: WardrobeRow[]; bundleLabels: Record<string, string> }) {
  const byBundle = useMemo(() => {
    const result: Record<string, string[]> = {}
    for (const row of rows) {
      if (!row.q4_preferred_price?.trim() || !row.q4_bundle_shown) continue
      if (!result[row.q4_bundle_shown]) result[row.q4_bundle_shown] = []
      result[row.q4_bundle_shown].push(row.q4_preferred_price.trim())
    }
    return result
  }, [rows])

  const bundles = ['case-1', 'case-2', 'case-3'].filter(b => byBundle[b]?.length)
  if (!bundles.length) return null

  return (
    <div className="wardrobe-q-block">
      <p className="wardrobe-q-label">What price would they pay?</p>
      {bundles.map(bundle => (
        <div key={bundle} style={{ marginBottom: 'var(--space-s)' }}>
          <p style={{ fontSize: 'var(--type-xs)', color: 'var(--color-text-40)', margin: '0 0 4px', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {bundleLabels[bundle]}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {byBundle[bundle].map((price, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--type-s)',
                border: '1px solid var(--rule)',
                borderRadius: 4,
                padding: '2px 10px',
                color: 'var(--color-text)',
              }}>{price}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ResultsPage() {
  const [allVotes, setAllVotes] = useState<VoteRow[]>([])
  const [allWardrobe, setAllWardrobe] = useState<WardrobeRow[]>([])
  const [filter, setFilter] = useState('All')
  const [versionTab, setVersionTab] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = getSupabase()

    async function fetchAll() {
      const [votesRes, wardrobeRes] = await Promise.all([
        sb.from('votes').select('choice_1, choice_2, choice_3, demographic'),
        sb.from('wardrobe_responses_v2').select('q1_starter, q2_subscription, q3_cadence, q3_buy_timing, q4_price_reaction, q4_preferred_price, q4_bundle_shown, q5_purchase_intent, survey_version, customer_demographic'),
      ])
      if (votesRes.data) setAllVotes(votesRes.data as VoteRow[])
      if (wardrobeRes.data) setAllWardrobe(wardrobeRes.data as WardrobeRow[])
      setLoading(false)
    }
    fetchAll()

    const sb2 = getSupabase()
    const voteChannel = sb2
      .channel('votes-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, payload => {
        setAllVotes(prev => [...prev, payload.new as VoteRow])
      })
      .subscribe()

    const wardrobeChannel = sb2
      .channel('wardrobe-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wardrobe_responses_v2' }, payload => {
        setAllWardrobe(prev => [...prev, payload.new as WardrobeRow])
      })
      .subscribe()

    return () => {
      sb2.removeChannel(voteChannel)
      sb2.removeChannel(wardrobeChannel)
    }
  }, [])

  const demographics = useMemo(() => {
    const set = new Set<string>()
    allVotes.forEach(v => set.add(v.demographic ?? 'Unknown'))
    allWardrobe.forEach(w => set.add(w.customer_demographic ?? 'Unknown'))
    set.delete('Unknown')
    return [...Array.from(set).sort(), 'Unknown']
  }, [allVotes, allWardrobe])

  const filteredVotes = useMemo(() =>
    filter === 'All' ? allVotes : allVotes.filter(v => (v.demographic ?? 'Unknown') === filter),
    [allVotes, filter]
  )

  const filteredWardrobe = useMemo(() => {
    let rows = filter === 'All' ? allWardrobe : allWardrobe.filter(w => (w.customer_demographic ?? 'Unknown') === filter)
    if (versionTab !== 'all') rows = rows.filter(w => (w.survey_version ?? 'v1-price-unclear') === versionTab)
    return rows
  }, [allWardrobe, filter, versionTab])

  const counts = useMemo(() => toCounts(filteredVotes), [filteredVotes])
  const voteTotal = filteredVotes.length
  const unknownCount = filteredVotes.filter(v => (v.demographic ?? 'Unknown') === 'Unknown').length
  const unknownPct = voteTotal > 0 ? Math.round((unknownCount / voteTotal) * 100) : 0

  const sorted = [...CASES].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))
  const max = Math.max(...Object.values(counts), 1)

  const bundleLabels = versionTab === 'v1-price-unclear' ? BUNDLE_LABELS_V1 : BUNDLE_LABELS_V2

  const wTotal = filteredWardrobe.length
  const q1Counts = useMemo(() => countField(filteredWardrobe, 'q1_starter'), [filteredWardrobe])
  const q2Counts = useMemo(() => countField(filteredWardrobe, 'q2_subscription'), [filteredWardrobe])
  const q3Counts = useMemo(() => countField(filteredWardrobe, 'q3_cadence'), [filteredWardrobe])
  const q3bCounts = useMemo(() => countField(filteredWardrobe, 'q3_buy_timing'), [filteredWardrobe])
  const q5Counts = useMemo(() => countField(filteredWardrobe, 'q5_purchase_intent'), [filteredWardrobe])

  const q4ByBundle = useMemo(() => {
    const result: Record<string, Record<string, number>> = {}
    for (const row of filteredWardrobe) {
      if (!row.q4_price_reaction || !row.q4_bundle_shown) continue
      if (!result[row.q4_bundle_shown]) result[row.q4_bundle_shown] = {}
      const r = result[row.q4_bundle_shown]
      r[row.q4_price_reaction] = (r[row.q4_price_reaction] ?? 0) + 1
    }
    return result
  }, [filteredWardrobe])

  return (
    <div className="results-page">
      <header className="vote-header">
        <Image src="/assets/WAER_Wordmark_Black.png" alt="WAER" width={3000} height={734} style={{ height: 16, width: 'auto' }} priority />
      </header>

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

        {filter === 'All' && voteTotal > 0 && (
          <span className="results-unknown-badge">
            {unknownCount} Unknown ({unknownPct}%)
          </span>
        )}
      </div>

      {/* Case vote results */}
      <section className="results-hero">
        <h1 className="results-hed">Case vote</h1>
        <p className="results-total">{loading ? '—' : voteTotal} {voteTotal === 1 ? 'vote' : 'votes'} in view</p>
      </section>

      <div className="results-list">
        {sorted.map((c, i) => {
          const count = counts[c.id] ?? 0
          const barPct = Math.round((count / max) * 100)
          const sharePct = voteTotal > 0 ? Math.round((count / voteTotal) * 100) : 0
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

      {/* Wardrobe survey results */}
      <section className="results-hero" style={{ paddingTop: 'var(--space-xl)', borderTop: '1px solid var(--rule)' }}>
        <h1 className="results-hed">Wardrobe survey</h1>
        <p className="results-total">{loading ? '—' : wTotal} {wTotal === 1 ? 'response' : 'responses'} in view</p>
      </section>

      {/* Version tabs */}
      <div className="results-version-tabs">
        {VERSION_TABS.map(t => (
          <button
            key={t.key}
            className={`results-version-tab${versionTab === t.key ? ' results-version-tab--active' : ''}`}
            onClick={() => setVersionTab(t.key)}
          >{t.label}</button>
        ))}
      </div>

      <div className="results-list" style={{ display: 'block' }}>
        {wTotal === 0 && !loading ? (
          <p style={{ color: 'var(--color-text-40)', fontSize: 'var(--type-s)' }}>No responses yet.</p>
        ) : (
          <>
            <QuestionBreakdown label="Starter set" counts={q1Counts} total={wTotal} />
            <QuestionBreakdown label="Automatic refills" counts={q2Counts} total={wTotal} />
            {Object.keys(q3Counts).length > 0 && (
              <QuestionBreakdown label="Refill cadence (subscribers)" counts={q3Counts} total={Object.values(q3Counts).reduce((a, b) => a + b, 0)} />
            )}
            {Object.keys(q3bCounts).length > 0 && (
              <QuestionBreakdown label="How they'd buy refills (non-subscribers)" counts={q3bCounts} total={Object.values(q3bCounts).reduce((a, b) => a + b, 0)} />
            )}
            {['case-1', 'case-2', 'case-3'].map(bundle => {
              const bundleCounts = q4ByBundle[bundle]
              if (!bundleCounts || !Object.keys(bundleCounts).length) return null
              const total = Object.values(bundleCounts).reduce((a, b) => a + b, 0)
              return <QuestionBreakdown key={bundle} label={`Price reaction — ${bundleLabels[bundle]}`} counts={bundleCounts} total={total} />
            })}
            <PreferredPrices rows={filteredWardrobe} bundleLabels={bundleLabels} />
            {Object.keys(q5Counts).length > 0 && (
              <QuestionBreakdown label="Would buy at launch" counts={q5Counts} total={Object.values(q5Counts).reduce((a, b) => a + b, 0)} />
            )}
          </>
        )}
      </div>

      <p className="results-live-badge">● Live</p>
    </div>
  )
}
