import { authApi } from 'shared/api'
import { render } from 'shared/lib'
import { localStorageService } from 'shared/services'

import { LoginForm } from './login-form'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vitest } from 'vitest'

describe('Login Form', () => {
  it('should test login form', async () => {
    const onSubmitSuccess = vitest.fn()
    const loginFn = vitest.spyOn(authApi, 'login').mockImplementation(
      vitest.fn().mockResolvedValue({
        data: {
          accessToken: 'Some string',
        },
      }),
    )
    const localStorageSpy = vitest.spyOn(localStorageService, 'set')

    render(<LoginForm onSubmitSuccess={onSubmitSuccess} />)

    await userEvent.type(screen.getByLabelText(/логин/i), 'login')
    await userEvent.type(screen.getByLabelText(/пароль/i), 'pass')

    expect(screen.getByDisplayValue(/login/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue(/pass/i)).toBeInTheDocument()

    await userEvent.click(screen.getByText(/Войти/i))

    expect(loginFn).toHaveBeenCalledOnce()
    expect(onSubmitSuccess).toHaveBeenCalledOnce()
    expect(localStorageSpy).toHaveBeenCalledOnce()
  })
})
