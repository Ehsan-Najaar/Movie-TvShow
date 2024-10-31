'use client'

import DashboardMenu from '@/components/DashboardMenu'
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import { FaReply } from 'react-icons/fa'
import { FiChevronLeft } from 'react-icons/fi'

const feedbackQuestions = [
  {
    id: 1,
    movieTitle: 'فیلم الف',
    text: 'چه فیلم‌هایی برای تماشا توصیه می‌کنید؟',
    likes: 10,
    dislikes: 2,
  },
  {
    id: 2,
    movieTitle: 'سریال ب',
    text: 'آیا سریال X فصل جدیدی دارد؟',
    likes: 5,
    dislikes: 1,
  },
]

export default function FeedBack() {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-4">
      {/* title */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">نظرات</h2>
        <FiChevronLeft
          className="w-12 h-12 bg-MyGray rounded-full p-2 cursor-pointer"
          onClick={() => window.history.back()}
        />
      </div>

      <div className="min-w-[20%] hidden md:block">
        <DashboardMenu activeIndex={5} />
      </div>
      <div className="bg-MyGray/50 rounded-3xl p-4 text-secondary w-full">
        <h3 className="text-xl font-bold mb-4 text-white">نظرات کاربران</h3>
        <ul className="space-y-4">
          {feedbackQuestions.map((question) => (
            <li
              key={question.id}
              className="flex-col md:flex-row  gap-4 bg-gray-500 rounded-md text-white flex justify-between p-4"
            >
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#ffabab]">
                  {question.movieTitle}
                </span>
                <span className="mt-1">{question.text}</span>
              </div>
              <div className="w-full md:w-max flex items-center justify-end gap-2 cursor-pointer mt-2">
                <div className="flex items-center gap-2">
                  <AiOutlineLike className="mr-2 w-6 h-6" />
                  <span>{question.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AiOutlineDislike className="text-gray-300 mr-2 w-6 h-6" />
                  <span>{question.dislikes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaReply className="mr-2 w-6 h-6 cursor-pointer" />
                  <span>پاسخ</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
