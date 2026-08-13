import type { Product } from 'entities/product'
import { generateTableColumns, TableActions } from 'shared/ui'

import { RiTerminalLine } from '@remixicon/react'
import type { DataTableColumn } from 'mantine-datatable'
import { Link } from 'react-router-dom'

export function useProductsTableColumns(): DataTableColumn<Product>[] {
  return generateTableColumns<Product>([
    {
      accessor: 'id',
      sortable: true,
      title: 'ID',
    },
    {
      accessor: 'title',
      title: 'Наименование',
      render: (rec) => <Link to={rec.id.toString()}>{rec.title}</Link>,
    },
    { accessor: 'price', sortable: true },
    { accessor: 'rating' },
    { accessor: 'stock' },
    {
      accessor: 'actions',
      title: 'Actions',
      textAlign: 'right',
      render: (record) => (
        <TableActions
          items={[
            {
              icon: <RiTerminalLine />,
              label: 'Alert record ID',
              onClick: () => alert(record.id),
            },
          ]}
        />
      ),
    },
  ])
}
