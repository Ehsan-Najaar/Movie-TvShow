'use client'

import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export default function Artists() {
  const [artists, setArtists] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchArtists = async (page) => {
    const response = await fetch(
      `${BASE_URL}/person/popular?api_key=${API_KEY}&page=${page}`
    )
    const data = await response.json()
    setArtists(data.results)
    setTotalPages(data.total_pages)
  }

  useEffect(() => {
    fetchArtists(currentPage)
    sessionStorage.setItem('currentPage', currentPage)

    // اسکرول به آرامی به بالا
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [currentPage])

  return (
    <div className="px-4">
      <div className="md:hidden mb-8">
        <Search />
      </div>
      <h1 className="hidden md:block w-max mx-auto text-2xl font-bold pb-4 border-b-2 border-MyGray">
        هنرمندان محبوب
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 my-4">
        {artists.length > 0 ? (
          artists
            .filter((artist) => !artist.adult)
            .map((artist) => (
              <div
                key={artist.id}
                className="rounded-lg shadow-lg p-4 text-center transition-transform duration-200 hover:scale-105"
              >
                <figure className="w-[70%] h-auto mx-auto mb-4">
                  <Link
                    href={`/artists/${artist.id}-${encodeURIComponent(
                      artist.name
                    )}`}
                  >
                    <Image
                      width={200}
                      height={300}
                      className="rounded-lg object-cover h-full w-full"
                      src={`https://image.tmdb.org/t/p/w500${artist.profile_path}`}
                      alt={artist.name}
                    />
                  </Link>
                </figure>
                <h2 className="text-xl font-semibold">{artist.name}</h2>
                <Link
                  href={`/artists/${artist.id}-${encodeURIComponent(
                    artist.name
                  )}`}
                  className="block mt-4 primary-outline-button"
                >
                  مشاهده
                </Link>
              </div>
            ))
        ) : (
          <Loader />
        )}
      </div>

      {/* کامپوننت پیجینیشن */}
      <Pagination
        currentPage={currentPage}
        totalItems={artists.length} // ارسال تعداد هنرمندان به عنوان prop
        onNext={() => setCurrentPage((prev) => prev + 1)}
        onPrev={() => setCurrentPage((prev) => prev - 1)}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <Footer />
    </div>
  )
}
