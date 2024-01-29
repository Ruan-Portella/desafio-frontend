import { Box, VStack, Divider, ScrollView, useToast, Heading, HStack, Button } from 'native-base'
import React, { useEffect } from 'react'
import axios from 'axios'
import OperationCard from '../../components/OperationCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

export default function Orders({ navigation }) {
  const [orders, setOrders] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToast();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const deleteOrder = async (id: string) => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.delete(`http://10.0.2.2:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.show({
          title: "Pedido deletado com sucesso",
          description: "Pedido deletado com sucesso",
          duration: 2000
        });

        const newOrder = orders.filter((order: any) => order.id !== id);
        setOrders(newOrder);
      } catch (error) {
        toast.show({
          title: "Erro ao deletar pedido",
          description: "Erro ao deletar pedido",
          duration: 2000
        })
      }
    };

    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get('http://10.0.2.2:3000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const orders = response.data.orders.map((order) => {
          return {
            ...order,
            clientId: order.client.name,
            productId: order.product.name,
            createdAt: new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            Operation: <OperationCard id={order.id} href='Editar Pedidos' deleteFunction={deleteOrder} />
          }
        });

        setOrders(orders);
      } catch (error) {
        toast.show({
          title: "Erro ao buscar pedidos",
          description: "Erro ao buscar pedidos",
          duration: 2000
        })
        navigation.navigate('Login');
      }
    };
    fetchOrders()
  }, [refreshing])

  return (
    <ScrollView px={10} pt={10} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <HStack justifyContent='space-between' mb={5}>
        <Heading>Pedidos</Heading>
        <Button variant={'outline'} width={12} h={12} onPress={() => navigation.navigate('Criar Pedidos')} leftIcon={<MaterialCommunityIcons name='plus' size={20} color='black' />} />
      </HStack>
      {
        orders.map((order: any) => (
          <Box borderWidth="1" mt={5} borderRadius="md" key={order.id}>
            <VStack space="1" divider={<Divider />} alignItems={'center'}>
              <Box pt="2">
                {`Cliente: ${order.clientId}`}
              </Box>
              <Box>
                {`Produto: ${order.productId}`}
              </Box>
              <Box>
                {`Quantidade: ${order.quantity}`}
              </Box>
              <Box>
                {`Data de cadastro: ${order.createdAt}`}
              </Box>
              <Box pb="2">
                {order.Operation}
              </Box>
            </VStack>
          </Box>
        ))
      }
    </ScrollView>
  )
}
