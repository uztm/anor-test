import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { RiMoonLine, RiSunLine } from '@remixicon/react'

export const ColorSchemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  })

  return (
    <ActionIcon variant={'transparent'} onClick={toggleColorScheme}>
      {colorScheme === 'light' ? (
        <RiSunLine data-testid={'light-icon'} />
      ) : (
        <RiMoonLine data-testid={'dark-icon'} />
      )}
    </ActionIcon>
  )
}
