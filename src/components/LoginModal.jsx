import Link from 'next/link' // Import Link
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

export default function LoginModal({ setShowLoginModal }) {
  const [section, setSection] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const validEmail = 'test@gmail.com'
  const validPassword = '1234'

  const handleCloseModal = (e) => {
    if (e.target.id === 'backgroundModal') {
      setShowLoginModal(false)
    }
  }

  return (
    <div
      id="backgroundModal"
      className="fixed top-0 right-0 h-screen w-screen bg-black/50 grid place-items-center z-50"
      onClick={handleCloseModal}
    >
      <div className="max-w-[350px] bg-secondary border-2 rounded-2xl border-MyGray p-4 space-y-8">
        <div className="flex items-center justify-around bg-MyGray/20 rounded-full cursor-pointer">
          <p
            className={`w-full text-center rounded-full p-2 ${
              section === 'login' ? 'bg-MyGray' : ''
            }`}
            onClick={() => {
              setSection('login')
            }}
          >
            ورود
          </p>
          <p
            className={`w-full text-center rounded-full p-2 ${
              section === 'signup' ? 'bg-MyGray' : ''
            }`}
            onClick={() => {
              setSection('signup')
            }}
          >
            ثبت نام
          </p>
        </div>
        <div className="space-y-6">
          {section === 'signup' && (
            <input type="text" placeholder="نام کاربری" className="input" />
          )}
          <input
            type="text"
            placeholder={section === 'signup' ? 'ایمیل' : 'نام کاربری یا ایمیل'}
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
            onPaste={(e) => e.preventDefault()}
          />
          {section === 'login' && (
            <div className="text-MyGray scale-95">
              <p className="text-yellow-400">توجه</p>
              <small> - ایمیل و رمز برای تجربه بخش کاربر</small>
              <p className="flex items-center gap-2">
                <small>ایمیل : </small>
                <span>{validEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <small>رمز : </small>
                <span>{validPassword}</span>
              </p>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {section === 'login' ? (
            <Link
              href={
                email === validEmail && password === validPassword
                  ? '/dashboard/favorites'
                  : '#'
              }
            >
              <button
                type="button"
                className="primary-button w-full"
                onClick={() => {
                  email === validEmail && password === validPassword
                    ? setShowLoginModal(false)
                    : ''
                }}
              >
                ورود
              </button>
            </Link>
          ) : (
            <button type="submit" className="primary-button w-full">
              ثبت نام
            </button>
          )}
          <button className="w-full flex items-center justify-center px-4 py-2 rounded-full bg-MyGray gap-2">
            <FcGoogle className="h-6 w-6" />
            {section === 'signup' ? 'ثبت نام' : 'ورود'} با گوگل
          </button>
        </div>
      </div>
    </div>
  )
}
