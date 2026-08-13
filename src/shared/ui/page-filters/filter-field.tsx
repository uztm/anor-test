import type { PageFiltersField } from './model/types'
import { MultiSelect, Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import type { UseFormReturnType } from '@mantine/form'
import { RiCalendar2Line } from '@remixicon/react'
import React from 'react'

interface IFilterFieldProps<T> {
  field: PageFiltersField<T>
  form: UseFormReturnType<T>
}

export const FilterField = <T,>({
  field,
  form,
}: Readonly<IFilterFieldProps<T>>) => {
  const placeholder = field.placeholder || field.label
  switch (field.type) {
    case 'custom':
      return (
        <React.Fragment>
          {field.renderCustomComponent?.(form, field.field)}
        </React.Fragment>
      )
    case 'select': {
      return (
        <Select
          label={field.label}
          placeholder={placeholder}
          data={field.options ?? []}
          data-testid={'select-field'}
          {...form.getInputProps(field.field)}
        />
      )
    }
    case 'multiselect': {
      return (
        <MultiSelect
          label={field.label}
          placeholder={placeholder}
          data={field.options ?? []}
          data-testid={'multiselect-field'}
          {...form.getInputProps(field.field)}
        />
      )
    }
    case 'datepicker': {
      return (
        <DatePickerInput
          label={field.label}
          placeholder={placeholder}
          leftSection={<RiCalendar2Line />}
          data-testid={'datepicker-field'}
          {...form.getInputProps(field.field)}
        />
      )
    }
    case 'rangepicker': {
      return (
        <DatePickerInput
          type={'range'}
          label={field.label}
          placeholder={placeholder}
          leftSection={<RiCalendar2Line />}
          data-testid={'rangepicker-field'}
          {...form.getInputProps(field.field)}
        />
      )
    }
    case 'input':
    default: {
      return (
        <TextInput
          label={field.label}
          placeholder={placeholder}
          data-testid={'input-field'}
          {...form.getInputProps(field.field)}
        />
      )
    }
  }
}
