'use client';
import React, { useEffect, useRef, useState } from 'react'
import {useRouter} from 'next/navigation';
import axios from 'axios';
import OperationCard from '../components/OperationCard';
import Table from '../components/Table';
import { Toast } from 'primereact/toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const columns = [
    {field: 'clientId', header: 'Cliente'},
    {field: 'productId', header: 'Produto'},
    {field: 'quantity', header: 'Quantidade'},
    {field: 'createdAt', header: 'Data de Criação'},
    {field: 'Operations', header: 'Operações'}
];

  useEffect(() => {
    const deleteOrder = async (id: string) => {
      try {
        await axios.delete(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Pedido deleteado com sucesso!' });
        }
        router.refresh();
        const newClients = orders.filter((client: any) => client.id !== id);
        setOrders(newClients);
        router.push('/orders');
      } catch {
        router.push('/')
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const orders = response.data.orders.map((order: any) => {
          return {
            ...order,
            clientId: order.client.name,
            productId: order.product.name,
            createdAt: new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            }),
            Operations: <OperationCard id={order.id} href='orders' deleteFunction={deleteOrder} />
          }
        });

        setOrders(orders);
      } catch {
        router.push('/')
      }
    }
    fetchProducts();
  }, [router, orders]);

  return (
    <div>
      <Toast ref={toast} />
      <h1 className='font-semibold text-[24px] text-black font-nunito leading-[32px] mb-4'>Pedidos</h1>
      <Table columns={columns} data={orders} />
    </div>
  )
}
