'use client'

import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import Pagination from '@/components/Pagination'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export default function TvGenrePage() {
  const pathname = usePathname()
  const genre = pathname.split('/').pop()
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [bookmarkedShows, setBookmarkedShows] = useState([])
  const [overViewId, setOverViewId] = useState(null)

  const toggleOverView = (showId) => {
    setOverViewId((prevId) => (prevId === showId ? null : showId))
  }

  useEffect(() => {
    const fetchShowsByGenre = async () => {
      const genreId = getGenreId(decodeURIComponent(genre))
      if (genreId) {
        const url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&language=fa-IR&page=${currentPage}`
        try {
          const response = await fetch(url)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const data = await response.json()
          setShows(data.results || [])
          setTotalPages(data.total_pages)
        } catch (error) {
          console.error('Error fetching shows:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchShowsByGenre()

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    scrollToTop()

    // دریافت بوک‌مارک‌ها از localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedSeries')
    if (savedBookmarks) {
      setBookmarkedShows(JSON.parse(savedBookmarks))
    }
  }, [genre, currentPage])

  const getGenreNames = (genreIds) => {
    return genreIds.map(
      (id) => genreTranslations[id] || decodeURIComponent(genre)
    )
  }

  const getGenreId = (genreName) => {
    const genreIds = {
      اکشن: 10759,
      انیمیشن: 16,
      کمدی: 35,
      جنایی: 80,
      مستند: 99,
      درام: 18,
      خانوادگی: 10751,
      کودکانه: 10762,
      معما: 9648,
      اخبار: 10763,
      واقعیت: 10764,
      'تخیلی و فانتزی': 10765,
      'سریال روزانه': 10766,
      گفت‌وگو: 10767,
      'جنگ و سیاست': 10768,
      وسترن: 37,
    }
    return genreIds[genreName] || null
  }

  const genreTranslations = {
    // ترجمه‌های ژانرها
  }

  const toggleBookmark = (show) => {
    setBookmarkedShows((prev) => {
      const isBookmarked = prev.some((item) => item.id === show.id)
      let updatedBookmarks
      if (isBookmarked) {
        updatedBookmarks = prev.filter((item) => item.id !== show.id)
      } else {
        updatedBookmarks = [
          ...prev,
          {
            id: show.id,
            title: show.name,
            year: show.first_air_date
              ? new Date(show.first_air_date).getFullYear()
              : 'نامشخص',
            rating: show.vote_average ? show.vote_average.toFixed(1) : 'N/A',
            image: show.poster_path,
            origin_country: show.origin_country
              ? show.origin_country.join(', ')
              : 'نامشخص',
            language: show.original_language,
            overview: show.overview ? show.overview : 'مشخص نیست',
            episodes: show.number_of_episodes
              ? `${show.number_of_episodes} قسمت`
              : 'نامشخص',
          },
        ]
      }
      console.log('show =>', updatedBookmarks)

      localStorage.setItem('bookmarkedSeries', JSON.stringify(updatedBookmarks))
      return updatedBookmarks
    })
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="px-4">
      <h1 className="innerShadow bg-gradient-to-l from-gray-700 to-transparent hidden md:block w-full text-2xl font-bold rounded-2xl p-4">
        {genre ? `ژانر ${decodeURIComponent(genre)}` : 'دانلود و تماشا سریال'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 place-items-center">
        {shows.length > 0 ? (
          shows.map((show) => (
            <div
              key={show.id}
              className="min-w-[669px] max-w-[669px] relative rounded-lg shadow-md shadow-MyGray p-4 text-center overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start gap-4">
                <figure className="w-[50%] mx-auto lg:w-[55%]">
                  <Link
                    href={`/tvshow/${
                      genreTranslations[show.genre_ids[0]] ||
                      decodeURIComponent(genre)
                    }/${show.id}-${encodeURIComponent(show.name)}`}
                  >
                    <Image
                      width={200}
                      height={300}
                      className="rounded h-full w-full"
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                    />
                  </Link>
                </figure>
                <div className="w-full text-right space-y-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold mt-2">
                      دانلود سریال {show.name}
                    </h2>
                    <button onClick={() => toggleBookmark(show)}>
                      {bookmarkedShows.some((item) => item.id === show.id) ? (
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
                        value: `${show.vote_average.toFixed(1)}/10`,
                      },
                      {
                        label: 'ژانر:',
                        value: getGenreNames(show.genre_ids)
                          .slice(0, 1)
                          .join(', '),
                      },
                      {
                        label: 'محصول:',
                        value: show.origin_country
                          ? show.origin_country.join(', ')
                          : 'نامشخص',
                      },
                      { label: 'زبان:', value: show.original_language },
                      {
                        label: 'قسمت‌ها:',
                        value: show.number_of_episodes
                          ? `${show.number_of_episodes} قسمت`
                          : 'نامشخص',
                      },
                      {
                        label: 'سال انتشار:',
                        value: show.first_air_date
                          ? new Date(show.first_air_date).getFullYear()
                          : 'نامشخص',
                      },
                    ].map((item, index) => (
                      <p
                        key={index}
                        className="flex items-center gap-2 bg-MyGray/30 rounded-full p-2"
                      >
                        <span className="text-white text-sm lg:text-md font-bold">
                          {item.label}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {item.value}
                        </span>
                      </p>
                    ))}
                  </div>

                  <AnimatePresence>
                    {overViewId === show.id && (
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
                            onClick={() => toggleOverView(show.id)}
                          />
                        </div>
                        <small className="text-gray-300">
                          {show.overview || 'اطلاعاتی وجود ندارد.'}
                        </small>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="flex items-center gap-2 border border-MyGray px-4 py-2 rounded-full"
                      onClick={() => toggleOverView(show.id)}
                    >
                      خلاصه داستان
                      <FaChevronUp />
                    </button>
                    <button className="primary-button">
                      <Link
                        href={`/tvshow/${
                          genreTranslations[show.genre_ids[0]] ||
                          decodeURIComponent(genre)
                        }/${show.id}-${encodeURIComponent(show.name)}`}
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
          <div className="text-center py-40 text-xl text-gray-300 lg:-ml-96 lg:pr-96">
            هیچ سریالی یافت نشد.
          </div>
        )}
      </div>

      {/* کامپوننت پیجینیشن */}
      <Pagination
        currentPage={currentPage}
        totalItems={shows.length}
        onNext={() => setCurrentPage((prev) => prev + 1)}
        onPrev={() => setCurrentPage((prev) => prev - 1)}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Footer />
    </div>
  )
}
