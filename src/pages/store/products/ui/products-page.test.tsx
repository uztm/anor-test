import { Product, productStore } from 'entities/product'
import { render } from 'shared/lib'

import { ProductsPage } from './products-page'
import { screen } from '@testing-library/dom'
import { describe, expect, it, vitest } from 'vitest'

describe('Products Page', () => {
  it('should show error if request was rejected', async () => {
    vitest.spyOn(productStore, 'useProducts').mockImplementation(
      vitest.fn().mockReturnValue({
        data: null,
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: {
          message: 'Error message',
        },
      }),
    )
    render(<ProductsPage />)

    expect(await screen.findByText(/Error message/i)).toBeInTheDocument()
    screen.debug()
  })

  it('should show data if request was resolved', async () => {
    vitest.spyOn(productStore, 'useProducts').mockImplementation(
      vitest.fn().mockReturnValue({
        data: {
          products: [
            new Product({
              id: 10,
              title: 'Тестовый продукт',
            }),
          ],
          total: 1,
        },
        isLoading: false,
        isSuccess: true,
        isError: false,
      }),
    )

    render(<ProductsPage />)

    const data = await screen.findByTestId('products-data')
    expect(data).toBeInTheDocument()
  })
})
