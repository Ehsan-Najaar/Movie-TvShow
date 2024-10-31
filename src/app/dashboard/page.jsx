'use client'

import DashboardMenu from '@/components/DashboardMenu'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        router.push('/dashboard/favorites')
      }
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [router])

  return (
    <div className="px-4 md:hidden">
      <DashboardMenu />
    </div>
  )
}
