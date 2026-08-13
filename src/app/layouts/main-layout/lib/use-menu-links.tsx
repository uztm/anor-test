import type { IMenuItem } from '../model/types'
import { RiDashboard2Line, RiHome2Line, RiStore2Line } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

export function useMenuLinks() {
  const { t } = useTranslation(['menu'])

  const items: IMenuItem[] = [
    {
      to: '/home',
      icon: <RiHome2Line />,
      label: t('home'),
    },
    {
      to: '/dashboard',
      icon: <RiDashboard2Line />,
      label: t('dashboard'),
    },
    {
      to: '/store',
      icon: <RiStore2Line />,
      label: t('store'),
      children: [
        {
          to: '/store/products',
          label: t('products'),
        },
        {
          to: '/store/categories',
          label: t('categories'),
        },
      ],
    },
  ]

  return items
}
