import Layout from '@/components/Layout'
import '../../styles/globals.css'

export const metadata = {
  title: 'MoviePlay',
  description: 'Watch Series and Movies on MoviePlay',
  icons: {
    icon: 'images/logo2.png', // Path to your favicon
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-bg-color text-white">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
