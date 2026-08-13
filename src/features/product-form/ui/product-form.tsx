import type { Product } from 'entities/product'
import { productApi } from 'entities/product'

import type { ProductFormFields } from '../model/types'
import { Button, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'

interface ProductFormProps {
  product?: Product
  onSubmitSuccess?: () => void
}

export const ProductForm = ({
  product,
  onSubmitSuccess,
}: Readonly<ProductFormProps>) => {
  const { getInputProps, onSubmit } = useForm<ProductFormFields>({
    initialValues: {
      name: product?.title || '',
      description: product?.description || '',
    },
  })

  const onSuccess = () => {
    notifications.show({ color: 'green', message: 'Success' })
    onSubmitSuccess?.()
  }
  const onError = () => {
    notifications.show({ color: 'red', message: 'Error' })
  }
  const create = useMutation({
    mutationFn: productApi.create,
    onSuccess,
    onError,
  })
  const update = useMutation({
    mutationFn: productApi.update,
    onSuccess,
    onError,
  })

  const onFinish = (values: ProductFormFields) =>
    product ? update.mutate(values) : create.mutate(values)

  const isLoading = create.isPending || update.isPending

  return (
    <form onSubmit={onSubmit(onFinish)}>
      <Stack>
        <TextInput
          placeholder={'Input name'}
          label={'Name'}
          name={'name'}
          {...getInputProps('name')}
        />
        <TextInput
          placeholder={'Input description'}
          label={'Description'}
          name={'description'}
          {...getInputProps('description')}
        />
        <div>
          <Button loading={isLoading} disabled={isLoading} type={'submit'}>
            Отправить
          </Button>
        </div>
      </Stack>
    </form>
  )
}
