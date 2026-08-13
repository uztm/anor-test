import { useCounterStore } from '../model/counter-store'
import { Button, Group, Stack, Title } from '@mantine/core'

export const Counter = () => {
  const { count, decrement, increment } = useCounterStore()

  return (
    <Stack>
      <Title order={3} data-testid={'count'}>
        {count}
      </Title>
      <Group>
        <Button onClick={decrement} variant={'light'} radius={'sm'}>
          Decrement
        </Button>
        <Button onClick={increment} variant={'light'} radius={'sm'}>
          Increment
        </Button>
      </Group>
    </Stack>
  )
}
