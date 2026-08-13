import { useSearchRequestParams } from 'shared/lib'
import type { PageableRequestParams } from 'shared/types'

import type { DataTableColumn, DataTableSortStatus } from 'mantine-datatable'
import { DataTable } from 'mantine-datatable'
import { useTranslation } from 'react-i18next'

interface TableProps<T> {
  data: T[] | undefined
  loading?: boolean
  columns: DataTableColumn<T>[]
  idAccessor: keyof T
}

export const Table = <T,>({
  data,
  loading,
  columns,
  idAccessor,
}: Readonly<TableProps<T>>) => {
  const { t } = useTranslation()
  const { setSearchParams, searchParams } =
    useSearchRequestParams<PageableRequestParams>()

  const handleSort = (status: DataTableSortStatus<T>) => {
    const { sortKey, columnAccessor, direction } = status

    setSearchParams([
      {
        key: 'sortBy',
        value: sortKey ?? String(columnAccessor),
      },
      {
        key: 'order',
        value: direction,
      },
    ])
  }

  return (
    <DataTable
      idAccessor={String(idAccessor)}
      records={data}
      fetching={loading}
      minHeight={data?.length ? undefined : '350px'}
      withTableBorder={false}
      noRecordsText={t('noRecords')}
      borderRadius={'md'}
      borderColor={{
        light: '#f7f7fa',
        dark: '#333',
      }}
      height={'auto'}
      columns={columns}
      loaderType={'bars'}
      loaderBackgroundBlur={1}
      sortStatus={{
        columnAccessor: searchParams.sortBy,
        direction: searchParams.order,
      }}
      onSortStatusChange={handleSort}
    />
  )
}
