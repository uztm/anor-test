import { LocaleSwitcher } from 'features/locale-switcher'
import { LoginForm } from 'features/login-form'
import { ColorSchemeToggle, Logo } from 'shared/ui'

import cn from './auth-page.module.css'

import { Group, Text, Title } from '@mantine/core'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

export const AuthPage = () => {
  const { t } = useTranslation()

  return (
    <div className={classNames(cn.wrapper)}>
      <div className={classNames(cn.locale)}>
        <Group gap={8}>
          <ColorSchemeToggle />
          <LocaleSwitcher variant={'default'} />
        </Group>
      </div>
      <div className={classNames(cn.content)}>
        <div className={classNames(cn.logo)}>
          <Logo variant={'small'} />
        </div>
        <div className={classNames(cn.card)}>
          <div className={classNames(cn.title)}>
            <Title>{t('authorization.title')}</Title>
            <Text>{t('authorization.subtitle')}</Text>
            <Group justify={'center'} gap={4}>
              <Text c={'red'} size={'xs'}>
                Login: <strong>emilys</strong>
              </Text>
              <Text c={'red'} size={'xs'}>
                Password: <strong>emilyspass</strong>
              </Text>
            </Group>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className={classNames(cn.background)} />
    </div>
  )
}
