import { Input as InputBase, IInputProps, FormControl } from 'native-base';

type InputProps = IInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage = null, ...rest }: InputProps) {
  const invalid = !!errorMessage || rest.isInvalid;

  return (
    <FormControl mb={4} isInvalid={invalid}>
      <InputBase
        bg="gray.700"
        fontSize="md"
        h={16}
        isInvalid={invalid}
        _focus={{
          bg: 'gray.200',
          borderWidth: 2,
          borderColor: 'gray.500'
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>
        {
          errorMessage ? errorMessage : '&nbsp'
        }
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
