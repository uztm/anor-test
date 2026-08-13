import { localStorageService } from 'shared/services'

import { MainLayout } from '../layouts/main-layout'
import { authRoutes } from './routes/auth-routes'
import { categoriesRoutes } from './routes/categories-routes'
import { dashboardRoutes } from './routes/dashboard-routes'
import { examRoutes } from './routes/exam-routes'
import { homeRoutes } from './routes/home-routes'
import { productsRoutes } from './routes/products-routes'
import type { RouteObject } from 'react-router-dom'
import { Navigate, redirect } from 'react-router-dom'

function loader(): Response | null {
  if (!localStorageService.get('access_token')) {
    return redirect('/auth')
  }
  return null
}

export const appRouter: RouteObject[] = [
  authRoutes,
  examRoutes,
  {
    element: <MainLayout />,
    loader,
    children: [
      homeRoutes,
      dashboardRoutes,
      {
        path: 'store',
        children: [productsRoutes, categoriesRoutes],
      },
    ],
  },
  // The exam is the public entry point of this deployment, so unknown paths
  // (including "/") land there instead of the authenticated home page.
  {
    path: '*',
    element: <Navigate to={'/exam'} replace={true} />,
  },
]
