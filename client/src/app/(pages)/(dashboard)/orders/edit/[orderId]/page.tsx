'use client';
import React, { useEffect, useState } from 'react'
import FormOrder from '../../components/FormOrders'
import { useParams } from 'next/navigation'
import axios from 'axios'

type Order = {
  clientId: {name: string, code: string},
  productId: {name: string, code: string},
  quantity: string
}

export default function EditOrder() {
  const {orderId} = useParams();
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        
        setOrder({
          clientId: {code: data.order.client.id, name: data.order.client.name},
          productId: {code: data.order.product.id, name: data.order.product.name},
          quantity: data.order.quantity,
        });
      } catch(error) {
        console.log(error);
      }
    };
    getProduct();
  }, [orderId])

  if (!order) {
    return null;
  }
  return (
    <FormOrder initialData={order} />
  )
}
