import { Counter } from 'entities/counter'

import { Stack, Title } from '@mantine/core'

export const HomePage = () => {
  return (
    <Stack>
      <Title>Home Page</Title>
      <Counter />
    </Stack>
  )
}
