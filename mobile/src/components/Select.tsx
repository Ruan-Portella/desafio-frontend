import { Select as SelectBase, ISelectProps, FormControl } from 'native-base';

type SelectProps = ISelectProps & {
  errorMessage?: string | null;
  data: { label: string, value: string }[]
};

export function Select({ data, errorMessage = null, ...rest }: SelectProps) {
  const invalid = !!errorMessage;
  
  return (
    <FormControl mb={4} isInvalid={invalid} isReadOnly>
      <SelectBase
        bg="gray.700"
        fontSize="md"
        h={16}
        {...rest}
      >
      {
        data && data.map((item, index) => (
          <SelectBase.Item
            key={index}
            label={item.label}
            value={item.value}
          />
        ))
      }
      </SelectBase>
      <FormControl.ErrorMessage>
        {
          errorMessage ? errorMessage : '&nbsp'
        }
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
