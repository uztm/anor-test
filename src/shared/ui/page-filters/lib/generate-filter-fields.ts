import type { PageFiltersField } from '../model/types'

export function generateFilterFields<T>(
  fields: PageFiltersField<T>[],
): PageFiltersField<T>[] {
  return fields.map((field) => field)
}
