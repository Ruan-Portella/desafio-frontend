import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { VStack, Heading, Center, useToast, Image, Text, ScrollView } from 'native-base';
import { Input } from '../../components/Input';
import Button from '../../components/Button';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import logo from '../../images/logo.png';

const SignUpSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
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

export default function SignUp({ navigation }) {
  const { control, handleSubmit, ...form } = useForm<SignUpInfo>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    resolver: zodResolver(SignUpSchema)
  });
  const toast = useToast();

  const isLoading = form.formState.isSubmitting;

  async function handleSignUp(data: any) {
    try {
      await axios.post('http://10.0.2.2:3000/api/auth/user/sign-up', data);
      toast.show({
        title: 'Conta criada com sucesso!',
        variant: 'top-accent',
        duration: 2000
      })
      navigation.navigate('Login')
    } catch (error: any) {

      toast.show({
        title: 'Alguma coisa deu errado!',
        variant: 'top-accent',
        description: `${translateErrors[error.response.data]}`,
        duration: 2000
      })
    }
  }

  const getFormErrorMessage = (name: 'email' | 'password' | 'name') => {
    return form.formState.errors[name] ? form.formState.errors[name]?.message : '';
  };

  return (
    <VStack bgColor='gray.300' flex={1} px={10}>
      <ScrollView>
        <Center>
          <Image source={logo} alt='Logo' size={250} mb={5} />
          <Controller
            control={control}
            name='name'
            render={({ field: { onChange } }) => (
              <Input
                placeholder='Nome'
                onChangeText={onChange}
                errorMessage={getFormErrorMessage('name')}
              />
            )}
          />
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
          <Button title='Cadastrar' isLoadingForm={isLoading} onPress={handleSubmit(handleSignUp)} />
          <Text onPress={() => navigation.navigate('Login')} fontSize='md' mt={5}>Já tem conta? Iniciar sessão</Text>
        </Center>
      </ScrollView>
    </VStack>
  );
}
