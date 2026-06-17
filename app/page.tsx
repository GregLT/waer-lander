import SiteHeader from '@/components/SiteHeader'
import Hero from '@/components/Hero'
import Strap from '@/components/Strap'
import DuotoneStrip from '@/components/DuotoneStrip'
import JoinSection from '@/components/JoinSection'
import Manifesto from '@/components/Manifesto'
import SiteFooter from '@/components/SiteFooter'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Strap />
        <DuotoneStrip />
        <JoinSection />
        <Manifesto />
      </main>
      <SiteFooter />
    </>
  )
}
