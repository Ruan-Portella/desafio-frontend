import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Toast } from 'primereact/toast';
import axios from 'axios'
import React, { FormEvent, useRef } from 'react'
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

type ErrorMessage = {
  [key: string]: string
}

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
});

const translateErrors: ErrorMessage = {
  "Invalid password": "Senha inválida"
}

export default function FormLogin() {
  const router = useRouter()
  const toast = useRef<Toast>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: {email: string, password: string}) => {
    try {
      const response = await axios.post('/api/auth/user/sign-in', {
        email: data.email,
        password: data.password
      });
      if (toast.current) {
        toast.current.show({ severity: 'success', summary: 'Info', detail: 'Login realizado com sucesso!' });
      }
      localStorage.setItem('token', response.data.token)
      router.refresh();
      router.push('/dashboard');
    } catch (error: any) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Info', detail: `${translateErrors[error.response.data]}` });
      }
    }
  };

  const getFormErrorMessage = (name: 'email' | 'password') => {
    return form.formState.errors[name] ? <small className="text-red-400 w-full flex justify-end mt-1">{form.formState.errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
  };

  return (
    <form {...form} onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-1 w-1/2 max-sm:w-11/12'>
      <Toast ref={toast} />
      <Controller
        name='email'
        control={form.control}
        render={({ field, fieldState }) => (
          <div>
            <span className="p-float-label">
              <InputText {...field} className={`${classNames({ 'p-invalid': fieldState.error, })} w-full`} />
              <label htmlFor="email">Email</label>
            </span>
            {getFormErrorMessage('email')}
          </div>
        )}
      />
      <Controller
        name='password'
        control={form.control}
        render={({ field, fieldState }) => (
          <div>
            <span className="p-float-label">
              <Password {...field} toggleMask className={`${classNames({ 'p-invalid': fieldState.error, })} w-full`} feedback={false} inputClassName='w-full'  />
              <label htmlFor="password">Password</label>
            </span>
            {getFormErrorMessage('password')}
          </div>
        )}
      />
      <Button label='Entrar' loading={isLoading} />
    </form>
  )
}
