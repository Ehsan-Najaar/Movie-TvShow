'use client'

import Search from '@/components/Search'

export default function SearchModal({ showSearchModal, setShowSearchModal }) {
  const handleCloseModal = (e) => {
    if (e.target.id === 'backgroundModal') {
      setShowSearchModal(false)
    }
  }

  return (
    <div
      id="backgroundModal"
      className="fixed top-0 right-0 h-screen w-screen bg-black/70 grid place-items-start p-8 z-50"
      onClick={handleCloseModal}
    >
      <div
        id="backgroundModal"
        className="w-2/3 mx-auto flex flex-col items-center gap-4"
        onClick={handleCloseModal}
      >
        <div
          className={`relative w-full transition-transform duration-1000 ease-in-out`}
        >
          {/* search box */}
          <Search
            showSearchModal={showSearchModal}
            setShowSearchModal={setShowSearchModal}
          />
        </div>
      </div>
    </div>
  )
}
