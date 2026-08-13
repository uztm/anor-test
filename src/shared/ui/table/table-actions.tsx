import { ActionIcon, Menu } from '@mantine/core'
import { RiMore2Fill } from '@remixicon/react'
import React from 'react'

export interface ITableActionItem {
  disabled?: boolean
  label: React.ReactNode
  icon?: React.ReactNode
  onClick: () => void
  permissions?: string[]
}

interface TableActionsProps {
  items: ITableActionItem[]
}

export const TableActions = ({ items }: Readonly<TableActionsProps>) => {
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="default" size={'38'} radius={'xl'}>
          <RiMore2Fill />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {items.map((item, index) => {
          const key = `${JSON.stringify(item.label)}-${index}`
          return (
            <Menu.Item
              disabled={item?.disabled}
              key={key}
              leftSection={item.icon}
              onClick={item.onClick}
            >
              {item.label}
            </Menu.Item>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
