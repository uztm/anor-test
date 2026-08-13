import type { PageFiltersField } from 'shared/ui'
import { PageFilters } from 'shared/ui'

import type { ProductsFilters } from '../model/types'
import { useProductsFilterFields } from '../model/use-products-filter-fields'
import dayjs from 'dayjs'

export const ProductsFilter = () => {
  const fields: PageFiltersField<ProductsFilters>[] = useProductsFilterFields()

  const onBeforeFilter = (data: ProductsFilters) => {
    data.createdAt = data.createdAt
      ? dayjs(data.createdAt).format('YYYY-MM-DD')
      : undefined
    return data
  }

  return (
    <PageFilters<ProductsFilters>
      onBeforeFilter={onBeforeFilter}
      fields={fields}
    />
  )
}
