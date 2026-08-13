import { render } from 'shared/lib'

import { PagePagination } from './page-pagination'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'

describe('Page Pagination component', () => {
  it('should check if total pages renders correctly', () => {
    render(<PagePagination total={3} />)

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '4' })).not.toBeInTheDocument()
  })
})
