const rows = [
  {
    num: 'n.01',
    title: 'One case. Fourteen moods.',
    desc: 'A single refillable case, debossed with the monogram. Vials seat in, vials swap out. Carried like a decision — changed like an outfit.',
    tag: 'The object',
  },
  {
    num: 'n.02',
    title: 'Paired, not signed.',
    desc: 'Every scent belongs to two olfactory families — a duotone, not a monogram. Wear one. Layer two. Rotate through the week.',
    tag: 'The system',
  },
  {
    num: 'n.03',
    title: 'Ten millilitres. Full-bodied.',
    desc: 'Our signature vial format. Portable, refillable, long-lasting. Developed with perfumers in Grasse — made in France, built to last.',
    tag: 'The vial',
  },
  {
    num: 'n.04',
    title: 'Refillable by design.',
    desc: 'Buy the case once. The scents rotate. No throwaway glass, no drawers of half-finished bottles — only the part you&rsquo;re wearing today.',
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
