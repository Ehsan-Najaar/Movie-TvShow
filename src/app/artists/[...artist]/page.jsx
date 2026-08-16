// src/app/artists/[...artist]/

'use client'

import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import Pagination from '@/components/Pagination'
import { useFetchMovies } from '@/hooks/useFetchMovies'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export default function ArtistPage() {
  const pathname = usePathname()
  const artistId = pathname.split('/').pop().split('-')[0]
  const artistUrl = `${BASE_URL}/person/${artistId}?api_key=${API_KEY}&language=fa-IR`
  const moviesUrl = `${BASE_URL}/person/${artistId}/combined_credits?api_key=${API_KEY}&language=fa-IR`
  const { uniqu: artist, loading, error } = useFetchMovies(artistUrl)
  const { uniqu: movies } = useFetchMovies(moviesUrl)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  if (loading) {
    return <Loader />
  }

  if (!artist) {
    return <div>بازیگری یافت نشد</div>
  }

  const moviesList = movies?.cast || []
  const totalItems = moviesList.length
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

  // توابع برای صفحه‌بندی
  const onNext = () => {
    if (currentPage * itemsPerPage < totalItems) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const onPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const onPageChange = (page) => {
    setCurrentPage(page)
  }

  // محاسبه اندیس‌های شروع و پایان
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // محتوای موردنظر برای نمایش
  const displayedItems = moviesList.slice(startIndex, endIndex)

  return (
    <div className="px-4">
      {/* بخش معرفی هنرمند */}
      <div className="flex flex-col items-center text-center gap-2 p-4">
        <Image
          src={`https://image.tmdb.org/t/p/w500${artist.profile_path}`}
          alt={artist.name}
          width={150}
          height={150}
          className="rounded-full"
        />
        <h1 className="text-3xl font-bold text-white mt-4">{artist.name}</h1>
        <p className="text-gray-400 text-justify">
          {artist.biography || 'بیوگرافی موجود نیست'}
        </p>
      </div>

      {/* نمایش آثار هنرمند */}
      <section className="my-10">
        <h2 className="w-max text-2xl font-bold border-b-2 border-MyGray pb-4">
          آثار هنرمند
        </h2>
        <div className="grid place-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 my-6">
          {displayedItems.map((item) => (
            <Link
              href={`/${item.media_type === 'tv' ? 'tvshow' : 'movies'}/${
                genreTranslations[item.genre_ids[0]] || 'نامشخص'
              }/${item.id}-${encodeURIComponent(item.title)}`}
              key={item.id}
              className="w-max flex flex-col gap-2"
            >
              <Image
                width={170}
                height={170}
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="rounded-2xl"
              />
              <div className="space-y-2">
                <p className="w-max text-white">
                  {item.title
                    ? item.title.length > 18
                      ? `${item.title.substring(0, 18)}...`
                      : item.title
                    : item.name
                    ? item.name.length > 18
                      ? `${item.name.substring(0, 18)}...`
                      : item.name
                    : 'No Title'}
                </p>
                <div className="flex items-center gap-2 text-MyGray ">
                  <small className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 -mt-1 text-yellow-300" />
                    {item.vote_average !== undefined
                      ? item.vote_average.toFixed(1)
                      : 'N/A'}
                  </small>
                  <small className="border-r border-MyGray pr-2">
                    {item.release_date
                      ? item.release_date.split('-')[0]
                      : item.first_air_date
                      ? item.first_air_date.split('-')[0]
                      : 'N/A'}
                  </small>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* کامپوننت Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          onNext={onNext}
          onPrev={onPrev}
          onPageChange={onPageChange}
        />
      </section>

      <Footer />
    </div>
  )
}
