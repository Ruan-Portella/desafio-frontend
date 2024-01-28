'use client';
import React, { useEffect, useRef, useState } from 'react'
import {useRouter} from 'next/navigation';
import axios from 'axios';
import OperationCard from '../components/OperationCard';
import Table from '../components/Table';
import { Toast } from 'primereact/toast';

export default function Products() {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const columns = [
    {field: 'name', header: 'Nome'},
    {field: 'quantity', header: 'Quantidade'},
    {field: 'price', header: 'Preço'},
    {field: 'createdAt', header: 'Data de Criação'},
    {field: 'Operations', header: 'Operações'}
];

  useEffect(() => {
    const deleteProduct = async (id: string) => {
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (toast.current) {
          toast.current.show({ severity: 'success', summary: 'Info', detail: 'Cliente deleteado com sucesso!' });
        }
        router.refresh();
        const newClients = products.filter((client: any) => client.id !== id);
        setProducts(newClients);
        router.push('/products');
      } catch {
        router.push('/')
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const products = response.data.products.map((product: any) => {
          return {
            ...product,
            createdAt: new Date(product.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            }),
            Operations: <OperationCard id={product.id} href='products' deleteFunction={deleteProduct} />
          }
        });
        setProducts(products);
      } catch {
        router.push('/')
      }
    }
    fetchProducts();
  }, [router, products]);

  return (
    <div>
      <Toast ref={toast} />
      <h1 className='font-semibold text-[24px] text-black font-nunito leading-[32px] mb-4'>Produtos</h1>
      <Table columns={columns} data={products} />
    </div>
  )
}
