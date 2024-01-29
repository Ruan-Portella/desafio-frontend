import { Box, VStack, Divider, ScrollView, useToast, Heading, HStack, Button } from 'native-base'
import React, { useEffect } from 'react'
import axios from 'axios'
import OperationCard from '../../components/OperationCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';

export default function Clients({ navigation }) {
  const [clients, setClients] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToast();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const deleteClient = async (id: string) => {
      try {
        const token = await AsyncStorage.getItem('token');
        await axios.delete(`http://10.0.2.2:3000/api/clients/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.show({
          title: "Cliente deletado com sucesso",
          description: "Cliente deletado com sucesso",
          duration: 2000
        });

        const newClients = clients.filter((client: any) => client.id !== id);
        setClients(newClients);
      } catch (error) {
        toast.show({
          title: "Erro ao deletar cliente",
          description: "Erro ao deletar cliente",
          duration: 2000
        })
      }
    };

    const fetchClients = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get('http://10.0.2.2:3000/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const clients = response.data.clients.map((client) => {
          return {
            ...client,
            createdAt: new Date(client.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            Operation: <OperationCard id={client.id} href='Editar Clientes' deleteFunction={deleteClient} />
          }
        });

        setClients(clients);
      } catch (error) {
        toast.show({
          title: "Erro ao buscar clientes",
          description: "Erro ao buscar clientes",
          duration: 2000
        })
        navigation.navigate('Login');
      }
    };
    fetchClients()
  }, [refreshing])

  return (
    <ScrollView px={10} pt={10} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <HStack justifyContent='space-between' mb={5}>
        <Heading>Clientes</Heading>
        <Button variant={'outline'} width={12} h={12} onPress={() => navigation.navigate('Criar Clientes')} leftIcon={<MaterialCommunityIcons name='plus' size={20} color='black' />} />
      </HStack>
      {
        clients.map((client: any) => (
          <Box borderWidth="1" mt={5} borderRadius="md" key={client.id}>
            <VStack space="1" divider={<Divider />} alignItems={'center'}>
              <Box pt="2">
                {`Nome: ${client.name}`}
              </Box>
              <Box>
                {`Cpf: ${client.cpf}`}
              </Box>
              <Box>
                {`Email: ${client.email}`}
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
