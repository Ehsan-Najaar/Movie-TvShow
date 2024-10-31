// app/not-found.js
import Image from 'next/image'
import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse items-center justify-center text-center md:text-left p-8">
      {/* تصویر سمت چپ */}
      <div className="md:w-1/2">
        <Image
          src="/images/404.svg"
          alt="صفحه پیدا نشد"
          width={400}
          height={300}
          className="w-full h-auto"
        />
      </div>

      {/* متن سمت راست */}
      <div className="md:w-1/2 md:pl-8 md:text-right">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="mt-4 text-2xl">صفحه‌ای که دنبالش هستید پیدا نشد.</p>
        <p className="mt-2 text-lg text-gray-400">
          ممکن است لینک اشتباه باشد یا صفحه‌ای که به دنبال آن هستید دیگر موجود
          نیست.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-primary px-4 py-2 rounded text-secondary"
        >
          به صفحه اصلی بروید
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
