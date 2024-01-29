import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import { Center, ScrollView, VStack, useToast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import Button from '../../../components/Button';
import { useEffect, useState } from 'react';

type ErrorMessage = {
  [key: string]: string
};

const FormOrderSchema = z.object({
  clientId: z.object({ label: z.string(), value: z.string() }),
  productId: z.object({ label: z.string(), value: z.string() }),
  quantity: z.string().min(1, { message: 'Quantidade inválida' }),
});

type FormOrderInfo = z.infer<typeof FormOrderSchema>

type FormState = {
  clientId: { label: string, value: string };
  productId: { label: string, value: string };
  quantity: string;
}

type FormOrderProps = {
  initialData?: FormState,
  orderId?: string
  navigation: any
}

const translateErrors: ErrorMessage = {
  "order already exists": "Pedido já existe"
}

export default function FormOrder({
  initialData,
  orderId,
  navigation,
}: FormOrderProps) {
  const toast = useToast();
  const [clients, setClients] = useState();
  const [products, setProducts] = useState();

  const form = useForm<FormOrderInfo>({
    resolver: zodResolver(FormOrderSchema),
    defaultValues: initialData || {
      clientId: { label: '', value: '' },
      productId: { label: '', value: '' },
      quantity: ''
    }
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const { data } = await axios.get('http://10.0.2.2:3000/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const clients = data.clients.map((client: { id: string, name: string }) => {
          return { label: client.name, value: client.id }
        });

        setClients(clients);
      } catch (error) {
        toast.show({
          title: 'Erro ao carregar clientes',
          description: translateErrors[error.response.data],
          duration: 3000,
        })
      }
    }

    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const { data } = await axios.get('http://10.0.2.2:3000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const products = data.products.map((client: { id: string, name: string }) => {
          return { label: client.name, value: client.id }
        });

        setProducts(products);
      } catch (error) {
        toast.show({
          title: 'Erro ao carregar pedidos',
          description: translateErrors[error.response.data],
          duration: 3000,
        })
      }
    }

    fetchClients();
    fetchProducts();
  }, [])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data) => {
    console.log(data);


    try {
      const token = await AsyncStorage.getItem('token');
      if (initialData) {
        await axios.put(`http://10.0.2.2:3000/api/orders/${orderId}`, {
          clientId: data.clientId.value,
          productId: data.productId.value,
          quantity: data.quantity
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://10.0.2.2:3000/api/orders', {
          clientId: data.clientId.value,
          productId: data.productId.value,
          quantity: data.quantity
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      toast.show({
        title: 'Sucesso!',
        description: `Pedido ${initialData ? 'atualizado' : 'criado'} com sucesso!`,
        duration: 3000,
      })
      navigation.navigate('Orders');
    } catch (error) {
      toast.show({
        title: 'Erro ao criar pedido',
        description: translateErrors[error.response.data],
        duration: 3000,
      })
    }
  }

  const getFormError = (field: keyof FormState) => {
    return form.formState.errors[field]?.message;
  };

  return (
    <VStack flex={1} h='full' bgColor='gray.300' px={10}>
      <ScrollView>
        <Center mt={24}>
          <Controller
            control={form.control}
            name='clientId'
            render={({ field: { onChange } }) => (
              <Select data={clients} defaultValue={initialData ? initialData.clientId.value : ''} onValueChange={(item) => {
                const itemObj = clients.find((client) => client.value === item);
                onChange(itemObj);
            }} placeholder="Escolha um cliente" />
            )}
          />
          <Controller
            control={form.control}
            name='productId'
            render={({ field: { onChange } }) => (
              <Select data={products} defaultValue={initialData ? initialData.productId.value : ''} onValueChange={(item) => {
                  const itemObj = products.find((product) => product.value === item);
                  onChange(itemObj);
              }} placeholder="Escolha um produto" />
            )}
          />
          <Controller
            control={form.control}
            name='quantity'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='Quantidade'
                onChangeText={onChange}
                defaultValue={initialData ? initialData.quantity : ''}
                errorMessage={getFormError('quantity')}
              />
            )}
          />
          <Button title={initialData ? 'Atualizar' : 'Cadastrar'} isLoading={isLoading} onPress={form.handleSubmit(onSubmit)} />
        </Center>
      </ScrollView>
    </VStack>
  )
}

