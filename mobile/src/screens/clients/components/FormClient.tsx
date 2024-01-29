import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import axios from 'axios'
import { Center, ScrollView, VStack, useToast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../../components/Input';
import Button from '../../../components/Button';

type ErrorMessage = {
  [key: string]: string
};

const FormClientSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpf: z.string().min(11, { message: 'Cpf inválido' }),
});

type FormClientInfo = z.infer<typeof FormClientSchema>

type FormState = {
  name: string;
  email: string;
  cpf: string;
}

type FormClientProps = {
  initialData?: FormState,
  clientId?: string
  navigation: any
}

const translateErrors: ErrorMessage = {
  "Client already exists": "Cliente já existe"
}

export default function FormClient({
  initialData,
  clientId,
  navigation,
}: FormClientProps) {
  const toast = useToast();

  const form = useForm<FormClientInfo>({
    resolver: zodResolver(FormClientSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      cpf: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormState) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (initialData) {
        await axios.put(`http://10.0.2.2:3000/api/clients/${clientId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://10.0.2.2:3000/api/clients', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      toast.show({
        title: 'Sucesso!',
        description: `Cliente ${initialData ? 'atualizado' : 'criado'} com sucesso!`,
        duration: 3000,
      })
      navigation.navigate('Clients');
    } catch (error) {
      toast.show({
        title: 'Erro ao criar cliente',
        description: translateErrors[error.response.data],
        duration: 3000,
      })
    }
  }

  const getFormError = (field: keyof FormState) => {
    return form.formState.errors[field]?.message;
  };

  return (
    <VStack flex={1}  h='full' bgColor='gray.300' px={10}>
      <ScrollView>
        <Center mt={24}>
          <Controller
            control={form.control}
            name='name'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='Nome'
                onChangeText={onChange}
                defaultValue={initialData ? initialData.name : ''}
                errorMessage={getFormError('name')}
              />
            )}
          />
          <Controller
            control={form.control}
            name='email'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='E-mail'
                onChangeText={onChange}
                defaultValue={initialData ? initialData.email : ''}
                errorMessage={getFormError('email')}
              />
            )}
          />
          <Controller
            control={form.control}
            name='cpf'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='CPF'
                onChangeText={onChange}
                defaultValue={initialData ? initialData.cpf : ''}
                errorMessage={getFormError('cpf')}
              />
            )}
          />
          <Button title={initialData ? 'Atualizar' : 'Cadastrar'} isLoading={isLoading} onPress={form.handleSubmit(onSubmit)} />
        </Center>
      </ScrollView>
    </VStack>
  )
}

