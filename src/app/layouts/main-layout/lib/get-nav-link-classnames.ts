import cn from '../ui/main-layout.module.css'

import type { NavLinkProps } from '@mantine/core'
import classNames from 'classnames'

export const getNavLinkClassnames = (
  collapsed: boolean,
): Pick<NavLinkProps, 'classNames'> => ({
  classNames: {
    label: classNames(cn.linkLabel),
    section: classNames(cn.linkSection, {
      [cn.collapsed]: collapsed,
    }),
    body: classNames(cn.linkBody, { [cn.collapsed]: collapsed }),
  },
})
