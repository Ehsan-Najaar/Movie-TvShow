'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import {
  FiBookmark,
  FiDollarSign,
  FiEdit,
  FiMail,
  FiMessageCircle,
  FiPackage,
} from 'react-icons/fi'

// لیست منوی داشبورد
const DashboardMenuList = [
  {
    name: 'ویرایش پروفایل',
    icon: <FiEdit className="h-6 w-6" />,
    path: 'edit-account',
  },
  {
    name: 'لیست تماشا',
    icon: <FiBookmark className="h-6 w-6" />,
    path: 'favorites',
  },
  {
    name: 'اشتراک',
    icon: <FiPackage className="h-6 w-6" />,
    path: 'subscription',
  },
  {
    name: 'کیف پول',
    icon: <FiDollarSign className="h-6 w-6" />,
    path: 'wallet',
  },
  { name: 'پیغام ها', icon: <FiMail className="h-6 w-6" />, path: 'messages' },
  {
    name: 'نظرات',
    icon: <FiMessageCircle className="h-6 w-6" />,
    path: 'feedback',
  },
]

export default function DashboardMenu({ activeIndex = 0 }) {
  // اطلاعات کاربر به صورت لوکال استیت
  const [userName, setUserName] = useState('کاربر محترم')
  const [userProfile, setUserProfile] = useState(null)

  // بارگذاری نام کاربر و تصویر پروفایل از Local Storage
  useEffect(() => {
    const savedName = localStorage.getItem('userName')
    const savedProfile = localStorage.getItem('userProfile')

    if (savedName) {
      setUserName(savedName)
    }
    if (savedProfile) {
      setUserProfile(savedProfile)
    }
  }, [])

  // تابعی برای رندر کردن هر آیتم منو
  const renderMenuItem = (item, index) => (
    <Link
      href={`/dashboard/${item.path}`}
      key={item.name}
      className={`flex items-center gap-2 p-4 cursor-pointer rounded-lg bg-secondary ${
        activeIndex === index
          ? 'md:bg-primary md:text-secondary md:pr-6'
          : 'md:bg-transparent md:text-gray-300 hover:md:pr-6 hover:bg-MyGray transition-all duration-300'
      }`}
    >
      <span>{item.icon}</span>
      <span>{item.name}</span>
    </Link>
  )

  return (
    <section className="min-h-[580px] md:bg-MyGray/50 lg:min-w-[20%] rounded-3xl p-4 space-y-6">
      {/* Avatar */}
      <div className="text-center space-y-4">
        <figure className="h-24 w-24 mx-auto rounded-full grid place-items-center overflow-hidden">
          {userProfile ? (
            <Image
              width={90}
              height={90}
              src={userProfile}
              alt="Profile Picture"
              className="w-full h-full rounded-full object-cover transition-opacity duration-200 z-20"
            />
          ) : (
            <FaUser className="h-10 w-10" />
          )}
        </figure>
        <p>سلام {userName}</p>
        {/* آیتم ویرایش پروفایل */}
        {renderMenuItem(DashboardMenuList[0], 0)}
      </div>
      <hr />
      {/* سایر آیتم‌های منو */}
      <div className="space-y-2">
        {DashboardMenuList.slice(1).map((item, index) =>
          renderMenuItem(item, index + 1)
        )}
      </div>
    </section>
  )
}
