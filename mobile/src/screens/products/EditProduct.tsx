import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormProduct from './components/FormProduct'

type Product = {
  name: string;
  quantity: string;
  price: string;
}

export default function EditProduct({route, navigation}) {
  const {Id} = route.params;
  
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        const { data } = await axios.get(`http://10.0.2.2:3000/api/products/${Id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        
        setProduct({
          name: data.product.name,
          quantity: data.product.quantity,
          price: data.product.price
        });
      } catch (error) {
        console.log(error);
      }
    }
    getProduct();
  }, [Id])

  if (!product) {
    return null  
  }
  
  return <FormProduct initialData={product} productId={Id} navigation={navigation} />
}
