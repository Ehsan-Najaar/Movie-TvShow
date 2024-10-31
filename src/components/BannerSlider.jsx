'use client'

import Loader from '@/components/Loader'
import { useFetchMovies } from '@/hooks/useFetchMovies'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const popularMoviesURL = `${BASE_URL}/movie/popular?api_key=${API_KEY}`

export default function BannerSlider() {
  const { data: movies, loading, error } = useFetchMovies(popularMoviesURL)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const swiperRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (movies && movies.length > 0) {
      setActiveIndex(2) // تنظیم بنر وسطی به عنوان اکتیو
      swiperRef.current?.slideTo(2, 0) // انتقال به بنر وسطی در ابتدای بارگذاری
    }
  }, [movies])

  const genreTranslations = {
    28: 'اکشن',
    12: 'ماجراجویی',
    16: 'انیمیشن',
    35: 'کمدی',
    80: 'جنایی',
    99: 'مستند',
    18: 'درام',
    10751: 'خانوادگی',
    14: 'فانتزی',
    36: 'تاریخی',
    27: 'ترسناک',
    10402: 'موسیقی',
    9648: 'معما',
    10749: 'رمانتیک',
    878: 'علمی تخیلی',
    10770: 'فیلم تلویزیونی',
    53: 'هیجان‌انگیز',
    10752: 'جنگی',
    37: 'وسترن',
  }

  if (loading) return <Loader />

  if (error)
    return (
      <div className="text-center text-red-500">خطا در بارگذاری داده‌ها</div>
    )

  return (
    <div className="relative w-full h-96 grid place-items-center lg:h-[550px] overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        pagination={isLargeScreen ? { clickable: true } : false}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="h-[300px] lg:h-[550px] w-full"
        style={{ perspective: '1200px' }}
      >
        {movies.map((movie, index) => {
          const isActive = index === activeIndex

          return (
            <SwiperSlide key={movie.id}>
              <div
                className={`relative transition-all h-[300px] lg:w-full lg:h-[500px] duration-500 ease-in-out ${
                  isActive
                    ? 'lg:w-[180%] w-[200%] md:w-[140%] sm:w-[160%] z-20 scale-100 -mr-16 md:-mr-12 lg:-mr-0'
                    : 'w-[80%] scale-[75%]'
                } mx-auto rounded-3xl overflow-hidden group shadow-lg`}
                onMouseOver={() => {
                  console.log(movie)
                }}
              >
                <Link
                  href={`/movies/${
                    genreTranslations[movie.genre_ids[0]] || 'نامشخص'
                  }/${movie.id}-${encodeURIComponent(movie.title)}`}
                >
                  <Image
                    width={1200}
                    height={600}
                    src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div
                    dir="ltr"
                    className="absolute bottom-5 left-0 p-6 w-full space-y-4 translate-y-8 opacity-100"
                  >
                    {isActive && (
                      <div className="hidden lg:block">
                        <div className="absolute h-full w-full bottom-0 left-0 bg-gradient-to-t from-black to-transparent -z-10"></div>
                        <p className="flex items-center gap-1">
                          <span className="text-yellow-400 text-2xl font-semibold">
                            {movie.vote_average !== undefined
                              ? movie.vote_average.toFixed(1)
                              : 'N/A'}
                          </span>
                          <small className="text-sm">{'/10'}</small>
                          <FaStar className="h-4 w-4 mb-1 ml-2 text-yellow-400" />
                        </p>
                        <h2 className="text-white text-3xl font-bold mb-2">
                          {movie.title}{' '}
                          {new Date(movie.release_date).getFullYear()}
                        </h2>
                        <button className="primary-outline-button">
                          <Link href={`movies/${movie.id}-${movie.title}`}>
                            تماشا / دانلود
                          </Link>
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
