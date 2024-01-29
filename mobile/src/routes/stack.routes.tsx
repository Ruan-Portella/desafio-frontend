import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../screens/auth/SignUp';
import SignIn from '../screens/auth/SignIn';
import EditClients from '../screens/clients/EditClient';
import RouterTabs from './tab.routes';
import CreateClient from '../screens/clients/CreateClient';
import EditProduct from '../screens/products/EditProduct';
import CreateProduct from '../screens/products/CreateProduct';
import EditOrder from '../screens/orders/EditOrder';
import CreateOrder from '../screens/orders/CreateOrder';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator initialRouteName='Login'>
    <Stack.Screen name="Login" component={SignIn} />
    <Stack.Screen name="Cadastro" component={SignUp} />
    <Stack.Screen name="Clientes" component={RouterTabs} options={{headerShown: false}}/>
    <Stack.Screen name="Editar Clientes" component={EditClients}/>
    <Stack.Screen name="Criar Clientes" component={CreateClient}/>
    <Stack.Screen name="Editar Produtos" component={EditProduct}/>
    <Stack.Screen name="Criar Produtos" component={CreateProduct}/>
    <Stack.Screen name="Editar Pedidos" component={EditOrder}/>
    <Stack.Screen name="Criar Pedidos" component={CreateOrder}/>
  </Stack.Navigator>
  )
}
