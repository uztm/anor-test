import type { PageFiltersField } from './types'

function parseFields<T>(fields: PageFiltersField<T>[], searchParams?: T) {
  const parse = fields.map((field) => {
    const replacedField = field.field.toString().replace('$', '.')

    const searchParamsValue = searchParams
      ? searchParams[replacedField as keyof T]
      : undefined

    let value: unknown = searchParamsValue ?? field.defaultValue ?? ''

    switch (field.type) {
      case 'multiselect':
        value = searchParamsValue
          ? `${searchParamsValue}`.split(',')
          : undefined
        break
      case 'datepicker':
        value = searchParamsValue
          ? new Date(searchParamsValue.toString())
          : undefined
        break
      case 'rangepicker':
        value = searchParamsValue
          ? searchParamsValue
              .toString()
              .split(',')
              .map((val) => new Date(val))
          : undefined
        break
    }

    return [field.field, value]
  })

  return Object.fromEntries(parse) as T
}

export function getInitialValues<T>(
  searchParams: T,
  fields: PageFiltersField<T>[],
) {
  return parseFields<T>(fields, searchParams)
}

export function resetValues<T>(fields: PageFiltersField<T>[]) {
  return parseFields(fields)
}

export function parseData<T extends object>(data: T) {
  return Object.entries(data).map(([k, v]) => {
    return {
      key: k.replace('$', '.') as keyof T,
      value: v as string,
    }
  })
}
