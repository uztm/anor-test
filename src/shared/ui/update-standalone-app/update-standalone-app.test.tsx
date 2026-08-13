import { render } from 'shared/lib'

import { UpdateStandaloneApp } from './update-standalone-app'
import { screen } from '@testing-library/dom'
import { describe, expect, it } from 'vitest'

describe('Update Standalone App', () => {
  it('should render component with text', () => {
    render(<UpdateStandaloneApp variant={'with-text'} />)
    expect(screen.queryByText('Доступно обновление')).toBeInTheDocument()
    expect(
      screen.queryByText(
        'Нажмите для обновления приложения до актуальной версии',
      ),
    ).toBeInTheDocument()
  })

  it('should render component without text', () => {
    render(<UpdateStandaloneApp />)
    expect(screen.queryByText('Доступно обновление')).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        'Нажмите для обновления приложения до актуальной версии',
      ),
    ).not.toBeInTheDocument()
  })
})
