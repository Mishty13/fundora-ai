import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'
import FounderFeatures from '../components/landing/FounderFeatures'
import InvestorFeatures from '../components/landing/InvestorFeatures'
import IntelligenceSection from '../components/landing/IntelligenceSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'
function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-surface-950 text-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <FounderFeatures />
        <InvestorFeatures />
        <IntelligenceSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
export default LandingPage
