'use client'

import Logo from '@/components/Logo'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  FaChevronCircleUp,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa'

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/ehsan-najaar-629769307/',
    icon: <FaLinkedin />,
    label: 'LinkedIn',
  },
  {
    href: 'https://github.com/Ehsan-Najaar',
    icon: <FaGithub />,
    label: 'GitHub',
  },
  {
    href: 'https://www.instagram.com/ehsan_najaar/',
    icon: <FaInstagram />,
    label: 'Instagram',
  },
  {
    href: 'https://www.youtube.com/@root-ehsan-najaar',
    icon: <FaYoutube />,
    label: 'Youtube',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <footer className="circle-gradiant border-t border-MyGray/10 mt-24">
      <div className="flex flex-col items-center gap-6 px-4 py-12">
        <div className="w-[70%] flex flex-col items-center">
          <div className="flex-col items-center justify-center md:flex-row w-72 mr-48 lg:mr-44">
            <Logo />
          </div>
          <h1 className="logo-text">مووی پلی</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1>
            شبکه های اجتماعی <span className="text-2xl text-primary">ما</span>
          </h1>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ href, icon, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="relative border border-MyGray flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition duration-300 ease-in-out"
                data-social={label.toLowerCase()}
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className="text-center text-MyGray px-4">
        &copy; {currentYear} تمامی حقوق مادی و معنوی این وبسایت محفوظ می باشد و
        کپی برداری به هر نحوه پیگرد قانونی خواهد داشت
      </p>

      {/* دکمه اسکرول به بالا */}
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="hidden md:block fixed bottom-4 right-4 text-MyGray p-3 rounded-full z-50"
          initial={{ opacity: 0, y: 50 }} // انیمیشن ابتدایی
          animate={{ opacity: 1, y: 0 }} // انیمیشن هنگام نمایان شدن
          exit={{ opacity: 0, y: 50 }} // انیمیشن هنگام پنهان شدن
          transition={{ duration: 0.3 }} // مدت زمان انیمیشن
        >
          <FaChevronCircleUp className="h-8 w-8" />
        </motion.button>
      )}
    </footer>
  )
}
