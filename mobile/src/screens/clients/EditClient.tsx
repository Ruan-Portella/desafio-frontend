import React, { useEffect, useState } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FormClient from './components/FormClient'

type Client = {
  name: string;
  email: string;
  cpf: string;
}

export default function EditClient({route, navigation}) {
  const {Id} = route.params;
  
  const [client, setClient] = useState<Client>();

  useEffect(() => {
    const getClient = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        const { data } = await axios.get(`http://10.0.2.2:3000/api/clients/${Id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        
        setClient({
          name: data.client.name,
          email: data.client.email,
          cpf: data.client.cpf
        });
      } catch (error) {
        console.log(error);
      }
    }
    getClient();
  }, [Id])

  if (!client) {
    return null  
  }
  
  return <FormClient initialData={client} clientId={Id} navigation={navigation} />
}
