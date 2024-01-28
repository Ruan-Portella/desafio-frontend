'use client';

import React, { useEffect, useRef } from 'react'
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
import { Dropdown } from 'primereact/dropdown';

type ErrorMessage = {
  [key: string]: string
}

const formSchema = z.object({
  clientId: z.object({ name: z.string(), code: z.string()}),
  productId: z.object({ name: z.string(), code: z.string() }),
  quantity: z.string().min(1, { message: 'Quantidade deve ter no mínimo 1 caracteres' }),
});

const translateErrors: ErrorMessage = {
  "order already exists": "Pedido já existe"
}

export default function FormOrders({
  initialData
}: { initialData?: { clientId: {name: string, code: string}, productId: {name: string, code: string}, quantity: string } }) {
  const router = useRouter()
  const { orderId } = useParams();
  const [clients, setClients] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const toast = useRef<Toast>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      clientId: {name: '', code: ''},
      productId: {name: '', code: ''},
      quantity: ''
    }
  })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await axios.get('/api/clients', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const clients = data.clients.map((client: { id: string, name: string }) => {
          return {
            name: client.name,
            code: client.id
          }
        });
        
        setClients(clients);
      } catch (error: any) {
        if (toast.current) {
          toast.current.show({ severity: 'error', summary: 'Info', detail: `${translateErrors[error.response.data]}` });
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const products = data.products.map((product: { id: string, name: string }) => {
          return {
            name: product.name,
            code: product.id
          }
        });
        
        setProducts(products);
      } catch (error: any) {
        if (toast.current) {
          toast.current.show({ severity: 'error', summary: 'Info', detail: `${translateErrors[error.response.data]}` });
        }
      }
    }

    fetchProducts();
    fetchClients();
  }, [])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: { clientId: {name: string, code: string}, productId: {name: string, code: string}, quantity: string }) => {
    try {
      if (initialData) {
        await axios.put(`/api/orders/${orderId}`, {
          clientId: data.clientId.code,
          productId: data.productId.code,
          quantity: data.quantity
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Pedido atualizado com sucesso!' });
        }
      } else {        
        await axios.post('/api/orders', {
          clientId: data.clientId.code,
          productId: data.productId.code,
          quantity: data.quantity,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Pedido criado com sucesso!' });
        }
      }
      router.refresh();
      router.push('/orders');
    } catch (error: any) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Info', detail: `${translateErrors[error.response.data]}` });
      }
    }
  };

  const getFormErrorMessage = (name: 'clientId' | 'productId' | 'quantity') => {
    return form.formState.errors[name] ? <small className="text-red-400 w-full flex justify-end mt-1">{form.formState.errors[name]?.message}</small> : <small className="p-error">&nbsp;</small>;
  };

  return (
    <div className='h-full'>
      <h1 className="font-semibold text-[24px] text-black font-nunito leading-[32px]">
        {
          initialData ? 'Atualizar Pedido' : 'Cadastrar Pedido'
        }
      </h1>
      <p className="text-[16px] font-normal leading-6 text-[#6B7280]">Por favor, preencha todos os campos</p>
      <div className='w-full flex justify-center'>
        <form {...form} onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-1 mt-10 w-1/2 max-sm:w-full'>
          <Toast ref={toast} />
          <Controller
            name='clientId'
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="clientId" className="text-[#6B7280] text-[14px] font-normal leading-6">Cliente</label>
                <Dropdown {...field} options={clients} optionLabel="name" placeholder="Selecione um cliente"
                  filter className="w-full md:w-14rem" />
                {getFormErrorMessage('clientId')}
              </div>
            )}
          />
          <Controller
            name='productId'
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <label htmlFor="productId" className="text-[#6B7280] text-[14px] font-normal leading-6">Produto</label>
                <Dropdown {...field} options={products} optionLabel="name" placeholder="Selecione um produto"
                  filter className="w-full md:w-14rem" />
                {getFormErrorMessage('productId')}
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