import { Product } from 'entities/product'
import { render } from 'shared/lib'

import { ProductsTable } from './products-table'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'

describe('Products Table', () => {
  it('should check if data renders', () => {
    render(<ProductsTable data={[new Product({ title: 'some', id: 1 })]} />)

    expect(screen.getByText(/some/i)).toBeInTheDocument()
  })
})
