'use client'

import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

// آرایه برای ترجمه ژانرها به فارسی بر اساس شناسه‌ها

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

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [bookmarkedMovies, setBookmarkedMovies] = useState([])
  const [overViewId, setOverViewId] = useState(null)

  const toggleOverView = (movieId) => {
    if (overViewId === movieId) {
      setOverViewId(null) // برای بستن خلاصه داستان
    } else {
      setOverViewId(movieId) // نمایش خلاصه داستان برای سریال خاص
    }
  }

  // بارگذاری صفحه آخر از sessionStorage در useEffect
  useEffect(() => {
    const savedPage = sessionStorage.getItem('currentPage')
    if (savedPage) {
      setCurrentPage(parseInt(savedPage))
    }
  }, [])

  const fetchMovies = async (page) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=fa-IR`
    )
    const data = await response.json()
    setMovies(data.results)
    setTotalPages(data.total_pages)
  }

  const fetchGenres = async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    )
    const data = await response.json()
    setGenres(data.genres)
  }

  useEffect(() => {
    fetchMovies(currentPage)
    fetchGenres()

    const savedBookmarks = localStorage.getItem('bookmarkedMovies')
    if (savedBookmarks) {
      setBookmarkedMovies(JSON.parse(savedBookmarks))
    }

    // ذخیره‌سازی صفحه جاری در sessionStorage
    sessionStorage.setItem('currentPage', currentPage)

    // اسکرول آرام به بالا
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    scrollToTop()
  }, [currentPage])

  const getGenreNames = (genreIds) => {
    return genreIds.map((id) => genreTranslations[id] || 'نامشخص')
  }

  const toggleBookmark = (movie) => {
    setBookmarkedMovies((prev) => {
      const isBookmarked = prev.some((item) => item.id === movie.id)
      let updatedBookmarks
      if (isBookmarked) {
        // اگر قبلاً بوک‌مارک شده، حذفش کن
        updatedBookmarks = prev.filter((item) => item.id !== movie.id)
      } else {
        // در غیر این صورت، اضافه کن
        updatedBookmarks = [
          ...prev,
          {
            id: movie.id,
            title: movie.title,
            year: movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : 'نامشخص',
            rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
            image: movie.poster_path,
            origin_country: movie.origin_country
              ? movie.origin_country.join(', ')
              : 'نامشخص',
            language: movie.original_language,
            overview: movie.overview ? movie.overview : 'مشخص نیست',
            runtime: movie.runtime ? `${movie.runtime} دقیقه` : 'نامشخص',
          },
        ]
      }

      // ذخیره‌سازی بوکمارک‌ها در localStorage
      localStorage.setItem('bookmarkedMovies', JSON.stringify(updatedBookmarks))
      return updatedBookmarks
    })
  }

  return (
    <div className="px-4">
      <div className="md:hidden mb-8">
        <Search />
      </div>

      <h1
        className="hidden md:block w-max mx-auto text-2xl font-bold border-b-2 border-MyGray pb-4"
        onClick={() => {
          console.log(movies)
        }}
      >
        دانلود و تماشا فیلم
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {movies
          .filter((movie) => !movie.adult) // فیلتر کردن فیلم‌های بزرگسال
          .map((movie) => (
            <div
              key={movie.id}
              className="relative rounded-lg shadow-md shadow-MyGray p-4 text-center overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <figure className="w-[50%] mx-auto lg:w-[55%]">
                  <Link
                    href={`/movies/${
                      genreTranslations[movie.genre_ids[0]] || 'نامشخص'
                    }/${movie.id}-${encodeURIComponent(movie.title)}`}
                  >
                    <Image
                      width={200}
                      height={300}
                      className="rounded h-full w-full"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                  </Link>
                </figure>

                <div className="w-full text-right space-y-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold mt-2">
                      دانلود فیلم {movie.title}
                    </h2>
                    <button
                      key={movie.id}
                      onClick={() => toggleBookmark(movie)}
                    >
                      {bookmarkedMovies.some((item) => item.id === movie.id) ? (
                        <MdBookmark className="h-8 w-8" />
                      ) : (
                        <MdBookmarkBorder className="h-8 w-8" />
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 my-6">
                    {[
                      {
                        label: 'امتیاز:',
                        value: `${movie.vote_average.toFixed(1)}/10`,
                      },
                      {
                        label: 'ژانر:',
                        value: getGenreNames(movie.genre_ids)
                          .slice(0, 2)
                          .join(', '),
                      },
                      {
                        label: 'محصول:',
                        value: movie.origin_country
                          ? movie.origin_country.join(', ')
                          : 'نامشخص',
                      },
                      {
                        label: 'زبان:',
                        value: movie.original_language,
                      },
                      {
                        label: 'مدت زمان:',
                        value: movie.runtime
                          ? `${movie.runtime} دقیقه`
                          : 'نامشخص',
                      },
                      {
                        label: 'سال انتشار:',
                        value: movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : 'نامشخص',
                      },
                    ].map((item, index) => (
                      <p
                        key={index}
                        className="flex items-center gap-2 bg-MyGray/30 rounded-full p-2"
                      >
                        <span className="text-white text-sm lg:text-md font-bold">
                          {item.label}
                        </span>{' '}
                        <span className="text-gray-400 text-sm">
                          {item.value}
                        </span>
                      </p>
                    ))}
                  </div>

                  {/* انیمیشن نمایش و خروج خلاصه داستان */}
                  <AnimatePresence>
                    {overViewId === movie.id && (
                      <motion.div
                        initial={{ opacity: 0, translateY: '100%' }}
                        animate={{ opacity: 1, translateY: '0%' }}
                        exit={{ opacity: 0, translateY: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="absolute w-full p-4 bg-secondary rounded-t-lg text-white overflow-hidden"
                        style={{ bottom: '0', right: '0' }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xl font-bold">خلاصه داستان</p>
                          <FaChevronDown
                            className="h-6 w-6 cursor-pointer"
                            onClick={() => toggleOverView(movie.id)}
                          />
                        </div>
                        <small className="text-gray-300">
                          {movie.overview ? movie.overview : 'مشخص نیست'}
                        </small>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="flex items-center gap-2 border border-MyGray px-4 py-2 rounded-full"
                      onClick={() => toggleOverView(movie.id)}
                    >
                      خلاصه داستان
                      <FaChevronUp />
                    </button>
                    <button className="primary-button">
                      <Link
                        href={`/movies/${
                          genreTranslations[movie.genre_ids[0]] || 'نامشخص'
                        }/${movie.id}-${encodeURIComponent(movie.title)}`}
                      >
                        ادامه / دانلود
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {!movies.length && <Loader />}
      </div>
      {/* کامپوننت پیجینیشن */}
      <Pagination
        currentPage={currentPage}
        totalItems={movies.length} // ارسال تعداد فیلم‌ها به عنوان prop
        onNext={() => setCurrentPage((prev) => prev + 1)}
        onPrev={() => setCurrentPage((prev) => prev - 1)}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Footer />
    </div>
  )
}
