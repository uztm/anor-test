import { render } from 'shared/lib'

import { mockFields, mockInputField } from './_mocks/mock-fields'
import { PageFilters } from './page-filters'
import { screen, waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vitest } from 'vitest'

describe('Page Filters component', () => {
  it('should render reset button', () => {
    render(<PageFilters fields={[]} />)
    expect(screen.getByText(/очистить/i)).toBeInTheDocument()
  })
  it('should render submit button', () => {
    render(<PageFilters fields={[]} />)
    expect(screen.getByText(/поиск/i)).toBeInTheDocument()
  })

  it('should render filter fields', () => {
    render(<PageFilters fields={mockFields} />)

    expect(screen.getByTestId('input-field')).toBeInTheDocument()
    expect(screen.getByTestId('select-field')).toBeInTheDocument()
    expect(screen.getByTestId('multiselect-field')).toBeInTheDocument()
    expect(screen.getByTestId('datepicker-field')).toBeInTheDocument()
    expect(screen.getByTestId('rangepicker-field')).toBeInTheDocument()
    expect(screen.getByTestId('custom-field')).toBeInTheDocument()
  })

  it('should block submit button on loading', () => {
    render(<PageFilters isLoading={true} fields={[]} />)
    expect(screen.getByRole('button', { name: 'Поиск' })).toBeDisabled()
  })

  it('should call onBeforeFilter function', async () => {
    const user = userEvent.setup()
    const onBeforeFilter = vitest
      .fn()
      .mockImplementation((data: unknown) => data)

    render(
      <PageFilters fields={mockInputField} onBeforeFilter={onBeforeFilter} />,
    )

    await user.click(screen.getByRole('button', { name: 'Поиск' }))

    await waitFor(() => {
      expect(onBeforeFilter).toHaveBeenCalledTimes(1)
    })
  })

  it('should call onFilter function', async () => {
    const user = userEvent.setup()
    const onFilter = vitest.fn().mockImplementation((data: unknown) => data)
    render(<PageFilters fields={mockInputField} onFilter={onFilter} />)

    await user.click(screen.getByRole('button', { name: 'Поиск' }))

    await waitFor(() => {
      expect(onFilter).toHaveBeenCalledTimes(1)
    })
  })
})
