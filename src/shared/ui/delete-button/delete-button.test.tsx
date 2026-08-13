import { render } from 'shared/lib'

import { DeleteButton } from './delete-button'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'

describe('Delete Button component', () => {
  it('should render delete button', () => {
    render(<DeleteButton />)

    expect(screen.getByTestId('delete-button')).toBeInTheDocument()
  })
})
