import { ProductPage, ProductsPage } from 'pages/store/products'

import { PrivateRoute } from '../private-route'
import type { RouteObject } from 'react-router-dom'

export const productsRoutes: RouteObject = {
  path: 'products',
  children: [
    {
      index: true,
      element: (
        <PrivateRoute>
          <ProductsPage />
        </PrivateRoute>
      ),
    },
    {
      path: ':id',
      element: (
        <PrivateRoute>
          <ProductPage />
        </PrivateRoute>
      ),
    },
  ],
}
