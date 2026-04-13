'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import StepRenderer from '../components/form/stepRenderer';
import fbEvent from '../services/fbEvents';
import { gtagSendEvent } from '../services/fbEvents';
import { info } from '../../info';
import { motion, AnimatePresence } from 'framer-motion';

import { mexicanStates } from '../catalogs/mexican-states';

const setFormSteps = ({type = 'tienda'}) => ([
  {
    type: 'text',
    name: 'company',
    title: '¿Cuál es el nombre de tu negocio?',
    inputOptions: {required: true},
    placeholder: 'Nombre de tu negocio',
  },
  {
    type: 'radio',
    name: 'companySize',
    title: '¿Cuál opción describe mejor tu negocio?',
    inputOptions: {required: 'Selecciona una por favor'},
    options: [
      {
        value: type === 'tienda' ? '1-punto-venta' : '1-proyecto',
        label: type === 'tienda' ? 'Tengo un punto de venta' : 'Tengo un proyecto',
      },
      {
        value: type === 'tienda' ? 'varios-puntos-venta' : 'varios-proyectos',
        label: type === 'tienda' ? 'Tengo varios puntos de venta' : 'Trabajo varios proyectos',
      },
      {
        value: 'expansion',
        label: 'Quiero abrir o expandirme',
      },
      {
        value: 'por-abrir',
        label: type === 'tienda' ? 'Aún no tengo punto de venta' : 'Estoy por emprender',
      },
    ],
    cols: 1,
  },
  {
    type: 'checkbox',
    name: 'categories',
    title: '¿Qué categorías te interesan?',
    description: 'Selecciona una o varias',
    inputOptions: {required: 'Selecciona al menos una'},
    options: [
      {value: 'jarrones', name: 'Jarrones'},
      {value: 'floreros', name: 'Floreros'},
      {value: 'lamparas', name: 'Lámparas'},
      {value: 'plantas-macetas', name: 'Plantas y macetas'},
      {value: 'nauticos', name: 'Náuticos'},
      {value: 'espejos', name: 'Espejos'},
      {value: 'cuadros', name: 'Cuadros'},
      {value: 'mesas', name: 'Mesas'},
      {value: 'esculturas', name: 'Esculturas y figuras'},
      {value: 'otros', name: 'Otros'},
    ],
    cols: 2,
  },
  {
    type: 'radio',
    name: 'temperature',
    title: '¿En qué etapa estás hoy?',
    inputOptions: {required: 'Selecciona una por favor'},
    options: [
      {
        value: 'hot',
        label: 'Necesito mercancía pronto',
      },
      {
        value: 'mid-near',
        label: 'Tengo pedido planeado para el próximo mes',
      },
      {
        value: 'mid',
        label: 'Estoy comparando opciones',
      },
      {
        value: 'cold',
        label: 'Solo explorando por ahora',
      },
    ],
    cols: 1,
  },
  {
    type: 'radio',
    name: 'agreement',
    title: '¿Tu primera compra estaría dentro de los $20,000 MXN?',
    description: 'Este es el mínimo de activación como distribuidor',
    inputOptions: {required: 'Selecciona una por favor'},
    options: [
      {
        value: 'si',
        label: 'Sí, sin problema',
      },
      {
        value: 'tal-vez',
        label: 'Depende del catálogo',
      },
      {
        value: 'no',
        label: 'Por ahora no',
      },
    ],
    cols: 1,
  },
  {
    type: 'select',
    name: 'state',
    title: '¿En qué estado de la república se encuentra tu negocio?',
    options: mexicanStates,
    inputOptions: {required: true},
    placeholder: 'Selecciona uno',
  },
  {
    type: 'text',
    name: 'city',
    title: '¿Y en qué ciudad?',
    inputOptions: {required: true},
    placeholder: 'Ciudad',
  },
]);

export default function Survey({lead, utm}) {
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
      data.whatsapp = '521' + data.phone?.replace(/^(MX)?\+?(52)?\s?0?1?|\s|\(|\)|-|[a-zA-Z]/g, '');

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
        {phone: payload.phone, externalID: res.id},
      );
      gtagSendEvent(
        'KTQ4CPClh9MbEP3jsKxC',
        {fullName: payload.fullName, phone: payload.whatsapp}
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
          {!showOutro && (
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
                          {formStep === lastInputIndex ? 'Enviar' : 'Siguiente'}
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
  const id = query?.id ?? lead?.id;
  console.log(id);

  if (!id || id === 'undefined' || id === '') {
    return {
      redirect: { permanent: false, destination: '/#contact' },
    };
  }

  return {
    props: {
      lead: {
        id: lead?.id,
        fullName: lead?.fullName ?? '',
        phone: lead?.phone ?? '',
        whatsapp: lead?.whatsapp ?? '',
        sheetRow: lead?.sheetRow ?? '',
        type: lead?.type ?? '',
      },
      utm,
    },
  };
}
