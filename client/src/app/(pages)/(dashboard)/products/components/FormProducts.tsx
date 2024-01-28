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
  quantity: z.string().min(1, { message: 'Quantidade inválida' }),
  price: z.string().min(1, { message: 'Preço inválido' }),
});

const translateErrors: ErrorMessage = {
  "product already exists": "Produto já existe"
}

export default function FormProducts({
  initialData
}: {initialData?: {name: string, quantity: string, price: string}}) {
  const router = useRouter()
  const {productId} = useParams();
  const toast = useRef<Toast>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      quantity: '',
      price: ''
    } 
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: {name: string, quantity: string, price: string}) => {
    try {
      if (initialData) {
        await axios.put(`/api/products/${productId}`, {
          name: data.name,
          quantity: data.quantity,
          price: data.price
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Produto atualizado com sucesso!' });
        }
      } else {
        await axios.post('/api/products', {
          name: data.name,
          quantity: data.quantity,
          price: data.price
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Produto criado com sucesso!' });
        }
      }
      router.refresh();
      router.push('/products');
    } catch (error: any) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Info', detail: `${translateErrors[error.response.data]}` });
      }
    }
  };

  const getFormErrorMessage = (name: 'quantity' | 'price' | 'name') => {
    return form.formState.errors[name] ? <small className="text-red-400 w-full flex justify-end mt-1">{form.formState.errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
  };

  return (
    <div className='h-full'>
      <h1 className="font-semibold text-[24px] text-black font-nunito leading-[32px]">
        {
          initialData ? 'Atualizar Produto' : 'Cadastrar Produto'
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
            name='quantity'
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="quantity" className="text-[#6B7280] text-[14px] font-normal leading-6">Quantidade</label>
                <InputMask
                  id="quantity"
                  {...field}
                  mask='99'
                  className={`w-full rounded-md ${fieldState.invalid ? 'border-red-400' : 'border-[#6B7280]'} `}
                />
                {getFormErrorMessage('quantity')}
              </div>
            )}
          />
          <Controller
            name='price'
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="price" className="text-[#6B7280] text-[14px] font-normal leading-6">Preço</label>
                <InputMask
                  id="price"
                  {...field}
                  mask="R$ 99.99"
                  className={`w-full rounded-md ${fieldState.invalid ? 'border-red-400' : 'border-[#6B7280]'} `}
                />
                {getFormErrorMessage('price')}
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