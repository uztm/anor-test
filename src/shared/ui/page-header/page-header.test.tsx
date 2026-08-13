import { render } from 'shared/lib'

import { PageHeader } from './page-header'
import { Button } from '@mantine/core'
import { screen } from '@testing-library/dom'
import React from 'react'
import { describe, expect, it } from 'vitest'

describe('Page Header component', () => {
  it('should render title', () => {
    render(<PageHeader title={'Title'} />)
    expect(screen.getByTestId('title')).toContainHTML('Title')
  })
  it('should render empty title', () => {
    render(<PageHeader />)
    expect(screen.getByTestId('title')).toContainHTML('')
  })

  it('should render extras', () => {
    const extras: React.ReactNode[] = [<Button key={'1'}>First Btn</Button>]

    render(<PageHeader extra={extras} />)
    expect(screen.getByText(/first btn/i)).toBeInTheDocument()
  })
})
