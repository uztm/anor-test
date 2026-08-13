import type { PageFiltersField } from '../model/types'
import { TextInput } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'

interface MockDataType {
  input: string
  multiselect: string
  select: string
  datepicker: string
  datetimepicker: string
  rangepicker: string
  custom: string
}

export const mockInputField: PageFiltersField<MockDataType>[] = [
  {
    field: 'input',
    type: 'input',
    label: 'input',
  },
]

export const mockFields: PageFiltersField<MockDataType>[] = [
  {
    field: 'input',
    label: 'Input label',
    type: 'input',
  },
  {
    field: 'select',
    type: 'select',
    options: [{ value: '', label: '' }],
  },
  {
    field: 'multiselect',
    type: 'multiselect',
    options: [{ label: 'some', value: 'some' }],
  },
  {
    field: 'datepicker',
    type: 'datepicker',
  },
  {
    field: 'rangepicker',
    type: 'rangepicker',
  },
  {
    field: 'custom',
    type: 'custom',
    renderCustomComponent: (
      form: UseFormReturnType<MockDataType>,
      field: keyof MockDataType,
    ) => (
      <TextInput {...form.getInputProps(field)} data-testid={'custom-field'} />
    ),
  },
]
