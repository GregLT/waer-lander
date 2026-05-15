const questions = [
  {
    q: 'When do the doors open?',
    a: "Autumn / Winter 2026. The waitlist gets forty-eight hours of exclusive access before anything is public, and the first hundred cases are reserved for the founding rotation.",
    open: false,
  },
  {
    q: 'What arrives in the box?',
    a: "One case, three vials of your choosing, and a single-fold card with the pairing notes. The case is yours for life. Vials rotate through the seasons — refill, swap, layer, or save.",
    open: true,
  },
  {
    q: 'How long does a vial last?',
    a: "A 10ml vial holds roughly 160 sprays — six to eight hours of longevity on skin. Most wearers rotate through two or three in a season.",
    open: false,
  },
  {
    q: 'Where is it made?',
    a: "France, in partnership with two independent perfumery houses in Grasse and Versailles. 100% natural eau de parfum, vegan, never tested on animals.",
    open: false,
  },
  {
    q: 'Can I change my mind?',
    a: "Always. Unsubscribe from the list with one click. If you've ordered, thirty days to return — we cover the postage.",
    open: false,
  },
]

export default function FAQSection() {
  return (
    <section className="faq">
      <div className="faq-head">
        <h3>A few things, before you ask.</h3>
        <p>
          We trust you to keep up. But if anything&rsquo;s unclear, here&rsquo;s the short
          answer. For anything else, write to us — a real person answers.
        </p>
      </div>
      {questions.map(({ q, a, open }) => (
        <details key={q} className="faq-q" open={open}>
          <summary>
            {q} <span className="faq-plus">+</span>
          </summary>
          <div className="faq-body">{a}</div>
        </details>
      ))}
    </section>
  )
}
