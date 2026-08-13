import type { PageableRequestParams } from 'shared/types'

export interface PostProductDTO {
  name: string
  description: string
}

export interface ProductRequestParams extends PageableRequestParams {
  price: string
}

export interface GetAllProductsDTO {
  products: ProductDTO[]
  total: number
  skip: number
  limit: number
}

export interface ProductDTO {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  dimensions: ProductDimensionDTO
}

export interface ProductDimensionDTO {
  width: number
  height: number
  depth: number
}
