import Link from 'next/link';
import { info } from '../../../info';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const path = router.pathname;
  return (
    <header
      className={`fixed top-0 px-8 bg-white/20 backdrop-blur-sm w-screen shadow-lg ${path === '/survey' ? 'h-[4rem]' : 'h-[6rem]'} flex justify-center z-[999] hover:top-0
      before:absolute  before:w-[32rem] before:aspect-square before:bg-white before:-top-[20rem] before:rounded-full before:shadow-lg
      after:absolute after:w-full after:h-full after:bg-white/20
      `}
    >
      <div className="relative flex items-center z-[10] w-[20rem] aspect-square top-4 p-12">
        <div className="relative flex items-center w-full aspect-square">
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
      </div>
    </header>
  );
}
