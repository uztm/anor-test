import { Product, productApi } from 'entities/product'
import { render } from 'shared/lib'

import { ProductForm } from './product-form'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vitest } from 'vitest'

describe('Product form modal', async () => {
  it('should check product form with product prop', async () => {
    render(
      <ProductForm
        product={new Product({ id: 10, title: 'name', description: 'desc' })}
      />,
    )

    expect(await screen.findByDisplayValue('desc')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('name')).toBeInTheDocument()
  })

  it('should check form', async () => {
    const onSubmitSuccess = vitest.fn()
    const spy = vitest
      .spyOn(productApi, 'create')
      .mockImplementation(vitest.fn().mockResolvedValue('success'))

    render(<ProductForm onSubmitSuccess={onSubmitSuccess} />)

    const nameInput = screen.getByLabelText(/name/i)
    await userEvent.type(nameInput, 'test name')

    const descriptionInput = screen.getByLabelText(/description/i)
    await userEvent.type(descriptionInput, 'test description')

    expect(screen.getByDisplayValue(/test name/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue(/test description/i)).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', { name: /Отправить/i })

    await userEvent.click(submitBtn)

    expect(spy).toHaveBeenCalledOnce()
    expect(onSubmitSuccess).toHaveBeenCalledOnce()
  })
})
