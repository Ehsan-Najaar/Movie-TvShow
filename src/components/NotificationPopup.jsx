export default function NotificationPopup({ showPopup, setShowPopup }) {
  const handleClose = () => {
    setShowPopup(false)
  }

  return (
    showPopup && (
      <div className="fixed inset-0 flex items-center justify-center z-40">
        <div className="bg-secondary shadow-md shadow-MyGray p-6 rounded-lg w-[90%] max-w-md z-50">
          <h2 className="text-xl font-bold mb-4">
            لطفا فیلتر شکن یا وی‌پی‌ان خود را روشن کنید !
          </h2>
          <p className="text-gray-400 mb-4">
            برای تجربه بهتر و دسترسی به تمامی امکانات وب‌سایت، لطفاً وی‌پی‌ان
            خود را روشن کنید.
          </p>
          <button onClick={handleClose} className="primary-outline-button">
            متوجه شدم
          </button>
        </div>
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={handleClose}
        />
      </div>
    )
  )
}
