import { authApi } from 'shared/api'

import { AuthUser } from './AuthUser'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

const AUTH_USER_KEY = 'AUTH_USER_KEY'

function useAuthUser(options?: UseQueryOptions<AuthUser, AxiosError>) {
  return useQuery<AuthUser, AxiosError>({
    queryKey: [AUTH_USER_KEY],
    queryFn: () => authApi.me().then((response) => new AuthUser(response.data)),
    ...options,
  })
}

export const authStore = {
  useAuthUser,
  AUTH_USER_KEY,
}
