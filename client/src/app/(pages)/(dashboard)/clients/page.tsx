'use client';
import React, { useEffect, useRef, useState } from 'react'
import {useRouter} from 'next/navigation';
import axios from 'axios';
import OperationCard from '../components/OperationCard';
import Table from '../components/Table';
import { Toast } from 'primereact/toast';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const columns = [
    {field: 'name', header: 'Nome'},
    {field: 'cpf', header: 'CPF'},
    {field: 'email', header: 'Email'},
    {field: 'createdAt', header: 'Data de Criação'},
    {field: 'Operations', header: 'Operações'}
];

  useEffect(() => {
    const deleteClient = async (id: string) => {
      try {
        await axios.delete(`http://localhost:3000/api/clients/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Cliente deleteado com sucesso!' });
        }
        router.refresh();
        const newClients = clients.filter((client: any) => client.id !== id);
        setClients(newClients);
        router.push('/clients');
      } catch {
        router.push('/')
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/clients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const clients = response.data.clients.map((client: any) => {
          return {
            ...client,
            createdAt: new Date(client.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            }),
            Operations: <OperationCard id={client.id} href='clients' deleteFunction={deleteClient} />
          }
        });
        setClients(clients);
      } catch {
        router.push('/')
      }
    }
    fetchClients();
  }, [router, clients]);

  return (
    <div>
      <Toast ref={toast} />
      <h1 className='font-semibold text-[24px] text-black font-nunito leading-[32px] mb-4'>Clientes</h1>
      <Table columns={columns} data={clients} />
    </div>
  )
}
