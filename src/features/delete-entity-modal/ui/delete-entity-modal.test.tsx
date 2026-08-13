import { render } from 'shared/lib'

import { DeleteEntityModal } from './delete-entity-modal'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vitest } from 'vitest'

describe('Delete Entity Modal', () => {
  it('should check delete method', async () => {
    const event = userEvent.setup()
    const mockFn = vitest.fn()
    render(<DeleteEntityModal id={'random'} fn={mockFn} />)

    expect(screen.queryByText(/вы уверены?/i)).not.toBeInTheDocument()

    const deleteButton = screen.getByTestId('delete-button')
    await event.click(deleteButton)

    expect(await screen.findByText(/вы уверены?/i)).toBeInTheDocument()
    const submitBtn = await screen.findByText(/да/i)
    await event.click(submitBtn)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
