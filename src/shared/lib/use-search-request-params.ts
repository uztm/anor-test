import { useSearchParams } from 'react-router-dom'

interface UseSearchRequestParamsReturnType<T> {
  searchParams: T
  getDefaultSearchParams: () => T
  setSearchParams: (param: QueryParam<T> | QueryParam<T>[]) => void
  resetSearchParams: () => void
}

interface QueryParam<T> {
  key: keyof T
  value: string | number | undefined | null
}

interface SearchParamsOptions<T> {
  defaultParams?: Partial<T>
}

export function useSearchRequestParams<T>(
  options?: SearchParamsOptions<T>,
): UseSearchRequestParamsReturnType<T> {
  const [searchParams, setSearchParams] = useSearchParams()
  const setQueryParam = ({ key, value }: QueryParam<T>) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key.toString(), value.toString())
    } else {
      searchParams.delete(key.toString())
    }
  }

  const getQueryParamEntries = () =>
    Object.fromEntries(searchParams.entries()) as unknown as T

  const getDefaultSearchParams = () => {
    if (options?.defaultParams) {
      Object.entries(options.defaultParams).forEach(([key, val]) => {
        const value = String(val)
        if (!searchParams.has(key)) {
          searchParams.set(key, val ? value : '')
        }
      })
    }

    return getQueryParamEntries()
  }

  const handleSetSearchParams = (param: QueryParam<T> | QueryParam<T>[]) => {
    if (Array.isArray(param)) {
      param.forEach((q) => setQueryParam(q))
    } else {
      setQueryParam(param)
    }
    setSearchParams(searchParams)
  }

  const resetSearchParams = () => {
    Array.from(searchParams.keys()).forEach((key) => searchParams.delete(key))
    getDefaultSearchParams()

    setSearchParams(searchParams)
  }

  return {
    searchParams: getQueryParamEntries(),
    getDefaultSearchParams,
    setSearchParams: handleSetSearchParams,
    resetSearchParams,
  }
}
