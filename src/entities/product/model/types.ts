import type { Product } from './Product'

export interface ProductsStoreData {
  products: Product[]
  total: number
  skip: number
  limit: number
}
