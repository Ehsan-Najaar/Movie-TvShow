'use client'

import DashboardMenu from '@/components/DashboardMenu'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaImage, FaUser } from 'react-icons/fa'
import { FiChevronLeft } from 'react-icons/fi'
import Swal from 'sweetalert2'

export default function EditAccount() {
  const [currentName, setCurrentName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [toggleRender, setToggleRender] = useState(false) // اضافه کردن state جدید

  // بارگذاری نام کاربر و تصویر پروفایل از Local Storage
  useEffect(() => {
    const savedName = localStorage.getItem('userName')
    const savedProfile = localStorage.getItem('userProfile')

    if (savedName) {
      setCurrentName(savedName)
    }
    if (savedProfile) {
      setProfileImage(savedProfile)
    }
  }, [toggleRender]) // اضافه کردن dependency برای ریرندر شدن

  // تابع برای ذخیره تصویر پروفایل
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result) // ذخیره تصویر در state
        localStorage.setItem('userProfile', reader.result) // ذخیره در Local Storage
      }
      reader.readAsDataURL(file) // خواندن تصویر به صورت Base64
    } else {
      console.warn('لطفاً یک تصویر معتبر انتخاب کنید.')
    }
  }

  // تابع ثبت تغییرات
  const handleSubmit = (e) => {
    e.preventDefault()

    // ذخیره نام کاربری و تصویر پروفایل در Local Storage
    localStorage.setItem('userName', currentName)
    localStorage.setItem('userProfile', profileImage)

    // بررسی مطابقت رمز عبور
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'خطا!',
        text: 'رمز عبور و تأیید رمز عبور باید برابر باشند!',
      })
      return
    }

    // نمایش پیام تأیید با SweetAlert2
    Swal.fire({
      position: 'bottom-left',
      icon: 'success',
      title: 'اطلاعات شما آپدیت شد',
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      background: '#2c3e50',
      color: '#ecf0f1',
      iconColor: '#27ae60',
    })

    // تغییر دادن state برای ریرندر شدن کامپوننت
    setToggleRender(!toggleRender)
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4">
      {/* عنوان */}
      <div className="md:hidden flex items-center justify-between">
        <h2 className="text-xl font-bold">ویرایش پروفایل</h2>
        <FiChevronLeft
          className="w-12 h-12 bg-MyGray rounded-full p-2 cursor-pointer"
          onClick={() => window.history.back()}
        />
      </div>

      <div className="min-w-[20%] hidden md:block">
        <DashboardMenu activeIndex={0} />
      </div>

      <div className="bg-MyGray/50 rounded-3xl p-4 text-white w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* فیلد انتخاب عکس پروفایل */}
          <figure className="w-24 h-24 relative mx-auto group">
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-30"
              onClick={(e) => {
                e.target.value = null // برای امکان انتخاب مجدد
              }}
            />
            {profileImage ? (
              <Image
                width={90}
                height={90}
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover transition-opacity duration-200 z-20"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full rounded-full bg-gray-300">
                <FaUser className="text-gray-500 w-12 h-12" />
              </div>
            )}

            {/* آیکون ادیت */}
            <div className="absolute inset-0 flex items-center justify-center bg-black cursor-pointer bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-opacity duration-200 z-10">
              <FaImage className="text-white w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </figure>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              id="userName"
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              className="input"
              placeholder="نام"
              maxLength={25}
            />
            <input
              id="userEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="ایمیل"
            />
          </div>

          <div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <input
                id="userPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="رمز عبور جدید"
              />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="تکرار رمز عبور"
              />
            </div>
            <small className="text-yellow-200 text-[11px] pr-4">
              اگر می‌خواهید رمز عبور خود را عوض کنید، این فیلد و فیلد بعدی را پر
              کنید.
            </small>
          </div>

          <button type="submit" className="primary-button w-full md:w-max">
            ذخیره تغییرات
          </button>
        </form>
      </div>
    </div>
  )
}
