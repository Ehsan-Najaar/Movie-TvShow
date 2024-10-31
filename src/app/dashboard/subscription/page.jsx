'use client'

import DashboardMenu from '@/components/DashboardMenu'
import { useState } from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'sweetalert2/src/sweetalert2.scss'

const subscriptions = [
  { id: 1, name: 'اشتراک ماهانه', price: 10000 },
  { id: 2, name: 'اشتراک سه‌ماهه', price: 27000 },
  { id: 3, name: 'اشتراک شش‌ماهه', price: 50000 },
  { id: 4, name: 'اشتراک سالانه', price: 100000 },
]

const MySwal = withReactContent(Swal)

export default function Subscription() {
  const [selectedSubscription, setSelectedSubscription] = useState(null)

  const handlePayment = () => {
    if (!selectedSubscription) {
      Swal.fire({
        title: 'لطفاً یکی از اشتراک‌ها را انتخاب کنید.',
        icon: 'warning',
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#010F1D',
        color: '#ffffff', // تغییر رنگ متن به سفید
        customClass: {
          popup: 'swal-popup', // استفاده از کلاس انیمیشن
          title: 'swal-title', // اضافه کردن کلاس برای عنوان
          timerProgressBar: 'swal-progress-bar',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })
      return
    }

    // نمایش پیام پرداخت موفقیت‌آمیز
    MySwal.fire({
      title: `${selectedSubscription.name} با موفقیت خریداری شد!`,
      icon: 'success',
      toast: true,
      position: 'bottom-start', // قرار دادن پیغام در گوشه پایین سمت راست
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#010F1D',
      color: '#ffffff', // تغییر رنگ متن به سفید
      customClass: {
        popup: 'swal-popup', // استفاده از کلاس انیمیشن
        title: 'swal-title', // اضافه کردن کلاس برای عنوان
        timerProgressBar: 'swal-progress-bar',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4">
      {/* title */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">اشتراک</h2>
        <FiChevronLeft
          className="w-12 h-12 bg-MyGray rounded-full p-2 cursor-pointer"
          onClick={() => window.history.back()}
        />
      </div>

      <div className="min-w-[20%] hidden md:block">
        <DashboardMenu activeIndex={2} />
      </div>

      <div className="bg-MyGray/50 rounded-3xl p-4 shadow-lg w-full">
        <h3 className="text-xl font-bold text-white mb-6">انتخاب اشتراک</h3>

        <div className="grid grid-cols-1 gap-6">
          {subscriptions.map((subscription) => (
            <label
              key={subscription.id}
              className={`p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-sm shadow-MyGray md:hover:mr-4 transition-all duration-300 ${
                selectedSubscription?.id === subscription.id
                  ? 'bg-[#ffabab] shadow-none text-secondary'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="subscription"
                  value={subscription.id}
                  checked={selectedSubscription?.id === subscription.id}
                  onChange={() => setSelectedSubscription(subscription)}
                  className="accent-secondary"
                />
                <span className="text-lg">{subscription.name}</span>
              </div>
              <span className="text-lg font-semibold">
                {subscription.price.toLocaleString()} تومان
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={handlePayment}
          className="primary-button mt-6 w-full md:w-max"
        >
          خرید اشتراک
        </button>
      </div>
    </div>
  )
}
