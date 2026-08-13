import type { DataTableColumn } from 'mantine-datatable'

export function generateTableColumns<T>(
  columns: DataTableColumn<T>[],
): DataTableColumn<T>[] {
  return columns.map((column) => column)
}
