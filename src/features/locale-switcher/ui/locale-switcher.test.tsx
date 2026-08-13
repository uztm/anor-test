import { render } from 'shared/lib'

import { LocaleSwitcher } from './locale-switcher'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

describe('Locale Switcher', () => {
  it('should if check default locale was set', () => {
    render(<LocaleSwitcher />)

    expect(screen.getByRole('button', { name: 'Русский' })).toBeInTheDocument()
  })

  it('should check change locale logic', async () => {
    render(<LocaleSwitcher />)

    const button = screen.getByRole('button', { name: 'Русский' })
    await userEvent.click(button)

    const langBtn = await screen.findByText('English')
    expect(langBtn).toBeInTheDocument()

    await userEvent.click(langBtn)
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument()
  })
})
