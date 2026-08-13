import { render } from 'shared/lib'

import { Logo } from './logo'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'

describe('Logo component', () => {
  it('should check default variant of logo', () => {
    render(<Logo variant={'default'} />)

    expect(screen.getByTestId('default')).toBeInTheDocument()
  })

  it('should render default variant if no variant prop passed', () => {
    render(<Logo />)

    expect(screen.getByTestId('default')).toBeInTheDocument()
  })

  it('should render small variant of logo', () => {
    render(<Logo variant={'small'} />)

    expect(screen.getByTestId('small')).toBeInTheDocument()
  })
})
