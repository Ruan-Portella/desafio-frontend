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

const FormProductSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  quantity: z.string().min(1, { message: 'Quantidade inválida' }),
  price: z.string().min(1, { message: 'Preço inválido' }),
});

type FormProductInfo = z.infer<typeof FormProductSchema>

type FormState = {
  name: string;
  quantity: string;
  price: string;
}

type FormProductProps = {
  initialData?: FormState,
  productId?: string
  navigation: any
}

const translateErrors: ErrorMessage = {
  "product already exists": "Produto já existe"
}

export default function FormProduct({
  initialData,
  productId,
  navigation,
}: FormProductProps) {
  const toast = useToast();

  const form = useForm<FormProductInfo>({
    resolver: zodResolver(FormProductSchema),
    defaultValues: initialData || {
      name: '',
      quantity: '',
      price: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormState) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (initialData) {
        await axios.put(`http://10.0.2.2:3000/api/products/${productId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post('http://10.0.2.2:3000/api/products', data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      toast.show({
        title: 'Sucesso!',
        description: `Produto ${initialData ? 'atualizado' : 'criado'} com sucesso!`,
        duration: 3000,
      })
      navigation.navigate('Products');
    } catch (error) {
      toast.show({
        title: 'Erro ao criar produto',
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
          <Controller
            control={form.control}
            name='price'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='Preço'
                onChangeText={onChange}
                defaultValue={initialData ? initialData.price : ''}
                errorMessage={getFormError('price')}
              />
            )}
          />
          <Button title={initialData ? 'Atualizar' : 'Cadastrar'} isLoading={isLoading} onPress={form.handleSubmit(onSubmit)} />
        </Center>
      </ScrollView>
    </VStack>
  )
}

