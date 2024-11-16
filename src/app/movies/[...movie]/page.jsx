'use client'

import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import Logo from '@/components/Logo'
import { useFetchMovies } from '@/hooks/useFetchMovies'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FaPlay, FaReply, FaStar, FaUserCircle } from 'react-icons/fa'
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi'
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'

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
  27: 'ترسناک',
  10402: 'موسیقی',
  9648: 'معما',
  10749: 'رمانتیک',
  878: 'علمی تخیلی',
  10770: 'تلویزیونی',
  37: 'وسترن',
}

export default function MoviePage() {
  const pathname = usePathname()
  const genre = pathname.split('/').pop()
  const movieId = pathname.split('/').pop().split('-')[0]
  const movieUrl = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fa-IR`
  const { uniqu: movie, loading, error } = useFetchMovies(movieUrl)

  const [isScrolled, setIsScrolled] = useState(false)
  const [bookmarkedMovies, setBookmarkedMovies] = useState([])
  const [tab, setTab] = useState('actors')
  const [tabData, setTabData] = useState(null)

  useEffect(() => {
    console.log('movie poster path ->', movie.poster_path) // مشاهده مسیر تصویر
  }, [movie])

  useEffect(() => {
    const storedBookmarks = JSON.parse(
      localStorage.getItem('bookmarkedMovies') || '[]'
    )
    setBookmarkedMovies(storedBookmarks)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const fetchTabData = async () => {
    let url
    switch (tab) {
      case 'actors':
        url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
        break
      case 'reviews':
        url = `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`
        break
      case 'related':
        url = `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
        break
      default:
        return
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log(`Fetched data for ${tab}:`, data) // Check the data here
      setTabData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchTabData()
  }, [tab])

  const handleScroll = () => {
    if (window.scrollY > 1) {
      // Change 100 to the scroll position you prefer
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  const toggleBookmark = useCallback((movie) => {
    setBookmarkedMovies((prev) => {
      const isBookmarked = prev.some((item) => item.id === movie.id)
      const updatedBookmarks = isBookmarked
        ? prev.filter((item) => item.id !== movie.id)
        : [
            ...prev,
            {
              id: movie.id,
              title: movie.title,
              year: movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : 'نامشخص',
              rating: movie.vote_average
                ? movie.vote_average.toFixed(1)
                : 'N/A',
              image: movie.poster_path,
              origin_country: movie.production_countries
                ? movie.production_countries
                    .map((country) => country.name)
                    .join(', ')
                : 'نامشخص',
              language: movie.original_language,
              overview: movie.overview ? movie.overview : 'مشخص نیست',
              runtime: movie.runtime ? `${movie.runtime} دقیقه` : 'نامشخص',
            },
          ]

      localStorage.setItem('bookmarkedMovies', JSON.stringify(updatedBookmarks))
      return updatedBookmarks
    })
  }, [])

  if (loading) {
    return <Loader />
  }

  if (!movie) {
    return <div>فیلمی یافت نشد</div>
  }

  const isBookmarked = bookmarkedMovies.some((mov) => mov.id === movie.id)

  const movieDetails = {
    releaseYear: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 'نامشخص',
    country:
      movie.production_countries && movie.production_countries.length > 0
        ? (movie.production_countries[0].name === 'United States of America'
            ? 'USA'
            : movie.production_countries[0].name) || 'نامشخص'
        : 'نامشخص',
    authors:
      movie.production_companies && movie.production_companies.length > 0
        ? movie.production_companies[0].name || 'نامشخص'
        : 'نامشخص',
    runtime: movie.runtime ? `${movie.runtime} دقیقه` : 'نامشخص',
  }

  const genres = movie.genres
    .map((genre) => genreTranslations[genre.id] || 'نامشخص')
    .join(', ')

  return (
    <div
      className={`transition-all duration-1000 lg:mt-16 p-4 lg:p-0 ${
        isScrolled ? 'lg:mt-36' : 'lg:mt-16'
      }`}
    >
      <figure className="hidden lg:flex absolute top-28 right-0 w-full h-60 blur -z-10">
        <Image
          width={90}
          height={90}
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </figure>
      <section className="flex flex-col lg:flex-row items-end gap-6">
        {/* Right section */}
        <div className="relative w-full lg:w-[32%] space-y-4">
          <figure className="w-[80%] sm:w-[40%] md:w-[30%] lg:w-full mx-auto lg:border-2 rounded-3xl overflow-hidden">
            <Image
              width={90}
              height={90}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt=""
              className="w-full h-full mx-auto object-cover object-top"
            />
          </figure>
          <button className="primary-button md:primary-outline-button absolute -bottom-4 left-[42%] sm:left-[46%] md:bottom-0 md:left-0 md:w-full md:relative flex items-center justify-center gap-2">
            <FaPlay className="h-5 w-5" />
            <span className="hidden md:block">مشاهده تریلر</span>
          </button>
        </div>

        {/* Left section */}
        <div className="w-full -mb-4 mt-12 md:mt-0">
          {/* Movie title & bookmark section */}
          <div className="w-full flex items-start justify-between mb-12">
            <div className="space-y-3">
              <h1 className="text-xl md:text-3xl">{movie.title}</h1>
              <h2 className="md:text-2xl text-MyGray">
                {movie.original_title}
              </h2>
            </div>
            <button onClick={() => toggleBookmark(movie)}>
              {isBookmarked ? (
                <MdBookmark className="h-12 w-12" />
              ) : (
                <MdBookmarkBorder className="h-12 w-12" />
              )}
            </button>
          </div>
          <div className="flex flex-col-reverse md:flex-row items-center justify-between">
            <div className="md:w-[70%]">
              <p className="w-max flex items-center gap-4 my-12 md:mb-16">
                <span className="text-xl">ژانر</span>
                <p className="text-MyGray">{genres}</p>
              </p>
              <div className="w-full grid grid-cols-3 lg:grid-cols-4 place-items-start gap-8 mt-4">
                {Object.entries(movieDetails).map(([key, value]) => (
                  <li
                    key={key}
                    className="flex flex-col items-start lg:items-center gap-2"
                  >
                    <strong className="text-lg">
                      {key === 'country'
                        ? 'کشور'
                        : key === 'authors'
                        ? 'نویسنده'
                        : key === 'releaseYear'
                        ? 'سال انتشار'
                        : key === 'runtime'
                        ? 'مدت زمان'
                        : 'نامشخص'}
                    </strong>
                    <span className="text-MyGray whitespace-break-spaces text-center max-w-32">
                      {key === 'country' && value === 'USA' ? 'USA' : value}
                    </span>
                  </li>
                ))}
              </div>
            </div>
            {/* Ratings */}
            <div className="h-full flex md:flex-col gap-12 text-3xl mt-11 lg:mt-0">
              {/* IMDb */}
              <div className="flex flex-col md:flex-row items-center md:gap-6">
                <Image width={80} height={80} src={'/images/imdb.png'} alt="" />
                <div className="flex flex-col items-center gap-1">
                  <p className="flex items-center gap-1 border-b border-yellow-400">
                    <small className="text-sm">{'10 / '}</small>
                    <span className="text-yellow-400">
                      {movie.vote_average !== undefined
                        ? movie.vote_average.toFixed(1)
                        : 'N/A'}
                    </span>
                  </p>
                  <small className="text-yellow-400 text-[13px] md:text-sm">
                    {movie.vote_count >= 1000
                      ? `${(movie.vote_count / 1000).toFixed(1)}K`
                      : movie.vote_count}{' '}
                    <small className="text-white">Votes</small>
                  </small>
                </div>
              </div>

              {/* User Ratings */}
              <div className="flex flex-col md:flex-row items-center gap-2">
                <Logo />
                <div className="flex flex-col items-center gap-1">
                  <p className="flex items-center gap-1 border-b border-primary">
                    <small className="text-sm">{'5 / '}</small>
                    <span className="text-primary">4.6</span>
                  </p>
                  <small className="text-[12px] text-primary">
                    امتیاز کاربران ما
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p className="mt-24 text-justify leading-loose">
        {movie.overview && (
          <span className="text-2xl font-bold px-1">خلاصه داستان:</span>
        )}{' '}
        {movie.overview}
      </p>

      {/* Tabs for Actors, Reviews, and Related Shows */}
      <div className="flex items-center justify-start text-sm md:text-xl rounded-xl overflow-hidden mt-24">
        <button
          className={`w-1/3 px-4 py-3 ${
            tab === 'actors' ? 'bg-primary text-secondary' : 'bg-MyGray/30'
          }`}
          onClick={() => setTab('actors')}
        >
          بازیگران
        </button>
        <button
          className={`w-1/3 px-4 py-3 border-x border-MyGray ${
            tab === 'reviews' ? 'bg-primary text-secondary' : 'bg-MyGray/30'
          }`}
          onClick={() => setTab('reviews')}
        >
          نظرات
        </button>
        <button
          className={`w-1/3 px-4 py-3 ${
            tab === 'related' ? 'bg-primary text-secondary' : 'bg-MyGray/30'
          }`}
          onClick={() => setTab('related')}
        >
          عناوین مرتبط
        </button>
      </div>

      <div className="tab-content mt-6 md:mt-12">
        {tab === 'actors' && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {tabData?.cast
                ?.filter((actor) => actor.profile_path) // فیلتر کردن بازیگران با عکس
                .map((actor) => (
                  <div
                    key={actor.id}
                    className="rounded-lg shadow-lg p-4 text-center transition-transform duration-200 hover:scale-105"
                  >
                    <figure className="w-[70%] h-auto mx-auto mb-4">
                      <Link
                        href={`/artists/${actor.id}-${encodeURIComponent(
                          actor.name
                        )}`}
                      >
                        {actor.profile_path ? (
                          <Image
                            width={200}
                            height={300}
                            className="rounded-lg object-cover h-full w-full"
                            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                            alt={actor.name}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-[180px] mid:h-[315px] bg-gray-700 rounded-lg">
                            <FaUserCircle className="text-gray-400 w-24 h-24" />
                          </div>
                        )}
                      </Link>
                    </figure>
                    <h2 className="text-xl font-semibold">{actor.name}</h2>
                    <Link
                      href={`/artists/${actor.id}-${encodeURIComponent(
                        actor.name
                      )}`}
                      className="block mt-4 primary-outline-button"
                    >
                      مشاهده
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            {tabData?.results && tabData.results.length > 0 ? (
              <ul className="space-y-4">
                {tabData.results
                  .sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((review) => (
                    <li
                      key={review.id}
                      className="mb-4 p-6 rounded-lg bg-gray-800 shadow-lg space-y-3 border border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        {review.author_details &&
                        review.author_details.avatar_path ? (
                          <figure className="overflow-hidden rounded-full">
                            <Image
                              src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                              alt={review.author}
                              width={45}
                              height={45}
                              className="w-12 h-12"
                            />
                          </figure>
                        ) : (
                          <FaUserCircle className="text-gray-400 w-12 h-12" />
                        )}
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <p className="text-sm text-gray-400">
                            {review.created_at
                              ? new Date(review.created_at).toLocaleDateString(
                                  'fa-IR',
                                  {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  }
                                )
                              : 'تاریخ نامشخص'}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-300 mt-2 leading-relaxed">
                        {review.content}
                      </p>

                      <div className="flex items-center justify-between text-gray-400 mt-4">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 hover:text-green-400 transition-all duration-150">
                            <FiThumbsUp className="h-6 w-6" />
                            <span className="ml-1 text-sm">موافق</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-red-400 transition-all duration-150">
                            <FiThumbsDown className="h-6 w-6" />
                            <span className="ml-1 text-sm">مخالف</span>
                          </button>
                        </div>
                        <button className="flex items-center gap-2 text-MyGray text-sm hover:text-white transition-all duration-150">
                          پاسخ
                          <FaReply />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 p-24 text-center">
                هیچ نظری برای این سریال وجود ندارد.
              </p>
            )}
          </div>
        )}

        {tab === 'related' && (
          <div
            onClick={() => {
              console.log(tabData)
              console.log(tab) // بررسی مقدار tab
            }}
          >
            {tabData && tabData.results ? (
              <>
                {tabData.results.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 place-items-center gap-12 mt-4">
                    {tabData.results.map((movie) => {
                      // تغییر 'show' به 'movie'
                      if (!movie || !movie.title || !movie.poster_path) {
                        return null // Skip invalid movies
                      }
                      return (
                        <Link
                          key={movie.id}
                          href={`/movies/${
                            genreTranslations[movie.genre_ids[0]] ||
                            decodeURIComponent(genre)
                          }/${movie.id}-${encodeURIComponent(movie.title)}`}
                          className="w-max flex flex-col gap-2 rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105"
                        >
                          <Image
                            width={170}
                            height={170}
                            src={`https://image.tmdb.org/t/p/w500${
                              movie.poster_path
                            }?timestamp=${new Date().getTime()}`} // پارامتر زمان اضافه شده
                            alt={movie.title}
                            className="rounded-2xl object-cover"
                          />

                          <div className="space-y-2 p-2">
                            <p className="w-max text-white">
                              {movie.title.length > 15
                                ? `${movie.title.slice(0, 15)}...`
                                : movie.title}{' '}
                            </p>
                            <div className="flex items-center gap-2 text-MyGray">
                              <small className="flex items-center gap-1">
                                <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                                {movie.vote_average !== undefined
                                  ? movie.vote_average.toFixed(1)
                                  : 'N/A'}
                              </small>
                              <small className="border-r border-MyGray pr-2">
                                {movie.release_date
                                  ? movie.release_date.split('-')[0]
                                  : 'N/A'}
                              </small>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center p-4">
                    هیچ عنوان مرتبطی یافت نشد.
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center p-4">درحال...</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
