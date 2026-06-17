const rows = [
  {
    num: 'K.01',
    title: 'ONE CASE.<br />FOURTEEN MOODS.',
    desc: 'For the version of you showing up today.',
    tag: 'The object',
  },
  {
    num: 'K.02',
    title: 'NO SIGNATURE.<br />JUST ROTATION.',
    desc: 'Curate. Layer. Rotate.',
    tag: 'The system',
  },
  {
    num: 'K.03',
    title: 'TEN MILLILITRES.<br />FULL-BODIED.',
    desc: 'Made to move with you.',
    tag: 'The vial',
  },
  {
    num: 'K.04',
    title: 'REFILLABLE.<br />BY DESIGN.',
    desc: 'Less waste. More wardrobe.',
    tag: 'The principle',
  },
]

export default function Manifesto() {
  return (
    <>
      <section className="manifesto">
        <div className="eyebrow">The System</div>
        <h2>Built to be lived in.</h2>
      </section>
      <div className="manifesto-rows">
        {rows.map((r) => (
          <div key={r.num} className="manifesto-row">
            <div className="row-num">{r.num}</div>
            <div className="row-title" dangerouslySetInnerHTML={{ __html: r.title }} />
            <div className="row-desc" dangerouslySetInnerHTML={{ __html: r.desc }} />
            <div className="row-tag">{r.tag}</div>
          </div>
        ))}
      </div>
    </>
  )
}
