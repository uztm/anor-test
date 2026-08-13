import { LocaleSwitcher } from 'features/locale-switcher'
import {
  ColorSchemeToggle,
  ErrorMessage,
  Logo,
  UpdateStandaloneApp,
} from 'shared/ui'
import { UserCard } from 'widgets/user-card'

import cn from './main-layout.module.css'

import { useCollapsedNavbar } from '../lib/use-collapsed-navbar'
import { MainMenu } from './main-menu'
import {
  AppShell,
  Box,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { RiExpandLeftLine } from '@remixicon/react'
import classNames from 'classnames'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Link, Outlet } from 'react-router-dom'

export const MainLayout = () => {
  const { collapsed, toggleCollapsed } = useCollapsedNavbar()

  return (
    <AppShell className={classNames(cn.layout, { [cn.collapsed]: collapsed })}>
      <AppShell.Navbar className={classNames(cn.sidebar)} withBorder={false}>
        <Box className={classNames(cn.collapsedWrapper)}>
          <UnstyledButton
            onClick={toggleCollapsed}
            className={classNames(cn.collapsedButton)}
          >
            <RiExpandLeftLine
              className={classNames(cn.collapsedIcon)}
              size={14}
            />
          </UnstyledButton>
        </Box>
        <AppShell.Section className={classNames(cn.logo)}>
          <Link to={'/'}>
            <Logo variant={collapsed ? 'small' : 'default'} />
          </Link>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} scrollbars={'y'}>
          <MainMenu collapsed={collapsed} />
        </AppShell.Section>
        <AppShell.Section p={'xs'}>
          <Stack gap={4}>
            <UpdateStandaloneApp
              variant={collapsed ? 'icon-only' : 'with-text'}
            />
            <UserCard collapsed={collapsed} />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main className={classNames(cn.main)}>
        <Box className={classNames(cn.content)}>
          <ErrorBoundary fallback={<ErrorMessage />}>
            <Suspense>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Box>
        <Box className={classNames(cn.footer)}>
          <Group justify={'flex-end'} gap={12}>
            <Text fz={14} fw={500}>
              Copyright © {new Date().getFullYear()}. Anorbank
            </Text>
            <LocaleSwitcher />
            <ColorSchemeToggle />
          </Group>
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
