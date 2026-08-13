import cn from './main-layout.module.css'

import { getNavLinkClassnames } from '../lib/get-nav-link-classnames'
import type { IMenuItem } from '../model/types'
import { MenuItem } from './menu-item'
import { Menu, NavLink, Stack } from '@mantine/core'
import classNames from 'classnames'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface IMenuGroupProps {
  menuLink: IMenuItem
  collapsed: boolean
}

export const MenuGroup = ({
  menuLink,
  collapsed,
}: Readonly<IMenuGroupProps>) => {
  const { icon, label, to, children } = menuLink
  const location = useLocation()

  const isActive = location.pathname.includes(to as string)

  return (
    <React.Fragment>
      {collapsed ? (
        <Menu
          width={225}
          position={'right'}
          withArrow={true}
          trigger={'click-hover'}
        >
          <Menu.Target>
            <NavLink
              active={isActive}
              className={classNames(cn.link, { [cn.collapsed]: collapsed })}
              classNames={getNavLinkClassnames(collapsed).classNames}
              leftSection={icon}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{label}</Menu.Label>
            <Menu.Divider />
            <Stack gap={4}>
              {children?.map(({ to = '', label }) => {
                return (
                  <Menu.Item
                    className={classNames(cn.link, {
                      [cn.active]: to === location.pathname,
                    })}
                    component={Link}
                    to={to}
                    key={label}
                  >
                    {label}
                  </Menu.Item>
                )
              })}
            </Stack>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <NavLink
          defaultOpened={isActive}
          label={label}
          childrenOffset={20}
          leftSection={icon}
          className={classNames(cn.link)}
          classNames={{
            ...getNavLinkClassnames(collapsed).classNames,
            children: classNames(cn.children),
          }}
        >
          <Stack gap={4}>
            {children?.map(({ to, label }) => (
              <MenuItem key={to} to={to} label={label} />
            ))}
          </Stack>
        </NavLink>
      )}
    </React.Fragment>
  )
}
