'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie, getCookie } from 'cookies-next';
import StepRenderer from '../components/form/stepRenderer';
import fbEvent from '../services/fbEvents';
import { gtagSendEvent } from '../services/fbEvents';
import Image from 'next/image';
import { info } from '../../info';
import { content } from '../../content';
import { motion, AnimatePresence } from 'framer-motion';

import logo from '../../public/logo.png';

const Intro = () => <motion.div
  key="intro"
  initial={{opacity: 0}}
  animate={{opacity: 1}}
  exit={{opacity: 0}}
  transition={{duration: 0.5}}
  className="bg-[url('/landing/hero.jpg')] bg-center bg-cover relative flex-grow flex flex-col items-center justify-end px-4 py-12"
>
  <div className="absolute mx-auto inset-x-0 w-[32rem] h-[10rem] top-[4rem] brightness-200">
    <Image src={logo} layout="fill" className="object-contain"/>
  </div>

  <div className="absolute bg-gradient-to-t from-brand-1 to-transparent bottom-0 h-[60dvh] w-full "/>

  <div className="container flex flex-col justify-center items-center z-10">
    <h1 className="ft-11 text-white font-semibold my-12 text-center">{content.hero.banner.title}</h1>
    <p className="ft-4 font-medium text-white text-center">En menos de un minuto sabrás si tienes algo que vale más de lo que esperas</p>

    <div className="w-full max-w-[50rem] h-12 p-2 mt-16 mb-4 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        initial={{width: '0%'}}
        animate={{width: '100%'}}
        transition={{duration: 5, ease: 'easeInOut'}}
        className="h-full bg-gradient-to-br from-blue-800 to-indigo-500 rounded-2xl"
      />
    </div>
    <p className="-ft-1 flex items-center text-center text-gray-100">
      Cargando
      <span
        className="-ft-1 material-symbols-outlined animate-spin ml-4">progress_activity</span>
    </p>
  </div>
</motion.div>;

const setFormSteps = ({fullName, phone}) => ([
  {
    type: 'radio',
    name: 'pieza',
    title: '¿Qué tipo de pieza quieres vender?',
    inputOptions: {required: 'Selecciona una por favor'},
    options: [
      // {
      //   value: 'reloj',
      //   label: 'Reloj de lujo (Rolex, Omega, Cartier, etc...)',
      // },
      {
        value: 'joyeria-oro',
        label: 'Joyería de oro',
      },
      {
        value: 'joyeria-plata',
        label: 'Joyería de plata',
      },
      // {
      //   value: 'piedras',
      //   label: 'Piezas con diamantes o piedras preciosas',
      // },
      {
        value: 'oro',
        label: 'Centenarios o monedas de oro',
      },
      {
        value: 'plata',
        label: 'Onzas o artículos de plata',
      },
    ],
    cols: 1,
  },
  // {
  //   type: 'radio',
  //   name: 'estado',
  //   title: '¿Cuál es el estado general de la pieza?',
  //   inputOptions: {required: 'Selecciona una por favor'},
  //   options: [
  //     {
  //       value: 'como-nuevo',
  //       label: 'Perfecto / como nueva',
  //     },
  //     {
  //       value: 'normal',
  //       label: 'Buen estado con uso normal',
  //     },
  //     {
  //       value: 'detalles',
  //       label: 'Con detalles o desgaste visible',
  //     },
  //     {
  //       value: 'no-sabe',
  //       label: 'Maltratada',
  //     },
  //   ],
  //   cols: 1,
  // },
  {
    type: 'radio',
    name: 'motivo',
    title: '¿Por qué te interesa vender estas piezas?',
    inputOptions: {required: 'Selecciona una por favor'},
    options: [
      {
        value: 'liquidez',
        label: 'Necesito liquidez',
      },
      {
        value: 'compra',
        label: 'Quiero comprar otras piezas',
      },
      {
        value: 'sin-uso',
        label: 'Solo porque no las uso',
      },
      {
        value: 'valoracion',
        label: 'Solo quiero una valoración sin compromiso',
      },
    ],
    cols: 1,
  },
  {
    type: 'checkpoint',
    name: 'checkpoint-1',
    autoAdvance: true,
    render: () => (
      <div className={`relative flex-grow`}>
        <p className="ft-6 sans text-center font-bold">{content.testimonios.banner.title}</p>
        <div className="relative w-full my-8 pt-[80%] rounded-2xl overflow-hidden">
          <Image src="/landing/testimonios.jpg" layout="fill" objectFit="cover"/>
        </div>
        <div className="container my-40">
          <div className="grid grid-cols-1 gap-16 items-stretch">
            {content.testimonios.content.items.map((i, idx) =>
              <div className="relative flex flex-col p-12 pt-32 border border-yellow-500 shadow-md">
                <p className="!text-[16rem] absolute -top-28 -left-2 material-icons">format_quote</p>
                <p className="ft-2 font-medium flex-grow my-20">{i.description}</p>
                <p className="ft-1 text-right">
                  {i.title}
                </p>
              </div>,
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    type: 'radio',
    name: 'valoracion',
    title: '¿Has recibido una valoración antes?',
    inputOptions: {required: 'Selecciona una por favor'},
    options: [
      {
        value: 'con-valoracion-previa',
        label: 'Sí pero no me convenció',
      },
      {
        value: 'comparando-opciones',
        label: 'Sí, estoy comparando',
      },
      {
        value: 'primera-vez',
        label: 'No, apenas estoy buscando',
      },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'inmediatez',
    title: '¿Qué tanta urgencia tienes por vender esta pieza?',
    inputOptions: {required: 'Selecciona una por favor'},
    options: [
      {
        value: 'inmediato',
        label: 'Lo antes posible!',
      },
      {
        value: 'no-sabe',
        label: 'Más adelante, estoy explorando',
      },
      {
        value: 'depende',
        label: 'Depende de la valoración',
      },
    ],
    cols: 1,
  },
  // {
  //   type: 'radio',
  //   name: 'sucursal',
  //   title: '¿Qué sucursal te queda mejor para traer tus piezas?',
  //   inputOptions: {required: 'Selecciona una por favor'},
  //   options: [
  //     {
  //       value: 'polanco',
  //       label: 'Plaza Polanco',
  //     },
  //     {
  //       value: 'cuspide',
  //       label: 'La Cúspide Sky Mall',
  //     },
  //   ],
  //   cols: 1,
  // },
  {
    type: 'opt-in',
    title: 'Ok, estamos listos para recibirte en nuestra boutique',
    description: 'Compárteme tu nombre y WhatsApp para programar tu valoración presencial.',
    fields: [
      {
        type: 'text',
        name: 'fullName',
        title: 'Tu nombre completo',
        inputOptions: {value: fullName, required: 'Cómo te llamas?'},
      },
      {
        type: 'tel',
        name: 'phone',
        title: 'Tu WhatsApp',
        inputOptions: {
          value: phone,
          required: 'Cuál es tu WhatsApp?',
          maxLength: {value: 10, message: 'Tu tel a 10 digitos'},
          minLength: {value: 10, message: 'Tu tel a 10 digitos'},
        },
      },
    ],
  },
]);

export default function Survey({lead, utm}) {
  const [showIntro, setShowIntro] = useState(true);
  const [showOutro, setShowOutro] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [inputError, setInputError] = useState(null);
  const [sending, setSending] = useState(false);

  const methods = useForm({mode: 'all'});
  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
  } = methods;
  const router = useRouter();

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [showIntro]);
  useEffect(() => {
    const current = formSteps[formStep];

    if (current.autoAdvance) {
      const timer = setTimeout(() => {
        setFormStep((prev) => Math.min(prev + 1, formSteps.length - 1));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [formStep]);
  useEffect(() => {
    const step = formSteps[formStep];

    if (step?.type === 'checkpoint') {
      fbEvent(step?.name);
      gtag('event', step?.name.replace('-', '_'))
    }
  }, [formStep]);

  let formSteps = setFormSteps({fullName: lead.fullName, phone: lead.phone});

  const lastInputIndex = formSteps.reduce((lastIndex, step, i) => {
    return step.type !== 'checkpoint' ? i : lastIndex;
  }, 0);
  const handleNext = async () => {
    const currentStep = formSteps[formStep];

    if (currentStep.name === 'user') {
      formSteps = setFormSteps({fullName: lead.fullName, phone: lead.phone, user: watch('user')});
    }

    if (currentStep.type === 'checkpoint') {
      return setFormStep((prev) => Math.min(prev + 1, formSteps.length - 1));
    }

    const valid = await methods.trigger(currentStep.name);
    if (!valid) {
      setInputError(formStep);
      return;
    }

    setInputError(null);
    window.scrollTo(0, 0);
    setFormStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };
  const onSubmit = async (data) => {
    setSending(true);
    try {
      data.whatsapp = '521' + data.phone.replace(/^(MX)?\+?(52)?\s?0?1?|\s|\(|\)|-|[a-zA-Z]/g, '');

      const payload = {...lead, ...data, ...utm};

      const res = await fetch(info.optInWebhook, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      fbEvent(
        'Lead',
        {phone: data.phone, externalID: res.id},
      );
      gtagSendEvent(
        '_MzdCKfprrEbEP6klOBB',
        {fullName: data.fullName, phone: data.whatsapp}
      );


      setCookie('lead', {...data, id: res.id});

      await router.push('/thankyou');

    } catch (err) {
      console.error('Error al enviar formulario:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="relative flex flex-col flex-grow bg-gradient-to-t from-blue-50 to-white">
        <AnimatePresence mode="wait">
          {showIntro && (
            <Intro/>
          )}
          {!showIntro && !showOutro && (
            <motion.div
              key="survey"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.5}}
              className="flex flex-col flex-grow pb-[8rem]"
            >
              <div className="sticky top-0 bg-white mx-auto w-full max-w-[56rem] p-8 z-10">
                <div className="relative bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-4 bg-brand-1`} style={{width: `${((formStep + 1) / formSteps.length) * 100}%`}}/>
                </div>
              </div>
              <div
                className="relative container !px-0 md:pb-0 flex flex-col flex-grow md:flex-grow-0 items-center pointer-events-auto touch-auto">
                <div className="survey-card">
                  <FormProvider {...methods}>
                    <form className="flex flex-col flex-grow" onSubmit={handleSubmit(onSubmit)}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={formStep} // importante para animaciones entre pasos
                          initial={{opacity: 0, x: 100}}
                          animate={{opacity: 1, x: 0}}
                          exit={{opacity: 0, x: -100}}
                          transition={{duration: 0.4, ease: 'easeInOut'}}
                        >
                          <StepRenderer
                            step={formSteps[formStep]}
                            index={formStep}
                            currentStep={formStep}
                            errors={errors}
                            inputError={inputError}
                            errorMessage={errors[formSteps[formStep]?.name]?.message}
                            register={register}
                          />
                        </motion.div>
                      </AnimatePresence>
                      <div
                        className={`fixed p-8 bottom-0 inset-x-0 grid ${formSteps[formStep].type === 'checkpoint' ? 'grid-cols-1' : 'grid-cols-2'} gap-8 w-full mt-auto bg-white border-t-2 border-gray-200 z-50`}>
                        {formSteps[formStep].type !== 'checkpoint' &&
                          <button
                            type="button"
                            onClick={() => setFormStep(formStep - 1)}
                            className="!bg-transparent !text-brand-1 border-none !w-full hover:text-brand-1 disabled:!text-gray-100"
                            disabled={formStep <= 0}
                          >Atrás
                          </button>
                        }
                        <button
                          type="button"
                          disabled={sending}
                          onClick={() => {
                            if (formStep === lastInputIndex) {
                              handleSubmit(onSubmit)();
                            } else {
                              handleNext();
                            }
                          }}
                          className="mt-auto !w-full"
                        >
                          {sending && <span className="animate-spin mr-4">+</span>}
                          {formStep === lastInputIndex ? 'Continuar' : 'Siguiente'}
                        </button>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { req, query } = ctx;
  const cookiesHeader = req.headers.cookie || '';

  const keys = ['utm', '_fbc', '_fbp', 'lead'];
  const cookies = {};

  for (const key of keys) {
    const raw = cookiesHeader
      .split('; ')
      .find(c => c.startsWith(`${key}=`))
      ?.split('=')[1];

    if (!raw) continue;

    try {
      const clean = raw.startsWith('j%3A') ? raw.slice(4) : raw;
      cookies[key] = JSON.parse(decodeURIComponent(clean));
    } catch {
      cookies[key] = decodeURIComponent(raw);
    }
  }

  // --- Revisar params UTM del query ---
  const utmFromQuery = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    if (query[param]) utmFromQuery[param] = query[param];
  });

  // Si hay params en la URL, se usan; si no, cae en cookie
  const utm =
    Object.keys(utmFromQuery).length > 0
      ? utmFromQuery
      : cookies.utm ?? null;

  const { lead } = cookies;

  return {
    props: {
      lead: {
        fullName: lead?.fullName ?? '',
        phone: lead?.phone ?? '',
        whatsapp: lead?.whatsapp ?? '',
        sheetRow: lead?.sheetRow ?? '',
      },
      utm,
    },
  };
}
