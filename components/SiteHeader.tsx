import Image from 'next/image'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-logo">
        <Image
          src="/assets/WAER_Wordmark_Black.png"
          alt="WAER"
          width={3000}
          height={734}
          style={{ height: 18, width: 'auto' }}
          priority
        />
      </div>
    </header>
  )
}
