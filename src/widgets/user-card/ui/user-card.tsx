import { authStore } from 'entities/auth'
import { localStorageService } from 'shared/services'

import cn from './user-card.module.css'

import { Avatar, Box, Menu, Text } from '@mantine/core'
import {
  RiArrowRightSLine,
  RiLogoutCircleLine,
  RiProfileLine,
  RiSettingsLine,
} from '@remixicon/react'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface IUserCardProps {
  collapsed?: boolean
}
export const UserCard = ({ collapsed }: Readonly<IUserCardProps>) => {
  const { data } = authStore.useAuthUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    localStorageService.remove('access_token')
    queryClient.clear()
    navigate('/auth', { replace: true })
  }

  return (
    <Menu position={'right'} width={200}>
      <Menu.Target>
        <Box
          p={'xs'}
          className={classNames(cn.card, { [cn.collapsed]: collapsed })}
        >
          <Avatar className={classNames(cn.avatar)} size={36} color={'red'} />
          {!collapsed && (
            <React.Fragment>
              <div>
                <Text fw={600} fz={13} className={classNames(cn.text)}>
                  {data?.firstName} {data?.lastName}
                </Text>
                <Text fz={13} c={'dimmed'} className={classNames(cn.text)}>
                  {data?.email}
                </Text>
              </div>
              <Box ml={'auto'}>
                <RiArrowRightSLine />
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Actions</Menu.Label>
        <Menu.Item leftSection={<RiProfileLine />}>Profile</Menu.Item>
        <Menu.Item leftSection={<RiSettingsLine />}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<RiLogoutCircleLine />}
          color={'red'}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
