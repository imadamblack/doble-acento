import Link from 'next/link';
import { info } from '../../../info';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const path = router.pathname;
  return (
    <>
      <header
        className={`top-0 px-8 py-4 bg-white backdrop-blur-sm w-screen shadow-lg ${path === '/survey' ? 'h-[4rem]' : 'h-[6rem]'} flex justify-center z-[999] hover:top-0`}
      >
        <div className="relative flex items-center w-full">
          <Link href="/" passhref>
            <a>
              <Image
                src={logo}
                alt={info.companyName}
                layout="fill"
                objectFit="contain"
              />
            </a>
          </Link>
        </div>
      </header>
      <div className="bg-red-500 w-full text-white p-4 sticky top-0 z-40">
        <p className="-ft-2 font-semibold text-center">Solo en {new Date().toLocaleString('es-ES', {month: 'long'})}:
          Envío
          GRATIS en tu primera compra desde $20,000*</p>
      </div>
    </>
  )
    ;
}
