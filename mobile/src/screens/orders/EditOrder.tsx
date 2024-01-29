import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormOrder from './components/FormOrder'
import { Text } from 'react-native'
import { View } from 'native-base'

type Order = {
  clientId: {label: string, value: string};
  productId: {label: string, value: string};
  quantity: string;
}

export default function EditOrder({route, navigation}) {
  const {Id} = route.params;
  
  const [order, setOrder] = useState<Order>();

  useEffect(() => {
    const getOrder = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        const { data } = await axios.get(`http://10.0.2.2:3000/api/orders/${Id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        setOrder({
          clientId: {label: data.order.client.name, value: data.order.client.id},
          productId: {label: data.order.product.name, value: data.order.product.id},
          quantity: data.order.quantity
        });
      } catch (error) {
        console.log(error);
      }
    }
    getOrder();
  }, [Id])

  if (!order) {
    return null  
  }
  return <FormOrder initialData={order} orderId={Id} navigation={navigation} />
}
