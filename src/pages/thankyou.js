import { info } from '../../info';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <section className="relative flex flex-col flex-grow justify-center pt-20 px-0">
      <div className="container md:w-1/2 flex flex-col min-h-[40dvh] items-center justify-center pt-[8rem] gap-8">
        <h2 className="ft-8 text-center">
          ¡Gracias por contactarnos!
        </h2>
        <p className="ft-4 text-center">
          En un momento, uno de nuestros asesores se pondrá en contacto contigo para compartirte nuestro catálogo y beneficios de distribuidor.
        </p>
        <div className="flex flex-col items-center justify-center gap-10">
          <a
            className="ft-2 py-3 px-6 rounded-lg items-center  bg-green-500 hover:bg-green-600 transition-all hover:scale-105"
            href={`https://wa.me/${info.whatsapp.value}`}
          >
            <p className="text-white">
              O contáctanos por <span className="font-semibold">WhatsApp</span>
            </p>
          </a>
        </div>

      </div>
    </section>
  );
}
