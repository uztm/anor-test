import { render } from 'shared/lib'

import { ColorSchemeToggle } from './color-scheme-toggle'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('Color scheme toggle', () => {
  it('should check color scheme component', async () => {
    render(<ColorSchemeToggle />)

    expect(screen.getByTestId('light-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('dark-icon')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByTestId('light-icon')).not.toBeInTheDocument()
    expect(screen.getByTestId('dark-icon')).toBeInTheDocument()
  })
})
