import { render } from 'shared/lib'

import { ErrorMessage } from './error-message'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'

describe('Error Message component', () => {
  it('should render error message component', () => {
    render(<ErrorMessage />)
    expect(screen.getByText(/Произошла ошибка/i)).toBeInTheDocument()
  })

  it('should render message from prop', () => {
    render(<ErrorMessage message={'Тестовая ошибка'} />)
    expect(screen.getByText(/Тестовая ошибка/i)).toBeInTheDocument()
  })

  it('should render default message text', () => {
    render(<ErrorMessage />)
    expect(
      screen.getByText(/В скором времени мы постараемся все исправить/i),
    ).toBeInTheDocument()
  })
})
