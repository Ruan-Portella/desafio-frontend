import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Box, Button, HStack, Text } from 'native-base';

interface OperationCardProps {
  id: string,
  href: 'Editar Clientes' | 'Editar Produtos' | 'Editar Pedidos',
  deleteFunction: (id: string) => void
}

export default function OperationCard({ id, href, deleteFunction }: OperationCardProps) {
  const router = useNavigation();

  return (
    <HStack>
      <Button
        width={12}
        mr={3}
        variant={'outline'}
        leftIcon={<MaterialCommunityIcons name='pencil' size={20} color='black' />}
        onPress={(e) => { e.stopPropagation(); router.navigate(`${href}`, {
          Id:id
        }) }}>
      </Button>
      <Button
        ml={3}
        variant={'outline'}
        width={12}
        startIcon={<MaterialCommunityIcons name='delete' size={20} color='black' />}
        onPress={(e) => { e.stopPropagation(); deleteFunction(id) }}>
      </Button>
    </HStack>
  )
}
