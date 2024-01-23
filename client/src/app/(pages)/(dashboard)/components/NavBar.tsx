'use client';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';
import { Menubar } from 'primereact/menubar';
import axios from 'axios';
import React, { useEffect } from 'react'

export default function NavBar() {
  const router = useRouter();

  const items = [
    {
      label: 'Clientes',
      icon: 'pi pi-users',
      items: [
        {
          'label': 'Listar',
          'icon': 'pi pi-fw pi-list',
          'url': '/clients'
        },
        {
          'label': 'Cadastrar',
          'icon': 'pi pi-fw pi-plus',
          'url': '/clients/create'
        },
      ],
    },
    {
      label: 'Pedidos',
      icon: 'pi pi-box',
      items: [
        {
          'label': 'Listar',
          'icon': 'pi pi-fw pi-list',
          'url': '/orders'
        },
        {
          'label': 'Cadastrar',
          'icon': 'pi pi-fw pi-plus',
          'url': '/orders/create'
        },
      ]
    },
    {
      label: 'Produtos',
      icon: 'pi pi-shopping-cart',
      items: [
        {
          'label': 'Listar',
          'icon': 'pi pi-fw pi-list',
          'url': '/products'
        },
        {
          'label': 'Cadastrar',
          'icon': 'pi pi-fw pi-plus',
          'url': '/products/create'
        },
      ]
    },
  ];

  const end = (
    <div className="flex align-items-center gap-2">
      <Avatar image='https://i.imgur.com/XNksnn9.png' size='large' shape="circle" onClick={() => router.push('/clients')} />
    </div>
  );

  useEffect(() => {
    const getUser = async () => {
      try {
        await axios.get('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch {
        router.push('/');
      }
    }
    getUser();
  }, [router])

  return (
      <Menubar model={items} end={end} />
  )
}
