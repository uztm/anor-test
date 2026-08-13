import type { ProductDimensionDTO } from '../api/types'

export class ProductDimension implements ProductDimensionDTO {
  width: number
  height: number
  depth: number

  constructor(dto?: Partial<ProductDimensionDTO>) {
    this.width = Number(dto?.width)
    this.height = Number(dto?.height)
    this.depth = Number(dto?.depth)
  }
}
