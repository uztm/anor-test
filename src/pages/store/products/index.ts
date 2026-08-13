import { lazy } from 'react'

const ProductsPage = lazy(() =>
  import('./ui/products-page').then((res) => ({ default: res.ProductsPage })),
)
const ProductPage = lazy(() =>
  import('./ui/product-page').then((res) => ({ default: res.ProductPage })),
)
export { ProductPage, ProductsPage }
