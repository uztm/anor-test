import cn from './main-layout.module.css'

import { useMenuLinks } from '../lib/use-menu-links'
import { MenuGroup } from './menu-group'
import { MenuItem } from './menu-item'
import { Box } from '@mantine/core'
import classNames from 'classnames'

interface IMainMenuProps {
  collapsed: boolean
}
export const MainMenu = ({ collapsed }: Readonly<IMainMenuProps>) => {
  const links = useMenuLinks()

  return (
    <Box
      p={'md'}
      className={classNames(cn.menu, { [cn.collapsed]: collapsed })}
    >
      {links.map((menuLink) => {
        if (menuLink.children?.length) {
          return (
            <MenuGroup
              collapsed={collapsed}
              menuLink={menuLink}
              key={menuLink.label}
            />
          )
        }

        return (
          <MenuItem
            key={menuLink.label}
            to={menuLink.to}
            label={menuLink.label}
            icon={menuLink.icon}
            collapsed={collapsed}
          />
        )
      })}
    </Box>
  )
}
