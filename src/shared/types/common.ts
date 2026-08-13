export interface PageableRequestParams {
  q: string
  skip: string
  limit: string
  sortBy: string
  order: 'asc' | 'desc'
}

export enum Locales {
  ru = 'ru',
  uz = 'uz',
  en = 'en',
}

export type LocaleBasedData<T> = Record<Locales, T>
