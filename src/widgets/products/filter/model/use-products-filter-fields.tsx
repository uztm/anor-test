import { generateFilterFields } from 'shared/ui'

import type { ProductsFilters } from './types'

export function useProductsFilterFields() {
  return generateFilterFields<ProductsFilters>([
    {
      field: 'q',
      label: 'Search',
      type: 'multiselect',
      options: [{ label: 'some', value: 'some' }],
    },
    {
      field: 'createdAt',
      label: 'Created at',
      type: 'datepicker',
    },
  ])
}
