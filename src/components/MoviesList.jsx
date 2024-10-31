'use client'

import Loader from '@/components/Loader'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const trendingMoviesURL = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
const trendingTVShowsURL = `${BASE_URL}/trending/tv/day?api_key=${API_KEY}`
const topRatedMoviesURL = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
const topRatedTVShowsURL = `${BASE_URL}/tv/top_rated?api_key=${API_KEY}`
const popularMoviesURL = `${BASE_URL}/movie/popular?api_key=${API_KEY}`
const popularTVShowsURL = `${BASE_URL}/tv/popular?api_key=${API_KEY}`
const genresURL = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`

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

export default function MediaList() {
  const [movies, setMovies] = useState([])
  const [tvShows, setTVShows] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [topRatedTVShows, setTopRatedTVShows] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTVShows, setPopularTVShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('movies')
  const [selectedGenre, setSelectedGenre] = useState(0)
  const [genres, setGenres] = useState([])

  const pathname = usePathname()
  const genre = pathname.split('/').pop()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch genres
        const genresResponse = await fetch(genresURL)
        const genresData = await genresResponse.json()
        setGenres(genresData.genres)

        // Fetch trending movies
        const moviesResponse = await fetch(trendingMoviesURL)
        const moviesData = await moviesResponse.json()
        setMovies(moviesData.results)

        // Fetch trending TV shows
        const tvShowsResponse = await fetch(trendingTVShowsURL)
        const tvShowsData = await tvShowsResponse.json()
        setTVShows(tvShowsData.results)

        // Fetch top rated movies
        const topRatedMoviesResponse = await fetch(topRatedMoviesURL)
        const topRatedMoviesData = await topRatedMoviesResponse.json()
        setTopRatedMovies(topRatedMoviesData.results)

        // Fetch top rated TV shows
        const topRatedTVShowsResponse = await fetch(topRatedTVShowsURL)
        const topRatedTVShowsData = await topRatedTVShowsResponse.json()
        setTopRatedTVShows(topRatedTVShowsData.results)

        // Fetch popular movies
        const popularMoviesResponse = await fetch(popularMoviesURL)
        const popularMoviesData = await popularMoviesResponse.json()
        setPopularMovies(popularMoviesData.results)

        // Fetch popular TV shows
        const popularTVShowsResponse = await fetch(popularTVShowsURL)
        const popularTVShowsData = await popularTVShowsResponse.json()
        setPopularTVShows(popularTVShowsData.results)
      } catch (error) {
        setError('خطا در بارگذاری داده‌ها')
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loader />
  if (error) return <p>خطا: {error}</p>

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSelectedGenre(0) // Reset genre when category changes
  }

  const getSwiperBreakpoints = () => {
    return {
      300: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3, // در صفحه‌های کوچکتر از 640px، 3 اسلاید نمایش داده شود
      },
      768: {
        slidesPerView: 4, // در صفحه‌های بزرگتر از 640px، 4 اسلاید نمایش داده شود
      },
      1024: {
        slidesPerView: 5, // در صفحه‌های بزرگتر از 768px، 5 اسلاید نمایش داده شود
      },
      1280: {
        slidesPerView: 7, // در صفحه‌های بزرگتر از 1024px، 7 اسلاید نمایش داده شود
      },
    }
  }

  const filteredMovies =
    selectedGenre === 0
      ? movies
      : movies.filter((movie) => movie.genre_ids.includes(selectedGenre))
  const filteredTVShows =
    selectedGenre === 0
      ? tvShows
      : tvShows.filter((show) => show.genre_ids.includes(selectedGenre))

  const renderMovies = () => (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      breakpoints={getSwiperBreakpoints()}
    >
      {filteredMovies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <Link
            href={`/movies/${
              genreTranslations[movie.genre_ids[0]] || decodeURIComponent(genre)
            }/${movie.id}-${encodeURIComponent(movie.title)}`}
            className="w-max flex flex-col gap-2"
          >
            <Image
              width={170}
              height={170}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-2xl"
            />
            <div className="space-y-2">
              <p className="w-max">
                {movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </p>
              <div className="flex items-center gap-2 text-MyGray">
                <small className="flex items-center gap-1">
                  <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                  {movie.vote_average !== undefined
                    ? movie.vote_average.toFixed(1)
                    : 'N/A'}
                </small>
                <small className="border-r border-MyGray pr-2">
                  {movie.release_date.split('-')[0]}
                </small>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )

  const renderTVShows = () => (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      breakpoints={getSwiperBreakpoints()}
    >
      {filteredTVShows.map((show) => (
        <SwiperSlide key={show.id}>
          <Link
            href={`/tvshow/${
              show.genre_ids && show.genre_ids.length > 0
                ? genreTranslations[show.genre_ids[0]] || 'نامشخص'
                : 'نامشخص'
            }/${show.id}-${encodeURIComponent(show.name)}`}
            className="w-max flex flex-col gap-2"
          >
            <Image
              width={170}
              height={170}
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              className="rounded-2xl"
            />
            <div className="space-y-2">
              <p className="w-max">
                {show.name.length > 15
                  ? `${show.name.slice(0, 15)}...`
                  : show.name}
              </p>
              <div className="flex items-center gap-2 text-MyGray">
                <small className="flex items-center gap-1">
                  <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                  {show.vote_average !== undefined
                    ? show.vote_average.toFixed(1)
                    : 'N/A'}
                </small>
                <small className="border-r border-MyGray pr-2">
                  {show.first_air_date.split('-')[0]}
                </small>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )

  const renderTopRatedMovies = () => (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      breakpoints={getSwiperBreakpoints()}
    >
      {topRatedMovies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <Link
            href={`/movies/${
              genreTranslations[movie.genre_ids[0]] || decodeURIComponent(genre)
            }/${movie.id}-${encodeURIComponent(movie.title)}`}
            className="w-max flex flex-col gap-2"
          >
            <Image
              width={170}
              height={170}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-2xl"
            />
            <div className="space-y-2">
              <p className="w-max">
                {movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </p>
              <div className="flex items-center gap-2 text-MyGray">
                <small className="flex items-center gap-1">
                  <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                  {movie.vote_average !== undefined
                    ? movie.vote_average.toFixed(1)
                    : 'N/A'}
                </small>
                <small className="border-r border-MyGray pr-2">
                  {movie.release_date.split('-')[0]}
                </small>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )

  const renderTopRatedTVShows = () => (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      breakpoints={getSwiperBreakpoints()}
    >
      {topRatedTVShows.map((show) => (
        <SwiperSlide key={show.id}>
          <Link
            href={`/tvshow/${
              show.genre_ids && show.genre_ids.length > 0
                ? genreTranslations[show.genre_ids[0]] || 'نامشخص'
                : 'نامشخص'
            }/${show.id}-${encodeURIComponent(show.name)}`}
            className="w-max flex flex-col gap-2"
          >
            <Image
              width={170}
              height={170}
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              className="rounded-2xl"
            />
            <div className="space-y-2">
              <p className="w-max">
                {show.name.length > 15
                  ? `${show.name.slice(0, 15)}...`
                  : show.name}
              </p>
              <div className="flex items-center gap-2 text-MyGray">
                <small className="flex items-center gap-1">
                  <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                  {show.vote_average !== undefined
                    ? show.vote_average.toFixed(1)
                    : 'N/A'}
                </small>
                <small className="border-r border-MyGray pr-2">
                  {show.first_air_date.split('-')[0]}
                </small>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )

  const renderPopularMovies = () => (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      breakpoints={getSwiperBreakpoints()}
    >
      {popularMovies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <Link
            href={`/movies/${
              genreTranslations[movie.genre_ids[0]] || decodeURIComponent(genre)
            }/${movie.id}-${encodeURIComponent(movie.title)}`}
            className="w-max flex flex-col gap-2"
          >
            <Image
              width={170}
              height={170}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-2xl"
            />
            <div className="space-y-2">
              <p className="w-max">
                {movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </p>
              <div className="flex items-center gap-2 text-MyGray">
                <small className="flex items-center gap-1">
                  <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                  {movie.vote_average !== undefined
                    ? movie.vote_average.toFixed(1)
                    : 'N/A'}
                </small>
                <small className="border-r border-MyGray pr-2">
                  {movie.release_date.split('-')[0]}
                </small>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )

  const renderPopularTVShows = () => (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      breakpoints={getSwiperBreakpoints()}
    >
      {popularTVShows.map((show) => (
        <SwiperSlide key={show.id}>
          <Link
            href={`/tvshow/${
              show.genre_ids && show.genre_ids.length > 0
                ? genreTranslations[show.genre_ids[0]] || 'نامشخص'
                : 'نامشخص'
            }/${show.id}-${encodeURIComponent(show.name)}`}
            className="w-max flex flex-col gap-2"
          >
            <Image
              width={170}
              height={170}
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              className="rounded-2xl"
            />
            <div className="space-y-2">
              <p className="w-max">
                {show.name.length > 15
                  ? `${show.name.slice(0, 15)}...`
                  : show.name}
              </p>
              <div className="flex items-center gap-2 text-MyGray">
                <small className="flex items-center gap-1">
                  <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                  {show.vote_average !== undefined
                    ? show.vote_average.toFixed(1)
                    : 'N/A'}
                </small>
                <small className="border-r border-MyGray pr-2">
                  {show.first_air_date.split('-')[0]}
                </small>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )

  return (
    <div className="pb-12 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">ترند های اخیر</h1>
        <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
          <button
            onClick={() => handleCategoryChange('movies')}
            className={`pl-2 border-l border-MyGray ${
              selectedCategory === 'movies' ? 'text-white' : 'text-MyGray'
            }`}
          >
            فیلم‌
          </button>
          <button
            onClick={() => handleCategoryChange('tvShows')}
            className={`${
              selectedCategory === 'tvShows' ? 'text-white' : 'text-MyGray'
            }`}
          >
            سریال‌
          </button>
        </div>
      </div>

      {/* Display selected content */}
      {selectedCategory === 'movies' && (
        <div className="space-y-12">
          {renderMovies()}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-2">بیشترین امتیاز</h2>
            <small className="text-gray-300">
              بیشترین امتیازها: آثار فراموش‌نشدنی
            </small>
            {renderTopRatedMovies()}
          </div>
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold mb-2">محبوب‌ترین‌ها</h2>
            <small className="text-gray-300">برترین فیلم های این هفته</small>
            {renderPopularMovies()}
          </div>
        </div>
      )}
      {selectedCategory === 'tvShows' && (
        <div className="space-y-12">
          {renderTVShows()}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-2">بیشترین امتیاز</h2>
            <small className="text-gray-300">
              بیشترین امتیازها: آثار فراموش‌نشدنی
            </small>
            {renderTopRatedTVShows()}
          </div>
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold mb-2">محبوب‌ترین‌ها</h2>
            <small className="text-gray-300">
              برترین سریال‌ های تلویزیونی این هفته
            </small>
            {renderPopularTVShows()}
          </div>
        </div>
      )}
    </div>
  )
}
