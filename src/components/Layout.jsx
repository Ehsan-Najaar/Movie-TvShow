'use client'

import Header from '@/components/Header'
import NavBar from '@/components/NavBar'
import NotificationPopup from '@/components/NotificationPopup' // اضافه کردن پاپ‌آپ
import SearchModal from '@/components/SearchModal'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    setShowPopup(true)
  }, [])

  return (
    <main className="md:px-12 md:pb-0 pb-24 pt-6 overflow-hidden">
      <Header
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />
      {/* navbar */}
      <NavBar />
      {showSearchModal && (
        <SearchModal
          showSearchModal={showSearchModal}
          setShowSearchModal={setShowSearchModal}
        />
      )}
      {/* نمایش پاپ‌آپ */}
      <NotificationPopup showPopup={showPopup} setShowPopup={setShowPopup} />
      {children}
    </main>
  )
}
