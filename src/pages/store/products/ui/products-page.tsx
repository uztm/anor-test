import type { ProductRequestParams } from 'entities/product'
import { productStore } from 'entities/product'
import { useSearchRequestParams } from 'shared/lib'
import { ErrorMessage, PageHeader, PagePagination } from 'shared/ui'

import { Box, Button } from '@mantine/core'
import { closeModal, openModal } from '@mantine/modals'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProductForm } from 'src/features/product-form'
import { ProductsFilter } from 'src/widgets/products/filter'
import { ProductsTable } from 'src/widgets/products/table'

export const ProductsPage = () => {
  const createProductModalId = React.useId()
  const [t] = useTranslation(['menu'])
  const { getDefaultSearchParams } =
    useSearchRequestParams<ProductRequestParams>()
  const { data, isLoading, isError, error, refetch } = productStore.useProducts(
    getDefaultSearchParams(),
  )

  const handleCreateProduct = () => {
    const onSubmitSuccess = () => {
      closeModal(createProductModalId)
      refetch()
    }

    openModal({
      id: createProductModalId,
      title: 'Новый продукт',
      children: <ProductForm onSubmitSuccess={onSubmitSuccess} />,
    })
  }

  return (
    <div>
      <PageHeader
        title={t('products')}
        extra={[
          <Button key={'add'} onClick={handleCreateProduct}>
            Добавить
          </Button>,
        ]}
      />
      <ProductsFilter />
      {isError ? (
        <ErrorMessage message={error?.message} />
      ) : (
        <Box data-testid={'products-data'}>
          <ProductsTable data={data?.products} loading={isLoading} />
        </Box>
      )}
      <PagePagination total={data?.total} />
    </div>
  )
}
