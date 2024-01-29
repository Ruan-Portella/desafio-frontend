import { Box, VStack, Divider, ScrollView, useToast, Heading, HStack, Button } from 'native-base'
import React, { useEffect } from 'react'
import axios from 'axios'
import OperationCard from '../../components/OperationCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

export default function Products({ navigation }) {
  const [products, setProducts] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToast();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const deleteProduct = async (id: string) => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.delete(`http://10.0.2.2:3000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.show({
          title: "Produto deletado com sucesso",
          description: "Produto deletado com sucesso",
          duration: 2000
        });

        const newProducts = products.filter((client: any) => client.id !== id);
        setProducts(newProducts);
      } catch (error) {
        toast.show({
          title: "Erro ao deletar cliente",
          description: "Erro ao deletar cliente",
          duration: 2000
        })
      }
    };

    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get('http://10.0.2.2:3000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const products = response.data.products.map((client) => {
          return {
            ...client,
            createdAt: new Date(client.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            Operation: <OperationCard id={client.id} href='Editar Produtos' deleteFunction={deleteProduct} />
          }
        });

        setProducts(products);
      } catch (error) {
        toast.show({
          title: "Erro ao buscar produtos",
          description: "Erro ao buscar produtos",
          duration: 2000
        })
        navigation.navigate('Login');
      }
    };
    fetchProducts()
  }, [refreshing])

  return (
    <ScrollView px={10} pt={10} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <HStack justifyContent='space-between' mb={5}>
        <Heading>Produtos</Heading>
        <Button variant={'outline'} width={12} h={12} onPress={() => navigation.navigate('Criar Produtos')} leftIcon={<MaterialCommunityIcons name='plus' size={20} color='black' />} />
      </HStack>
      {
        products.map((client: any) => (
          <Box borderWidth="1" mt={5} borderRadius="md" key={client.id}>
            <VStack space="1" divider={<Divider />} alignItems={'center'}>
              <Box pt="2">
                {`Nome: ${client.name}`}
              </Box>
              <Box>
                {`Quantidade: ${client.quantity}`}
              </Box>
              <Box>
                {`Preço: ${client.price}`}
              </Box>
              <Box>
                {`Data de cadastro: ${client.createdAt}`}
              </Box>
              <Box pb="2">
                {client.Operation}
              </Box>
            </VStack>
          </Box>
        ))
      }
    </ScrollView>
  )
}
