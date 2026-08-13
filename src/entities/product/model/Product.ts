import type { ProductDTO } from '../api/types'
import { ProductDimension } from './ProductDimension'

export class Product implements ProductDTO {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  dimensions: ProductDimension

  constructor(dto: Partial<ProductDTO>) {
    this.id = Number(dto.id)
    this.title = String(dto.title)
    this.description = String(dto.description)
    this.category = String(dto.category)
    this.price = Number(dto.price)
    this.discountPercentage = Number(dto.discountPercentage)
    this.rating = Number(dto.rating)
    this.stock = Number(dto.stock)
    this.tags = dto.tags ?? []
    this.dimensions = new ProductDimension(dto.dimensions)
  }
}
