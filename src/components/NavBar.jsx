'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiFilm, FiHome, FiTv, FiUser, FiUsers } from 'react-icons/fi'

const routes = [
  { name: 'خانه', path: '/', icon: <FiHome className="h-6 w-6" /> },
  { name: 'سریال', path: '/tvshow', icon: <FiTv className="h-6 w-6" /> },
  { name: 'فیلم', path: '/movies', icon: <FiFilm className="h-6 w-6" /> },
  { name: 'هنرمندان', path: '/artists', icon: <FiUsers className="h-6 w-6" /> },
  {
    name: 'داشبورد',
    path: '/dashboard',
    icon: <FiUser className="h-6 w-6" />,
  },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <header className="fixed w-full bottom-2 md:hidden items-center justify-between z-40">
      <section className="w-max mx-auto bg-secondary flex items-center gap-4 border-t border-MyGray rounded-xl overflow-hidden px-4 py-2">
        {/* routes */}
        <div className="flex items-center gap-10">
          {routes.map((route, indexx) => (
            <Link
              href={route.path}
              key={indexx}
              className={`${
                route.path === pathname ? 'text-primary' : 'text-white'
              } flex flex-col items-center gap-2`}
            >
              <p className="">{route.icon}</p>
              <small>{route.name}</small>
            </Link>
          ))}
        </div>
      </section>
    </header>
  )
}
