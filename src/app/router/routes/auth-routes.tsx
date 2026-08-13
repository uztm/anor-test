import { AuthPage } from 'pages/auth'
import { localStorageService } from 'shared/services'

import type { RouteObject } from 'react-router-dom'
import { redirect } from 'react-router-dom'

export const authRoutes: RouteObject = {
  path: '/auth',
  loader: () => {
    if (localStorageService.get('access_token')) {
      return redirect('/')
    }
    return null
  },
  element: <AuthPage />,
}
