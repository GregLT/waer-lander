const rows = [
  {
    num: 'K.01',
    title: 'One case. Fourteen moods.',
    desc: 'One case designed to adapt.',
    tag: 'The object',
  },
  {
    num: 'K.02',
    title: 'Paired. Not signed.',
    desc: 'Curate, layer and rotate.',
    tag: 'The system',
  },
  {
    num: 'K.03',
    title: 'Ten millilitres. Full-bodied.',
    desc: 'Made for life in motion.',
    tag: 'The vial',
  },
  {
    num: 'K.04',
    title: 'Refillable. By design.',
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
            <div className="row-title">{r.title}</div>
            <div className="row-desc" dangerouslySetInnerHTML={{ __html: r.desc }} />
            <div className="row-tag">{r.tag}</div>
          </div>
        ))}
      </div>
    </>
  )
}
