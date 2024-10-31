'use client'

import DashboardMenu from '@/components/DashboardMenu'
import { FiChevronLeft } from 'react-icons/fi'

// اضافه کردن تاریخ به هر پیغام
const messages = [
  { id: 1, text: 'خوش آمدید به دنیای فیلم و سریال!', date: '1403/07/01' },
  { id: 2, text: 'پیشنهاداتی برای تماشا به زودی!', date: '1403/07/02' },
]

export default function Messages() {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-4">
      {/* title */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">پیغام‌ها</h2>
        <FiChevronLeft
          className="w-12 h-12 bg-MyGray rounded-full p-2 cursor-pointer"
          onClick={() => window.history.back()}
        />
      </div>

      <div className="min-w-[20%] hidden md:block">
        <DashboardMenu activeIndex={4} />
      </div>

      <div className="bg-MyGray/50 rounded-3xl p-4 text-secondary w-full">
        <h3 className="text-xl font-bold mb-4 text-white">پیغام‌های جدید</h3>
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className="p-4 bg-gray-500 rounded-md text-white"
            >
              <span className="font-medium">پیغام {message.id}: </span>
              <span>{message.text}</span>
              <div className="mt-2 text-sm text-gray-300">{message.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
