import type { Metadata } from 'next'
import Image from 'next/image'
import InvestSection from '@/components/InvestSection'

export const metadata: Metadata = {
  title: 'Own a Piece of WAER — Investor Interest',
  description: 'Reserve your allocation in WAER.',
}

export default function InvestPage() {
  return (
    <div className="invest-page">
      <header className="invest-header">
        <Image
          src="/assets/WAER_Wordmark_Black.png"
          alt="WAER"
          width={3000}
          height={734}
          style={{ height: 16, width: 'auto' }}
          priority
        />
      </header>

      <section className="invest-banner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/invest-banner.png" alt="Own a Piece of WAER" />
      </section>

      <InvestSection />

      <section className="invest-disclaimer">
        <p>
          <strong>Investment Disclaimer.</strong> This page is provided for informational purposes
          only and does not constitute an offer to sell, or a solicitation of an offer to buy, any
          securities or investment product, in any jurisdiction. Any prospective investment in
          WAER is subject to separate legal documentation, due diligence, and eligibility
          requirements, and may only be made available to investors who meet applicable regulatory
          criteria. The value of investments can go down as well as up, and you may not get back
          the amount you invest. Past performance is not a reliable indicator of future results.
          This is not financial, legal, or tax advice — you should consult an independent,
          appropriately authorised financial adviser before making any investment decision. By
          submitting this form you are expressing interest only; no commitment to invest, and no
          obligation on WAER to accept any investment, is created.
        </p>
      </section>

      <footer className="invest-footer">
        <Image
          src="/assets/WAER_Wordmark_White.png"
          alt="WAER"
          width={3000}
          height={734}
          className="invest-footer-logo"
        />
        <span>© WAER 2026 — Made in UK</span>
      </footer>
    </div>
  )
}
