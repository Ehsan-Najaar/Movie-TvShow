'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { FiSearch, FiX } from 'react-icons/fi'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

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

const fetchTrendingMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
  const data = await res.json()
  return data.results || []
}

const fetchTrendingTVShows = async () => {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`)
  const data = await res.json()
  return data.results || []
}

const searchMoviesAndTVShows = async (query) => {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  )
  const data = await res.json()
  console.log('Raw API Response:', data) // نمایش اطلاعات خام API
  return data.results || []
}

export default function Search({ showSearchModal, setShowSearchModal }) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        const results = await searchMoviesAndTVShows(query)

        // چاپ تمامی نتایج
        console.log('All Results:', results)

        // فیلتر کردن فیلم‌ها
        const movies = results
          .filter(
            (item) =>
              item.media_type === 'movie' &&
              item.vote_average !== undefined &&
              item.release_date
          )
          .map((item) => ({ ...item, type: 'movies' }))
        console.log('Filtered Movies:', movies)

        // فیلتر کردن سریال‌ها
        const series = results
          .filter(
            (item) =>
              item.media_type === 'tv' &&
              item.vote_average !== undefined &&
              item.first_air_date
          )
          .map((item) => ({
            ...item,
            type: 'tvshow',
            release_date: item.first_air_date,
          }))
        console.log('Filtered Series:', series)

        setFilteredItems([...movies, ...series])
      } else {
        console.log('Default Items:', items)
        setFilteredItems(items)
      }
    }

    fetchSearchResults()
  }, [query, items])

  useEffect(() => {
    if (isSearchVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchVisible])

  const handleCloseSearch = () => {
    setQuery('')
    setIsSearchVisible(false)
  }

  return (
    <div>
      <section
        className="w-full mx-auto flex items-center justify-between bg-secondary p-3 md:p-4 rounded-full border border-MyGray"
        onClick={() => setIsSearchVisible(true)}
      >
        <div className="w-full flex items-center gap-2">
          <FiSearch className="w-8 h-8 p-1" />
          <input
            type="text"
            placeholder="اسم فیلم یا سریال مد نظر خود را وارد کنید"
            className="w-full bg-transparent focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
          />
        </div>
      </section>

      {/* نمایش اسلاید آپ فقط در موبایل */}
      {isSearchVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-secondary h-full transition-transform duration-300 transform translate-y-0 z-50 md:hidden">
          <div className="flex justify-between p-4">
            <h2 className="text-lg font-bold">جستجو</h2>
            <button className="text-red-500" onClick={handleCloseSearch}>
              <FiX className="h-7 w-7" />
            </button>
          </div>
          <input
            type="text"
            placeholder="اسم فیلم یا سریال مد نظر خود را وارد کنید"
            className="w-full bg-transparent focus:outline-none p-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
          />

          {/* نمایش نتایج فیلتر شده */}
          {query && (
            <div className="mt-4 max-h-[610px] overflow-auto rounded-3xl px-6 pb-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-12">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const itemTitle = item.title || item.name || 'نامشخص'
                    const truncatedTitle =
                      itemTitle.length > 15
                        ? itemTitle.slice(0, 15) + '...'
                        : itemTitle

                    return (
                      <Link
                        href={`/${item.type}/${
                          item.genre_ids && item.genre_ids.length > 0
                            ? genreTranslations[item.genre_ids[0]] || 'نامشخص'
                            : 'نامشخص'
                        }/${item.id}-${encodeURIComponent(
                          item.name || 'نامشخص'
                        )}`}
                        key={item.id}
                        className="w-max flex flex-col gap-2"
                        onClick={() => {
                          setQuery('')
                          setIsSearchVisible(false)
                        }}
                      >
                        <Image
                          width={170}
                          height={170}
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                              : '/path/to/default-image.jpg'
                          }
                          alt={itemTitle}
                          className="rounded-2xl"
                        />
                        <div className="space-y-2">
                          <p className="w-max">{truncatedTitle}</p>
                          <div className="flex items-center gap-2 text-MyGray">
                            <small className="flex items-center gap-1">
                              <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                              {item.vote_average !== undefined
                                ? item.vote_average.toFixed(1)
                                : 'N/A'}
                            </small>
                            <small className="border-r border-MyGray pr-2">
                              {
                                (
                                  item.release_date ||
                                  item.first_air_date ||
                                  'نامشخص'
                                ).split('-')[0]
                              }
                            </small>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <p>نتیجه‌ای یافت نشد</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {query && (
        <div className="hidden md:block bg-secondary mt-4 max-h-[610px] overflow-auto rounded-3xl p-4 border border-MyGray">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-12">
            {filteredItems.map((item) => {
              const itemTitle = item.title || item.name || 'نامشخص'
              const truncatedTitle =
                itemTitle.length > 15
                  ? itemTitle.slice(0, 15) + '...'
                  : itemTitle

              return (
                <Link
                  href={`/${item.type}/${
                    item.genre_ids && item.genre_ids.length > 0
                      ? genreTranslations[item.genre_ids[0]] || 'نامشخص'
                      : 'نامشخص'
                  }/${item.id}-${encodeURIComponent(item.name || 'نامشخص')}`}
                  key={item.id}
                  className="w-max flex flex-col gap-2"
                  onClick={() => {
                    setQuery('')
                    setIsSearchVisible(false)
                  }}
                >
                  <Image
                    width={170}
                    height={170}
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={itemTitle}
                    className="rounded-2xl"
                  />
                  <div className="space-y-2">
                    <p className="w-max">{truncatedTitle}</p>
                    <div className="flex items-center gap-2 text-MyGray">
                      <small className="flex items-center gap-1">
                        <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                        {item.vote_average !== undefined
                          ? item.vote_average.toFixed(1)
                          : 'N/A'}
                      </small>
                      <small className="border-r border-MyGray pr-2">
                        {
                          (
                            item.release_date ||
                            item.first_air_date ||
                            'نامشخص'
                          ).split('-')[0]
                        }
                      </small>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
