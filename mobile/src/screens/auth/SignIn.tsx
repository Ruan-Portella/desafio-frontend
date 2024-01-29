import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { VStack, Heading, Center, useToast, Image, Text, ScrollView } from 'native-base';
import { Input } from '../../components/Input';
import Button from '../../components/Button';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import logo from '../../images/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUpSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

type SignUpInfo = z.infer<typeof SignUpSchema>;

type ErrorMessage = {
  [key: string]: string
}

const translateErrors: ErrorMessage = {
  "Invalid password": "Senha inválida",
  "User already exists": "Usuário já existe"
}

export default function SignIn({ navigation }) {
  const { control, handleSubmit, ...form } = useForm<SignUpInfo>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(SignUpSchema)
  });
  const toast = useToast();

  const isLoading = form.formState.isSubmitting;

  async function handleSignUp(data: any) {
    try {
      const response = await axios.post('http://10.0.2.2:3000/api/auth/user/sign-in', data);
      toast.show({
        title: 'Login realizado com sucesso!',
        variant: 'top-accent',
        duration: 2000
      })
      AsyncStorage.setItem('token', response.data.token);
      toast.closeAll()
      navigation.navigate('Clientes')
    } catch (error: any) {
      toast.show({
        title: 'Alguma coisa deu errado!',
        variant: 'top-accent',
        description: `${translateErrors[error.response.data]}`,
        duration: 2000
      })

      toast.closeAll();
    }
  }

  const getFormErrorMessage = (name: 'email' | 'password') => {
    return form.formState.errors[name] ? form.formState.errors[name]?.message : '';
  };

  return (
    <VStack bgColor='gray.300' flex={1} px={10}>
      <ScrollView>
        <Center>
          <Image source={logo} alt='Logo' size={250} />
          <Controller
            control={control}
            name='email'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='E-mail'
                onChangeText={onChange}
                errorMessage={getFormErrorMessage('email')}
              />
            )}
          />
          <Controller
            control={control}
            name='password'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='Senha'
                secureTextEntry
                onChangeText={onChange}
                errorMessage={getFormErrorMessage('password')}
              />
            )}
          />

          <Button title='Entrar' isLoadingForm={isLoading} onPress={handleSubmit(handleSignUp)} />
          <Text onPress={() => navigation.navigate('Cadastro')} fontSize='md' mt={5}>Não tem conta? Se inscreva-se</Text>
        </Center>
      </ScrollView>
    </VStack>
  );
}
