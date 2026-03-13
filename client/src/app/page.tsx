import Header from '@/components/Header'
import CategoryGrid from '@/components/CategoryGrid'
import ShapeSection from '@/components/ShapeSection'
import MaterialSection from '@/components/MaterialSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import WhyChooseUs from '@/components/WhyChooseUs'
import HowItWorks from '@/components/HowItWorks'
import BulkBanner from '@/components/BulkBanner'
import Testimonials from '@/components/Testimonials'
import InstagramShowcase from '@/components/InstagramShowcase'
import BlogPreview from '@/components/BlogPreview'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero/>
        <CategoryGrid />
        <ShapeSection />
        <MaterialSection />
        <FeaturedProducts />
        <WhyChooseUs />
        <HowItWorks />
        <BulkBanner />
        <Testimonials />
        <InstagramShowcase />
        <BlogPreview />
      </main>
      <Footer />
    </>
  )
}