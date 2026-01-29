import Link from 'next/link';
import { info } from '../../../info';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';
import { useState } from 'react';
import { emailRegExp, restrictNumber } from '../../utils/formValidators';
import fbEvent, { gtagSendEvent } from '../../services/fbEvents';
import { Select } from './formAtoms';
import { mexicanStates } from '../../catalogs/mexican-states';

export default function OptInForm({lastClick = '', utm = {}}) {
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const methods = useForm({mode: 'all'});
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = methods;

  const onSubmit = (data) => {
    setSending(true);
    data.cleanPhone = '521' + data.phone.replace(/^(MX)?\+?(52)?\s?0?1?|\s|\(|\)|-|[a-zA-Z]/g, '');
    data.origin = 'Notoriovs Landing';
    data.lastClick = lastClick;

    const _fbc = getCookie('_fbc');
    const _fbp = getCookie('_fbp');
    const payload = {...data, _fbc, _fbp, ...utm};

    fetch(info.optInWebhook, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((result) => result.json())
      // Send FB Event
      .then(({id}) => {
        const userData = {email: data.email, phone: data.phone, externalID: id};
        fbEvent('Lead', userData);
        gtagSendEvent('KTQ4CPClh9MbEP3jsKxC', userData);
        setCookie('lead', {...data, id});

        const forwardLink = document.createElement('a');
        forwardLink.href = `https://wa.me/${info.whatsapp.value}`;
        forwardLink.target = '_blank';
        forwardLink.click();

        router.push('/thankyou');

        // router.push(`/survey?id=${id}`);
      })
      .catch(() => {
        const userData = {email: data.email, phone: data.phone, externalID: ''};
        fbEvent('Lead', userData);
        gtagSendEvent('KTQ4CPClh9MbEP3jsKxC', userData);
        setCookie('lead', {...data});

        const forwardLink = document.createElement('a');
        forwardLink.href = `https://wa.me/${info.whatsapp.value}`;
        forwardLink.target = '_blank';
        forwardLink.click();

        router.push('/thankyou');
      });
  };

  console.log(errors);

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register(
            'fullName',
            {
              required: true,
            },
          )}
          className={errors.fullName && '!bg-red-200'}
          placeholder="Nombre"/>
        <input
          {...register(
            'email',
            {
              required: true,
              pattern: {
                value: emailRegExp,
                message: 'Revisa tu correo',
              },
            },
          )}
          className={errors.email && '!bg-red-200'}
          placeholder="Correo electrónico"/>
        <input
          {...register(
            'phone',
            {required: true, maxLength: 10, minLength: 10},
          )}
          className={errors.phone && '!bg-red-200'}
          onKeyDown={restrictNumber}
          placeholder="Numero de WhatsApp"/>
        <Select
          options={mexicanStates}
          name="state"
          inputOptions={{required: true}}
          placeholder="Selecciona un estado"
          className={`rounded-md px-6 py-4 bg-white ${errors.state && '!bg-red-200'}`}
        />

        <input
          {...register(
            'city',
            {required: true},
          )}
          className={errors.city && '!bg-red-200'}
          placeholder="Ciudad o localidad"/>

        <button
          disabled={sending}
          className={`w-full ${sending ? '!bg-transparent' : 'hover:!bg-brand-3'}`}
        >{
          !sending
            ? 'Mándanos un WhatsApp →'
            : <span className="material-symbols-outlined animate-spin">progress_activity</span>
        }</button>

        <div className="mt-4">
          <p className="-ft-3 text-center">No compartiremos tus datos. Al dar clic aceptas nuestra&nbsp;
            <Link href={info.privacyNotice}>política de privacidad</Link>.
          </p>
        </div>
      </form>
    </FormProvider>
  );
}