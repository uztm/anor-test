import { productApi } from '../api/product-api'
import type { ProductRequestParams } from '../api/types'
import { Product } from './Product'
import type { ProductsStoreData } from './types'
import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

const PRODUCTS_KEY = 'PRODUCTS_KEY'

export function useProducts(
  params?: ProductRequestParams,
  options?: UseQueryOptions<ProductsStoreData, AxiosError>,
) {
  return useQuery<ProductsStoreData, AxiosError>({
    queryKey: [PRODUCTS_KEY, params],
    queryFn: () =>
      productApi.getAllProducts(params).then(({ data }) => ({
        limit: data.limit,
        skip: data.skip,
        total: data.total,
        products: data.products.map((productDTO) => new Product(productDTO)),
      })),
    ...options,
  })
}

export const productStore = {
  useProducts,
  PRODUCTS_KEY,
}
