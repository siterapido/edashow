import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AdBanners } from "@/components/ad-banners"
import { NewsGrid } from "@/components/news-grid"
import { Columnists } from "@/components/columnists"
import { Events } from "@/components/events"
import { LatestNews } from "@/components/latest-news"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AdBanners />
        <NewsGrid />
        <Columnists />
        <Events />
        <LatestNews />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
