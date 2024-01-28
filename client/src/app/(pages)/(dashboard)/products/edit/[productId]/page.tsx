'use client';
import React, { useEffect, useState } from 'react'
import FormClient from '../../components/FormProducts'
import { useParams } from 'next/navigation'
import axios from 'axios'

type Product = {
  name: string,
  quantity: string,
  price: string
}

export default function EditProduct() {
  const {productId} = useParams();
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        setProduct({
          name: data.product.name,
          quantity: data.product.quantity,
          price: data.product.price
        });
      } catch(error) {
        console.log(error);
      }
    };
    getProduct();
  }, [productId])

  if (!product) {
    return null;
  }
  return (
    <FormClient initialData={product} />
  )
}
