import type { Product } from 'entities/product'
import { Table } from 'shared/ui'

import { useProductsTableColumns } from '../model/use-products-table-columns'

interface ProductsTableProps {
  data: Product[] | undefined
  loading?: boolean
}

export const ProductsTable = ({
  data,
  loading,
}: Readonly<ProductsTableProps>) => {
  const columns = useProductsTableColumns()

  return (
    <Table loading={loading} columns={columns} data={data} idAccessor={'id'} />
  )
}
