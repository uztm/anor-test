import { generateColors } from '@mantine/colors-generator'
import type { DefaultMantineColor, MantineColorsTuple } from '@mantine/core'

export const MANTINE_COLORS: Partial<
  Record<DefaultMantineColor, MantineColorsTuple>
> = {
  red: generateColors('#900032'),
  gray: [
    '#f8f9fa',
    '#f1f3f5',
    '#f0f1f5',
    '#f0f1f5',
    '#f0f1f5',
    '#adb5bd',
    '#868e96',
    '#495057',
    '#343a40',
    '#212529',
  ],
}
