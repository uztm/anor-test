import type { ButtonProps } from '@mantine/core'
import { Button } from '@mantine/core'
import { RiDeleteBinLine } from '@remixicon/react'
import React from 'react'

interface IDeleteButtonProps extends ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const DeleteButton = (props: Readonly<IDeleteButtonProps>) => {
  return (
    <Button
      variant={'outlined'}
      color={'danger'}
      size={'small'}
      data-testid={'delete-button'}
      {...props}
    >
      <RiDeleteBinLine />
    </Button>
  )
}
