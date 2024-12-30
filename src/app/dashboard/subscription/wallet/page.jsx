'use client'

import DashboardMenu from '@/components/DashboardMenu'
import { useState } from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'sweetalert2/src/sweetalert2.scss'

const transactions = [
  { id: 1, description: 'واریز پول به کیف پول', amount: 20000 },
  { id: 2, description: 'شارژ کیف پول', amount: 5000 }, // اضافه کردن شارژ کیف پول به عنوان تراکنش
  { id: 3, description: 'شارژ کیف پول', amount: 15000 }, // مثال دیگر برای شارژ
  { id: 4, description: 'شارژ کیف پول', amount: 30000 }, // مثال دیگر برای شارژ
]

const MySwal = withReactContent(Swal)

export default function Wallet() {
  const currentBalance = 50000
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleTransactionSuccess = () => {
    if (!selectedTransaction) {
      MySwal.fire({
        title: 'لطفاً یک تراکنش را انتخاب کنید.',
        icon: 'warning',
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#010F1D',
        color: '#ffffff',
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          timerProgressBar: 'swal-progress-bar',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })
      return
    }

    MySwal.fire({
      title: `تراکنش ${selectedTransaction.id} با موفقیت انجام شد!`,
      icon: 'success',
      toast: true,
      position: 'bottom-start',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#010F1D',
      color: '#ffffff',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        timerProgressBar: 'swal-progress-bar',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 px-4">
      {/* title */}
      <div className="md:hidden flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">کیف پول</h2>
        <FiChevronLeft
          className="w-12 h-12 bg-MyGray rounded-full p-2 cursor-pointer"
          onClick={() => window.history.back()}
        />
      </div>

      <div className="min-w-[20%] hidden md:block">
        <DashboardMenu activeIndex={3} />
      </div>

      <div className="bg-MyGray/50 rounded-3xl p-4 shadow-lg w-full">
        <h3 className="text-xl font-bold text-white mb-6">موجودی کیف پول</h3>
        <p className="text-lg text-white mb-4">
          موجودی فعلی: {currentBalance.toLocaleString()} تومان
        </p>

        <div className="grid grid-cols-1 gap-6">
          {transactions.map((transaction) => (
            <label
              key={transaction.id}
              className={`p-4 rounded-lg cursor-pointer flex justify-between items-center shadow-sm shadow-MyGray md:hover:mr-4 transition-all duration-300 ${
                selectedTransaction?.id === transaction.id
                  ? 'bg-[#ffabab] shadow-none text-secondary'
                  : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="transaction"
                  value={transaction.id}
                  checked={selectedTransaction?.id === transaction.id}
                  onChange={() => setSelectedTransaction(transaction)}
                  className="accent-secondary"
                />
                <span className="text-lg">{transaction.description}</span>
              </div>
              <span className="text-lg font-semibold">
                {transaction.amount.toLocaleString()} تومان
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={handleTransactionSuccess}
          className="primary-button mt-6 w-full md:w-max"
        >
          شارژ کیف پول
        </button>
      </div>
    </div>
  )
}
