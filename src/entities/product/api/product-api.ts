import { $api } from 'shared/services'

import type {
  GetAllProductsDTO,
  PostProductDTO,
  ProductDTO,
  ProductRequestParams,
} from './types'

const baseUrl = '/products'

const getAllProducts = (params?: ProductRequestParams) =>
  $api.get<GetAllProductsDTO>(baseUrl, { params })

const deleteProduct = (productId: number) =>
  $api.delete<unknown>(baseUrl + '/' + productId)

const create = (data: PostProductDTO) => $api.post<ProductDTO>(baseUrl, data)

const update = (data: PostProductDTO) => $api.post<ProductDTO>(baseUrl, data)

export const productApi = { getAllProducts, deleteProduct, create, update }
