'use client'

import DashboardMenu from '@/components/DashboardMenu'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaBookmark, FaStar } from 'react-icons/fa'
import { FiChevronLeft } from 'react-icons/fi'

export default function BookMarked() {
  const [bookmarkedSeries, setBookmarkedSeries] = useState([])
  const [bookmarkedMovies, setBookmarkedMovies] = useState([])
  const [bookmarkedArtists, setBookmarkedArtists] = useState([])

  const [activeTab, setActiveTab] = useState('tvshow') // تغییر به 'tvshow'

  const genreTranslations = {
    // ترجمه‌های ژانرها
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSeries =
        JSON.parse(localStorage.getItem('bookmarkedSeries')) || []
      const savedMovies =
        JSON.parse(localStorage.getItem('bookmarkedMovies')) || []
      const savedArtists =
        JSON.parse(localStorage.getItem('bookmarkedArtists')) || []

      setBookmarkedSeries(savedSeries)
      setBookmarkedMovies(savedMovies)
      setBookmarkedArtists(savedArtists)
    }
  }, [])

  const toggleBookmark = (item, type) => {
    const localStorageKey =
      type === 'tvshow' // تغییر به 'tvshow'
        ? 'bookmarkedSeries'
        : type === 'movies'
        ? 'bookmarkedMovies'
        : 'bookmarkedArtists'

    const savedItems = JSON.parse(localStorage.getItem(localStorageKey)) || []
    const isBookmarked = savedItems.some((i) => i.id === item.id)

    const updatedItems = isBookmarked
      ? savedItems.filter((i) => i.id !== item.id)
      : [...savedItems, item]

    localStorage.setItem(localStorageKey, JSON.stringify(updatedItems))

    if (type === 'tvshow') {
      // تغییر به 'tvshow'
      setBookmarkedSeries(updatedItems)
    } else if (type === 'movies') {
      setBookmarkedMovies(updatedItems)
    } else {
      setBookmarkedArtists(updatedItems)
    }
  }

  const truncateTitle = (title) => {
    // Check if title is a valid string
    if (!title || typeof title !== 'string') {
      return '' // Return empty string or a default value if title is undefined or not a string
    }
    return title.length > 15 ? `${title.substring(0, 15)}...` : title
  }

  const renderSeriesBookmarks = () => {
    return bookmarkedSeries.length > 0 ? (
      <div className="grid place-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-2">
        {bookmarkedSeries.map((item) => (
          <div key={item.id} className="w-max flex flex-col gap-2">
            <Link
              href={`/tvshow/${
                item.genre_ids && item.genre_ids[0]
                  ? genreTranslations[item.genre_ids[0]] ||
                    decodeURIComponent(item.genre)
                  : 'unknown' // Use a fallback if genre_ids is not defined
              }/${item.id}-${encodeURIComponent(item.name)}`}
            >
              <Image
                width={170}
                height={170}
                src={`https://image.tmdb.org/t/p/w500${item.image}`}
                alt={item.name}
                className="rounded-2xl"
              />
            </Link>
            <div className="space-y-2">
              <p className="w-max">
                {truncateTitle(item.title) || truncateTitle(item.name)}
              </p>
              <div className="flex items-center justify-between text-MyGray">
                <div className="flex items-center gap-2">
                  <small className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                    {item.rating ?? 'N/A'}
                  </small>
                  <small className="border-r border-MyGray pr-2">
                    {item.year ?? 'N/A'}
                  </small>
                </div>
                <div className="flex justify-end">
                  <FaBookmark
                    className={`w-6 h-6 cursor-pointer ${
                      bookmarkedSeries.some((i) => i.id === item.id)
                        ? 'text-primary'
                        : 'text-gray-500'
                    }`}
                    onClick={() => toggleBookmark(item, 'tvshow')}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">هیچ سریالی بوکمارک نشده است.</p>
    )
  }

  const renderMoviesBookmarks = () => {
    return bookmarkedMovies.length > 0 ? (
      <div className="grid place-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-2">
        {bookmarkedMovies.map((item) => (
          <div key={item.id} className="w-max flex flex-col gap-2">
            <Link
              href={`/movies/${
                item.genre_ids && item.genre_ids[0]
                  ? genreTranslations[item.genre_ids[0]] ||
                    decodeURIComponent(item.genre)
                  : 'unknown' // Use a fallback if genre_ids is not defined
              }/${item.id}-${encodeURIComponent(item.title)}`}
            >
              <Image
                width={170}
                height={170}
                src={`https://image.tmdb.org/t/p/w500${item.image}`}
                alt={item.title}
                className="rounded-2xl"
              />
            </Link>
            <div className="space-y-2">
              <p className="w-max">{truncateTitle(item.title)}</p>
              <div className="flex items-center justify-between text-MyGray">
                <div className="flex items-center gap-2">
                  <small className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                    {item.rating ?? 'N/A'}
                  </small>
                  <small className="border-r border-MyGray pr-2">
                    {item.year ?? 'N/A'}
                  </small>
                </div>
                <div className="flex justify-end">
                  <FaBookmark
                    className={`w-6 h-6 cursor-pointer ${
                      bookmarkedMovies.some((i) => i.id === item.id)
                        ? 'text-primary'
                        : 'text-gray-500'
                    }`}
                    onClick={() => toggleBookmark(item, 'movies')}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">هیچ فیلمی بوکمارک نشده است.</p>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4">
      <div className="md:hidden flex items-center justify-between">
        <h2 className="text-xl font-bold">لیست تماشا</h2>
        <FiChevronLeft
          className="w-12 h-12 bg-MyGray rounded-full p-2 cursor-pointer"
          onClick={() => window.history.back()}
        />
      </div>

      <div className="min-w-[20%] hidden md:block">
        <DashboardMenu activeIndex={1} />
      </div>

      <div
        className="bg-MyGray/50 rounded-3xl p-4 text-white w-full md:max-h-[590px] overflow-auto"
        onClick={() => {
          console.log(bookmarkedArtists)
        }}
      >
        {/* تب ها */}
        <div className="w-full md:w-max flex items-center gap-2 rounded-full overflow-hidden mb-8">
          <button
            className={`w-1/2 ${
              activeTab === 'tvshow' // تغییر به 'tvshow'
                ? 'text-secondary bg-primary scale-110 shadow-md shadow-secondary'
                : 'text-white bg-MyGray/30'
            } py-2 px-2`}
            onClick={() => setActiveTab('tvshow')} // تغییر به 'tvshow'
          >
            سریال‌ها
          </button>
          <button
            className={`w-1/2 ${
              activeTab === 'movies'
                ? 'text-secondary bg-primary scale-110 shadow-md shadow-secondary'
                : 'text-white bg-MyGray/30'
            } py-2 px-2`}
            onClick={() => setActiveTab('movies')}
          >
            فیلم‌ها
          </button>
        </div>
        {/* محتوای بوکمارک‌ها */}
        {activeTab === 'tvshow' && renderSeriesBookmarks()}{' '}
        {/* تغییر به 'tvshow' */}
        {activeTab === 'movies' && renderMoviesBookmarks()}
      </div>
    </div>
  )
}
