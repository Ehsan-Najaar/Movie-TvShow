import BannerSlider from '@/components/BannerSlider'
import Footer from '@/components/Footer'
import MoviesList from '@/components/MoviesList'
import Search from '@/components/Search'

export default function Home() {
  return (
    <div className="space-y-2">
      <div className="md:hidden px-4">
        <Search />
      </div>
      <BannerSlider />
      <MoviesList />
      <Footer />
    </div>
  )
}
