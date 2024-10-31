'use client'
import Logo from '@/components/Logo'
import UserDropdownMenu from '@/components/UserDropdownMenu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiChevronDown, FiSearch } from 'react-icons/fi'

const routes = [
  { name: 'خانه', path: '/' },
  { name: 'سریال', path: '/tvshow' },
  { name: 'فیلم', path: '/movies' },
  { name: 'هنرمندان', path: '/artists' },
]

const movieGenreTranslations = {
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

const tvGenreTranslations = {
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
  10765: 'تخیلی و فانتزی',
  10766: 'سریال روزانه',
  10767: 'گفت‌وگو',
  10768: 'جنگ و سیاست',
  37: 'وسترن',
}

export default function Header({ setShowSearchModal }) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(null) // وضعیت نمایش دراپ‌دان

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      className={`hidden md:flex items-center mb-12 justify-between mx-auto transition-all duration-1000 z-40 ${
        isScrolled
          ? 'fixed top-1 left-0 right-0 bg-secondary w-2/3 rounded-full px-4 py-2 shadow-sm shadow-MyGray lg:scale-[82%]'
          : 'w-full'
      }`}
    >
      {/* logo */}
      <Logo />

      {/* search & routes */}
      <section
        className={`bg-secondary flex items-center gap-4 rounded-full px-4 py-2 ${
          isScrolled ? 'border-2 border-MyGray' : ''
        }`}
      >
        {/* search */}
        <div
          className="cursor-pointer"
          onClick={() => {
            setShowSearchModal(true)
          }}
        >
          <FiSearch className="w-8 h-8 bg-MyGray/50 p-1 rounded-full" />
        </div>
        {/* routes */}
        <div className="flex items-center gap-10 border-r pr-4">
          {routes.map((route, index) => (
            <div
              key={index}
              onMouseEnter={() => {
                if (route.name === 'فیلم' || route.name === 'سریال') {
                  setShowDropdown(route.name)
                }
              }}
              onMouseLeave={() => setShowDropdown(null)}
              className="relative"
            >
              <Link
                href={route.path}
                className={`flex items-center gap-1 ${
                  route.name !== 'خانه' && pathname.startsWith(route.path)
                    ? 'text-white'
                    : 'text-MyGray'
                }`}
              >
                {route.name}
                {(route.name === 'فیلم' || route.name === 'سریال') && (
                  <FiChevronDown />
                )}
              </Link>

              {/* Dropdown for genres */}
              {showDropdown === route.name && (
                <div className="absolute top-full -left-72 w-max h-max z-30 pt-3">
                  <div className="w-max backdrop shadow-lg rounded-xl p-4 border border-gray-700">
                    <div className="grid grid-cols-4 gap-6">
                      {(route.name === 'فیلم'
                        ? Object.entries(movieGenreTranslations)
                        : Object.entries(tvGenreTranslations)
                      ).map(([id, name]) => (
                        <Link
                          href={`${route.path}/${name}`}
                          key={id}
                          className="flex items-center gap-2 text-MyGray hover:text-white hover:bg-gray-800 hover:pr-6 rounded-lg px-3 py-2 transition-all duration-200"
                        >
                          <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                          <span>{name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* login or signup */}
      <UserDropdownMenu />
    </header>
  )
}
