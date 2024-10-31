'use client'

const Pagination = ({
  currentPage,
  totalItems,
  onNext,
  onPrev,
  onPageChange,
}) => {
  const totalVisiblePages = 3 // تعداد صفحات قابل نمایش در وسط
  const itemsPerPage = 8
  const renderPageNumbers = () => {
    const pageNumbers = []
    const itemsPerPage = 8

    // Always show the first page
    if (currentPage > 3) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ease-in-out border-2 bg-transparent text-white border-MyGray"
        >
          1
        </button>
      )

      // Show ellipsis when there are more than 3 pages between the first and current page
      if (currentPage > 4) {
        pageNumbers.push(
          <span key="ellipsis-prev" className="text-white">
            ...
          </span>
        )
      }
    }

    // Show the pages around the current page
    for (let i = Math.max(1, currentPage - 1); i <= currentPage + 1; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ease-in-out border-2 ${
            currentPage === i
              ? 'bg-primary/80 border-none text-secondary'
              : 'bg-transparent text-white border-MyGray'
          }`}
        >
          {i}
        </button>
      )
    }

    // Show the last page button and ellipsis if needed
    if (currentPage < totalVisiblePages - 2) {
      if (currentPage < totalVisiblePages - 3) {
        pageNumbers.push(
          <span key="ellipsis-next" className="text-white">
            ...
          </span>
        )
      }
      pageNumbers.push(
        <button
          key={totalVisiblePages}
          onClick={() => onPageChange(totalVisiblePages)}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ease-in-out border-2 bg-transparent text-white border-MyGray"
        >
          {totalVisiblePages}
        </button>
      )
    }

    return pageNumbers
  }

  return (
    <div className="w-max flex items-center justify-between gap-4 p-4 rounded-full mx-auto bg-secondary fixed-width-container my-8">
      {/* Previous Button */}
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 ease-in-out border-2 ${
          currentPage === 1 ? 'opacity-50' : 'border-MyGray text-white'
        }`}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2">{renderPageNumbers()}</div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={totalItems < itemsPerPage}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 ease-in-out border-2 ${
          totalItems < itemsPerPage
            ? 'opacity-50 cursor-not-allowed'
            : 'border-MyGray text-white'
        }`}
      >
        &gt;
      </button>
    </div>
  )
}

export default Pagination
