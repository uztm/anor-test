import { DeleteButton } from 'shared/ui'

import { Button, Modal, Stack, Text } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import React, { useState } from 'react'

interface DeleteEntityModalProps<T> {
  id: T
  fn: (id: T) => Promise<AxiosResponse>
}

export const DeleteEntityModal = <T,>({
  fn,
  id,
}: Readonly<DeleteEntityModalProps<T>>) => {
  const [open, setOpen] = useState(false)
  const handleChangeOpen = () => setOpen(!open)
  const { isPending, mutate } = useMutation({ mutationFn: fn })

  const handleDelete = () => mutate(id)

  return (
    <React.Fragment>
      <DeleteButton
        onClick={handleChangeOpen}
        loading={isPending}
        disabled={isPending}
      />
      <Modal opened={open} onClose={handleChangeOpen} title={'Delete entity'}>
        <Stack>
          <Text>Вы уверены?</Text>
          <Button onClick={handleDelete} color={'red'}>
            Да
          </Button>
        </Stack>
      </Modal>
    </React.Fragment>
  )
}
