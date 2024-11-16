/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
    unoptimized: true, // غیرفعال کردن بهینه‌سازی تصاویر
    loader: 'imgix', // اگر نیاز دارید می‌توانید از imgix به عنوان لودر استفاده کنید
    path: 'https://image.tmdb.org/t/p/', // مسیر پیش‌فرض برای تصاویر
  },
  // تنظیمات مربوط به Cache-Control
  async headers() {
    return [
      {
        source: '/_next/image', // مسیر درست
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // مدت زمان کش طولانی برای تصاویر
          },
        ],
      },
    ]
  },
}

export default nextConfig
