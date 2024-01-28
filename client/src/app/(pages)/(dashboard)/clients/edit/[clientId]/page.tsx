'use client';
import React, { useEffect, useState } from 'react'
import FormClient from '../../components/FormClient'
import { useParams } from 'next/navigation'
import axios from 'axios'

type Client = {
  name: string,
  email: string,
  cpf: string
}

export default function EditClient() {
  const {clientId} = useParams();
  const [client, setClient] = useState<Client>();

  useEffect(() => {
    const getClient = async () => {
      try {
        const { data } = await axios.get(`/api/clients/${clientId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        setClient({
          name: data.client.name,
          email: data.client.email,
          cpf: data.client.cpf
        });
      } catch(error) {
        console.log(error);
      }
    };
    getClient();
  }, [clientId])

  if (!client) {
    return null;
  }
  return (
    <FormClient initialData={client} />
  )
}
