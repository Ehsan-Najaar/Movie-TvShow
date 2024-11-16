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
    path: 'https://image.tmdb.org/t/p/', // مسیر پیش‌فرض برای تصاویر
  },
  async headers() {
    return [
      {
        source: '/_next/image', // مسیر درست برای درخواست‌های تصاویر
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
