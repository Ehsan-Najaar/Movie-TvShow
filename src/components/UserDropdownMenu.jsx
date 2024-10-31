import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import {
  FiBookmark,
  FiChevronLeft,
  FiDollarSign,
  FiMail,
  FiMessageCircle,
  FiPackage,
} from 'react-icons/fi'

export default function UserDropdownMenu() {
  const [userName, setUserName] = useState('کاربر')
  const [userProfile, setUserProfile] = useState('')

  const DashboardMenuList = [
    {
      name: 'لیست تماشا',
      icon: <FiBookmark className="h-6 w-6" />,
      path: '/dashboard/favorites',
    },
    {
      name: 'اشتراک',
      icon: <FiPackage className="h-6 w-6" />,
      path: '/dashboard/subscription',
    },
    {
      name: 'کیف پول',
      icon: <FiDollarSign className="h-6 w-6" />,
      path: '/dashboard/wallet',
    },
    {
      name: 'پیغام ها',
      icon: <FiMail className="h-6 w-6" />,
      path: '/dashboard/messages',
    },
    {
      name: 'نظرات',
      icon: <FiMessageCircle className="h-6 w-6" />,
      path: '/dashboard/feedback',
    },
  ]

  useEffect(() => {
    // دریافت نام و تصویر پروفایل از localStorage
    const storedName = localStorage.getItem('userName') || 'نام کاربر'
    const storedProfile = localStorage.getItem('userProfile') || ''

    setUserName(storedName)
    setUserProfile(storedProfile)
  }, [])

  return (
    <div className="relative inline-block text-right z-40">
      <div className="group inline-block">
        <figure className="h-12 w-12 mx-auto rounded-full grid place-items-center cursor-pointer">
          {userProfile ? (
            <Image
              width={90}
              height={90}
              src={userProfile}
              alt="Profile Picture"
              className="rounded-full"
            />
          ) : (
            <FaUser className="h-10 w-10 p-2 border rounded-full" />
          )}
        </figure>

        {/* منو با تغییر ارتفاع */}
        <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-secondary ring-1 ring-black ring-opacity-5 overflow-hidden max-h-0 group-hover:max-h-[500px] transition-all duration-300 z-10">
          <div className="border-b">
            <Link href={'/dashboard/edit-account'}>
              <h3 className="flex items-center justify-between font-semibold text-lg hover:bg-MyGray px-4 py-2">
                {userName}
                <FiChevronLeft className="h-6 w-6" />
              </h3>
            </Link>
          </div>
          <ul className="">
            {DashboardMenuList.map((item, index) => (
              <li
                key={index}
                className="flex items-center px-4 py-2 hover:bg-MyGray cursor-pointer"
              >
                <Link
                  href={item.path}
                  className="flex items-center gap-2 w-full"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
