import cn from './page-header.module.css'

import { Card, Flex, Group, Text, Title } from '@mantine/core'
import { RiListSettingsLine } from '@remixicon/react'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PageHeaderProps {
  title?: string
  extra?: React.ReactNode[]
}

export const PageHeader = ({ extra, title }: Readonly<PageHeaderProps>) => {
  const { t } = useTranslation()
  return (
    <Flex
      justify={'space-between'}
      gap={8}
      mb={'lg'}
      align={'center'}
      wrap={'wrap'}
    >
      <Title className={classNames(cn.title)} order={1} data-testid={'title'}>
        {title}
      </Title>

      {extra && (
        <Card withBorder={false} px={18} py={6} radius={'xl'}>
          <Flex gap={'sm'} align={'center'}>
            <Group align={'center'} gap={8}>
              <RiListSettingsLine />
              <Text fz={14} fw={500}>
                {t('actions')}:
              </Text>
            </Group>
            {extra?.map((node) => node)}
          </Flex>
        </Card>
      )}
    </Flex>
  )
}
