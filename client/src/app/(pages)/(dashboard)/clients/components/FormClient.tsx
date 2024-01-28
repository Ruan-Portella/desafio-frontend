'use client';

import React, { useRef } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Toast } from 'primereact/toast';
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Controller } from 'react-hook-form';

type ErrorMessage = {
  [key: string]: string
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpf: z.string().min(11, { message: 'CPF deve ter no mínimo 11 caracteres' }),
});

const translateErrors: ErrorMessage = {
  "Client already exists": "Cliente já existe"
}

export default function FormClient({
  initialData
}: {initialData?: {name: string, email: string, cpf: string}}) {
  const router = useRouter()
  const {clientId} = useParams();
  const toast = useRef<Toast>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      cpf: ''
    } 
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: {name: string, email: string, cpf: string}) => {
    try {
      if (initialData) {
        await axios.put(`/api/clients/${clientId}`, {
          name: data.name,
          email: data.email,
          cpf: data.cpf
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Cliente atualizado com sucesso!' });
        }
      } else {
        await axios.post('/api/clients', {
          name: data.name,
          email: data.email,
          cpf: data.cpf
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Cliente criado com sucesso!' });
        }
      }
      router.refresh();
      router.push('/clients');
    } catch (error: any) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Info', detail: `${translateErrors[error.response.data]}` });
      }
    }
  };

  const getFormErrorMessage = (name: 'email' | 'cpf' | 'name') => {
    return form.formState.errors[name] ? <small className="text-red-400 w-full flex justify-end mt-1">{form.formState.errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
  };

  return (
    <div className='h-full'>
      <h1 className="font-semibold text-[24px] text-black font-nunito leading-[32px]">
        {
          initialData ? 'Atualizar Cliente' : 'Cadastrar Cliente'
        }
      </h1>
      <p className="text-[16px] font-normal leading-6 text-[#6B7280]">Por favor, preencha todos os campos</p>
      <div className='w-full flex justify-center'>
        <form {...form} onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-1 mt-10 w-1/2 max-sm:w-full'>
          <Toast ref={toast} />
          <Controller
            name='name'
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="name" className="text-[#6B7280] text-[14px] font-normal leading-6">Nome</label>
                <InputText
                  id="name"
                  {...field}
                  className={`w-full rounded-md ${fieldState.invalid ? 'border-red-400' : 'border-[#6B7280]'} `}
                />
                {getFormErrorMessage('name')}
              </div>
            )}
          />
          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="email" className="text-[#6B7280] text-[14px] font-normal leading-6">Email</label>
                <InputText
                  id="email"
                  {...field}
                  className={`w-full rounded-md ${fieldState.invalid ? 'border-red-400' : 'border-[#6B7280]'} `}
                />
                {getFormErrorMessage('email')}
              </div>
            )}
          />
          <Controller
            name='cpf'
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="cpf" className="text-[#6B7280] text-[14px] font-normal leading-6">CPF</label>
                <InputMask
                  id="cpf"
                  {...field}
                  mask="999.999.999-99"
                  className={`w-full rounded-md ${fieldState.invalid ? 'border-red-400' : 'border-[#6B7280]'} `}
                />
                {getFormErrorMessage('cpf')}
              </div>
            )}
          />
          <div className="flex justify-end">
            <Button
              label={initialData ? 'Atualizar' : 'Cadastrar'}
              disabled={isLoading}
              loading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  )
}