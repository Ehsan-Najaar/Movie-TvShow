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
  10759: 'اکشن',
  16: 'انیمیشن',
  35: 'کمدی',
  80: 'جنایی',
  99: 'مستند',
  18: 'درام',
  10751: 'خانوادگی',
  10762: 'کودکانه',
  9648: 'معما',
  10763: 'اخبار',
  10764: 'واقعیت',
  10765: 'علمی تخیلی و فانتزی',
  10766: 'سریال روزانه',
  10767: 'گفت‌وگو',
  10768: 'جنگ و سیاست',
  37: 'وسترن',
}

export default function Series() {
  const [series, setSeries] = useState([])
  const [genres, setGenres] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [bookmarkedSeries, setBookmarkedSeries] = useState([])
  const [overViewId, setOverViewId] = useState(null)

  const toggleOverView = (serieId) => {
    if (overViewId === serieId) {
      setOverViewId(null) // برای بستن خلاصه داستان
    } else {
      setOverViewId(serieId) // نمایش خلاصه داستان برای سریال خاص
    }
  }

  // بارگذاری صفحه آخر از sessionStorage در useEffect
  useEffect(() => {
    const savedPage = sessionStorage.getItem('currentPage')
    if (savedPage) {
      setCurrentPage(parseInt(savedPage))
    }
  }, [])

  const fetchSeries = async (page) => {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}&language=fa-IR`
    )
    const data = await response.json()
    setSeries(data.results)
    setTotalPages(data.total_pages)
  }

  const fetchGenres = async () => {
    const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`)
    const data = await response.json()
    setGenres(data.genres)
  }

  useEffect(() => {
    fetchSeries(currentPage)
    fetchGenres()

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

  const toggleBookmark = (serie) => {
    setBookmarkedSeries((prev) => {
      const isBookmarked = prev.some((item) => item.id === serie.id)
      let updatedBookmarks
      if (isBookmarked) {
        // اگر قبلاً بوک‌مارک شده، حذفش کن
        updatedBookmarks = prev.filter((item) => item.id !== serie.id)
      } else {
        // در غیر این صورت، اضافه کن
        updatedBookmarks = [
          ...prev,
          {
            id: serie.id,
            name: serie.name,
            year: serie.first_air_date
              ? new Date(serie.first_air_date).getFullYear()
              : 'نامشخص',
            rating: serie.vote_average.toFixed(1),
            image: serie.poster_path,
            origin_country: serie.origin_country.join(', '),
            language: serie.original_language,
            overview: serie.overview ? serie.overview : 'مشخص نیست',
            runtime:
              serie.episode_run_time && serie.episode_run_time.length > 0
                ? `${serie.episode_run_time[0]} دقیقه`
                : 'نامشخص',
          },
        ]
      }

      // ذخیره‌سازی بوک مارک‌ها در localStorage
      localStorage.setItem('bookmarkedSeries', JSON.stringify(updatedBookmarks))
      console.log(updatedBookmarks)
      return updatedBookmarks
    })
  }

  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedSeries')
    if (savedBookmarks) {
      setBookmarkedSeries(JSON.parse(savedBookmarks))
    }
  }, [])

  return (
    <div className="px-4">
      <div className="md:hidden mb-8">
        <Search />
      </div>
      <h1 className="hidden md:block w-max mx-auto text-2xl font-bold border-b-2 border-MyGray pb-4">
        دانلود و تماشا سریال
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {series.length > 0 ? (
          series.map((serie) => (
            <div
              key={serie.id}
              className="relative rounded-lg shadow-sm shadow-MyGray p-4 text-center overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <figure className="w-[50%] mx-auto lg:w-[55%]">
                  <Link
                    href={`/tvshow/${
                      serie.genre_ids && serie.genre_ids.length > 0
                        ? genreTranslations[serie.genre_ids[0]] || 'نامشخص' // Use the first genre if it exists
                        : 'نامشخص' // Fallback in case genre_ids is not available
                    }/${serie.id}-${encodeURIComponent(serie.name)}`}
                  >
                    <Image
                      width={200}
                      height={300}
                      className="rounded h-full w-full"
                      src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`}
                      alt={serie.name}
                    />
                  </Link>
                </figure>

                <div className="w-full text-right space-y-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      دانلود سریال {serie.name}
                    </h2>
                    <button
                      key={serie.id}
                      onClick={() => toggleBookmark(serie)}
                    >
                      {bookmarkedSeries.some((item) => item.id === serie.id) ? (
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
                        value: `${serie.vote_average.toFixed(1)}/10`,
                      },
                      {
                        label: 'ژانر:',
                        value: getGenreNames(serie.genre_ids)
                          .slice(0, 2)
                          .join(', '),
                      },
                      {
                        label: 'محصول:',
                        value: serie.origin_country.join(', '),
                      },
                      {
                        label: 'زبان:',
                        value: serie.original_language,
                      },
                      {
                        label: 'مدت زمان:',
                        value:
                          serie.episode_run_time &&
                          serie.episode_run_time.length > 0
                            ? `${serie.episode_run_time[0]} دقیقه`
                            : 'نامشخص',
                      },
                      {
                        label: 'سال انتشار:',
                        value: serie.first_air_date
                          ? new Date(serie.first_air_date).getFullYear()
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
                    {overViewId === serie.id && (
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
                            onClick={() => toggleOverView(serie.id)}
                          />
                        </div>
                        <small className="text-gray-300">
                          {serie.overview ? serie.overview : 'مشخص نیست'}
                        </small>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="flex items-center gap-2 border border-MyGray px-4 py-2 rounded-full"
                      onClick={() => toggleOverView(serie.id)}
                    >
                      خلاصه داستان
                      <FaChevronUp />
                    </button>
                    <button className="primary-button">
                      <Link
                        href={`/tvshow/${
                          serie.genre_ids && serie.genre_ids.length > 0
                            ? genreTranslations[serie.genre_ids[0]] || 'نامشخص' // Use the first genre if it exists
                            : 'نامشخص' // Fallback in case genre_ids is not available
                        }/${serie.id}-${encodeURIComponent(serie.name)}`}
                      >
                        ادامه / دانلود
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Loader />
        )}
      </div>
      {/* کامپوننت پیجینیشن */}

      <Pagination
        currentPage={currentPage}
        totalItems={series.length} // ارسال تعداد هنرمندان به عنوان prop
        onNext={() => setCurrentPage((prev) => prev + 1)}
        onPrev={() => setCurrentPage((prev) => prev - 1)}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <Footer />
    </div>
  )
}
