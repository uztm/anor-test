import { authApi } from 'shared/api'
import { localStorageService } from 'shared/services'

import type { LoginFormFields } from '../model/types'
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { RiLoginCircleLine } from '@remixicon/react'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface LoginFormProps {
  onSubmitSuccess?: () => void
}

export const LoginForm = ({ onSubmitSuccess }: Readonly<LoginFormProps>) => {
  const { t } = useTranslation()
  const form = useForm<LoginFormFields>({
    initialValues: { password: '', username: '' },
  })
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      onSubmitSuccess?.()
      localStorageService.set('access_token', response.data.accessToken)
      navigate('/')
    },
    onError: (e: AxiosError) => {
      notifications.show({
        title: t('error'),
        message: e.message,
        color: 'red',
      })
    },
  })

  const onFinish = (values: LoginFormFields) => {
    mutate(values)
  }

  return (
    <form onSubmit={form.onSubmit(onFinish)}>
      <Stack>
        <TextInput
          label={t('authorization.login')}
          placeholder={t('authorization.inputLogin')}
          {...form.getInputProps('username')}
        />
        <PasswordInput
          label={t('authorization.password')}
          placeholder={t('authorization.inputPassword')}
          {...form.getInputProps('password')}
        />
        <Button
          type={'submit'}
          leftSection={<RiLoginCircleLine />}
          disabled={isPending}
          loading={isPending}
        >
          {t('authorization.enter')}
        </Button>
      </Stack>
    </form>
  )
}
