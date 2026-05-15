const cells = [
  { bg: 'linear-gradient(to right, #8CB07D 50%, #E82020 50%)', wm: '#E82020', wmBlend: 'screen', tag: '#111', label: 'n.01' },
  { bg: 'linear-gradient(to right, #E050B0 50%, #8CB07D 50%)', wm: '#fff',    wmBlend: 'normal', tag: '#fff', label: 'n.04' },
  { bg: 'linear-gradient(to right, #B06820 50%, #F0D080 50%)', wm: '#111',    wmBlend: 'normal', tag: '#111', label: 'n.09' },
  { bg: 'linear-gradient(to right, #607078 50%, #E050B0 50%)', wm: '#F7CDE6', wmBlend: 'normal', tag: '#fff', label: 'n.07' },
  { bg: 'linear-gradient(to right, #4A90C8 50%, #D8E040 50%)', wm: '#111',    wmBlend: 'normal', tag: '#111', label: 'n.12' },
  { bg: 'linear-gradient(to right, #1A5030 50%, #68A850 50%)', wm: '#F5F1EA', wmBlend: 'normal', tag: '#F5F1EA', label: 'n.03' },
  { bg: 'linear-gradient(to right, #387888 50%, #40C8A0 50%)', wm: '#111',    wmBlend: 'normal', tag: '#111', label: 'n.11' },
  { bg: 'linear-gradient(to right, #761205 50%, #B06820 50%)', wm: '#F0D080', wmBlend: 'normal', tag: '#F0D080', label: 'n.15' },
]

export default function DuotoneStrip() {
  return (
    <div className="duotone-strip" aria-hidden="true">
      {cells.map((c) => (
        <div key={c.label} className="duotone-cell" style={{ background: c.bg }}>
          <span
            className="duotone-wm"
            style={{ color: c.wm, mixBlendMode: c.wmBlend as React.CSSProperties['mixBlendMode'] }}
          >
            WAER
          </span>
          <span className="duotone-tag" style={{ color: c.tag }}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  )
}
