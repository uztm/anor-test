import { render } from 'shared/lib'

import { Counter } from './counter'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('Counter component', () => {
  it('should test counter', async () => {
    render(<Counter />)
    expect(screen.getByText('0')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /decrement/i }))
    expect(screen.getByText('-1')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByText('0')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
