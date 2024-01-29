import { Button as ButtonBase, IButtonProps, Text} from 'native-base'

type ButtonProps = IButtonProps & {
  title: string;
  isLoadingForm?: boolean;
};

export default function Button({title, isLoadingForm, ...rest}: ButtonProps) {
  return (
    <ButtonBase
      w='full'
      h={16}
      bg='gray.700'
      isLoading={isLoadingForm}
      _pressed={{bgColor: 'gray.500'}}
      {...rest}
    >
      <Text color='white' fontSize='md'>
        {title}
      </Text>
    </ButtonBase>
  )
}
