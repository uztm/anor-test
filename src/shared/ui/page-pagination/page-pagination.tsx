import { useSearchRequestParams } from 'shared/lib'
import type { PageableRequestParams } from 'shared/types'

import cn from './page-pagination.module.css'

import { Pagination } from '@mantine/core'
import classNames from 'classnames'

interface PagePaginationProps {
  total: number | undefined
}

export const PagePagination = ({
  total = 0,
}: Readonly<PagePaginationProps>) => {
  const { searchParams, setSearchParams } =
    useSearchRequestParams<PageableRequestParams>()
  const limit = searchParams.limit ? Number(searchParams.limit) : 30
  const skip = searchParams.skip ? Number(searchParams.skip) : 0

  const onPageChange = (value: number) =>
    setSearchParams({
      key: 'skip',
      value: value === 1 ? 0 : (value - 1) * limit,
    })

  const current = !skip ? 1 : Math.floor(skip / limit) + 1

  return (
    <Pagination
      className={classNames(cn.pagination)}
      total={total}
      value={current}
      onChange={onPageChange}
    />
  )
}
