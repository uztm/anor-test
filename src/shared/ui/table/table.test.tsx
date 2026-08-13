import { render } from 'shared/lib'

import { Table } from './table'
import { screen } from '@testing-library/dom'
import type { DataTableColumn } from 'mantine-datatable'
import { describe, expect, it } from 'vitest'

interface MockData {
  name: string
}

const data: MockData[] = [{ name: 'data name' }]
const mockColumns: DataTableColumn<MockData>[] = [
  {
    accessor: 'Test title from column',
    render: (record: MockData) => record.name,
  },
]

describe('Table component', () => {
  it('should render data', () => {
    render(<Table columns={mockColumns} data={data} idAccessor={'name'} />)

    expect(screen.getByText(/Test title from column/)).toBeInTheDocument()
    expect(screen.getByText(/data name/)).toBeInTheDocument()
  })
})
