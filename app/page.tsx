import SiteHeader from '@/components/SiteHeader'
import Hero from '@/components/Hero'
import SignupSection from '@/components/SignupSection'
import Strap from '@/components/Strap'
import DuotoneStrip from '@/components/DuotoneStrip'
import SiteFooter from '@/components/SiteFooter'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <SignupSection />
        <Strap />
        <DuotoneStrip />
      </main>
      <SiteFooter />
    </>
  )
}
