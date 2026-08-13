import type { UseFormReturnType } from '@mantine/form'
import type React from 'react'

export type PageFilterType =
  | 'select'
  | 'input'
  | 'datepicker'
  | 'rangepicker'
  | 'multiselect'
  | 'custom'

export interface FilterFieldSelectOption {
  value: string
  label: string
}

export interface PageFiltersField<T> {
  field: Extract<keyof T, string>
  type: PageFilterType
  label?: string
  options?: FilterFieldSelectOption[]
  placeholder?: string | null
  defaultValue?: string
  renderCustomComponent?: (
    form: UseFormReturnType<T>,
    field: Extract<keyof T, string>,
  ) => React.ReactNode
}
