import { checkServiceWorker } from 'shared/lib'

import cn from './update-standalone-app.module.css'

import { Box, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { RiArrowDownCircleLine } from '@remixicon/react'
import classNames from 'classnames'
import { useCallback, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface IUpdateStandaloneAppProps {
  variant?: 'icon-only' | 'with-text'
}

const CHECK_SW_TIMEOUT = 30 * 60 * 1000

export const UpdateStandaloneApp = ({
  variant,
}: Readonly<IUpdateStandaloneAppProps>) => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  const handleChangeNeedRefresh = useCallback(
    () => setNeedRefresh(true),
    [setNeedRefresh],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      checkServiceWorker(handleChangeNeedRefresh)
    }, CHECK_SW_TIMEOUT)

    return () => {
      clearInterval(interval)
    }
  }, [handleChangeNeedRefresh])

  const handleUpdate = () => updateServiceWorker(true)

  return (
    <Box
      display={needRefresh ? 'flex' : 'none'}
      bg={'blue.0'}
      p={'xs'}
      className={classNames(cn.box)}
      onClick={handleUpdate}
    >
      <ThemeIcon variant={'white'} color={'blue'} radius={'lg'}>
        <RiArrowDownCircleLine className={classNames(cn.icon)} />
      </ThemeIcon>
      {variant === 'with-text' && (
        <Stack gap={4}>
          <Title fz={12} c={'blue'} className={classNames(cn.title)}>
            Доступно обновление
          </Title>
          <Text fz={12}>
            Нажмите для обновления приложения до актуальной версии
          </Text>
        </Stack>
      )}
    </Box>
  )
}
