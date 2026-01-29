import { info } from "../../../info";
import Image from 'next/image';
import notoriovs from '../../../public/notoriovs.png';

export default function Footer() {
  return (
    <footer className="relative mb-0  border-t">
      <div className="bg-black py-6">
        <div className="container flex flex-col md:flex-row items-start justify-start gap-8 text-white p-8">
          <div className="flex flex-col md:flex-row gap-2">
            <p>Todos los derechos reservados.</p>
            <div className="flex gap-2 mr-3">
              <p>{info.companyName}</p>
              <p className="material-icons">close</p>
              <a href="https://marketing.notoriovs.com"
                 target="_blank"
                 className="relative w-[13rem] top-0.5">
                <Image src={notoriovs} className="invert"/>
              </a>
            </div>
            <p>©{" "}{new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
