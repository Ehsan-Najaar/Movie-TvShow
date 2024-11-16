import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href={'/'} className="w-max text-center">
      <Image
        src={'/images/logo2.png'}
        width={100}
        height={100}
        alt=""
        className="cursor-pointer"
      />
    </Link>
  )
}
