import { authStore } from 'entities/auth'
import { render } from 'shared/lib'

import { UserCard } from './user-card'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vitest } from 'vitest'

describe('User Card component', () => {
  beforeAll(() => {
    vitest.spyOn(authStore, 'useAuthUser').mockImplementation(
      vitest.fn().mockReturnValue({
        data: {
          firstName: 'FirstName',
          lastName: 'LastName',
          email: 'test@mail.test',
        },
      }),
    )
  })
  it('should check if username and email shows', () => {
    render(<UserCard />)

    expect(screen.getByText(/firstname/i)).toBeInTheDocument()
    expect(screen.getByText(/lastname/i)).toBeInTheDocument()
    expect(screen.getByText(/test@mail.test/i)).toBeInTheDocument()
  })

  it('should check collapsed variant of component', () => {
    render(<UserCard collapsed={true} />)

    expect(screen.queryByText(/firstname/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/lastname/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/test@mail.test/i)).not.toBeInTheDocument()
  })

  it('should check dropdown menu', async () => {
    render(<UserCard />)

    await userEvent.click(screen.getByText('test@mail.test'))

    expect(await screen.findByText('Actions')).toBeInTheDocument()
    expect(await screen.findByText('Profile')).toBeInTheDocument()
    expect(await screen.findByText('Settings')).toBeInTheDocument()
    expect(await screen.findByText('Logout')).toBeInTheDocument()
  })
})
