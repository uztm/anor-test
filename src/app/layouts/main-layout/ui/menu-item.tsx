import cn from './main-layout.module.css'

import { getNavLinkClassnames } from '../lib/get-nav-link-classnames'
import { NavLink } from '@mantine/core'
import classNames from 'classnames'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface MenuItemProps {
  to?: string
  icon?: React.ReactNode
  label: string
  collapsed?: boolean
}

export const MenuItem = ({
  to = '',
  icon,
  label,
  collapsed = false,
}: Readonly<MenuItemProps>) => {
  const location = useLocation()
  const isActive = location.pathname.includes(to)

  return (
    <NavLink
      active={isActive}
      className={classNames(cn.link, { [cn.collapsed]: collapsed })}
      classNames={getNavLinkClassnames(collapsed).classNames}
      label={!collapsed && label}
      leftSection={icon}
      component={Link}
      to={to}
    />
  )
}
