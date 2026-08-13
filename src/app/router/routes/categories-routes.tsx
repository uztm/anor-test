import { CategoriesPage } from 'pages/store/categories'

import { PrivateRoute } from '../private-route'
import type { RouteObject } from 'react-router-dom'

export const categoriesRoutes: RouteObject = {
  path: 'categories',
  children: [
    {
      index: true,
      element: (
        <PrivateRoute>
          <CategoriesPage />
        </PrivateRoute>
      ),
    },
  ],
}
