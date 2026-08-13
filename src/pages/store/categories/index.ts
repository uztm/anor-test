import { lazy } from 'react'

const CategoriesPage = lazy(() =>
  import('./ui/categories-page').then((res) => ({
    default: res.CategoriesPage,
  })),
)
export { CategoriesPage }
