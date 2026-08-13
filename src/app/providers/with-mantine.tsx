import { MANTINE_COLORS } from '../config/mantine-colors'
import type { MantineThemeOverride } from '@mantine/core'
import { createTheme, MantineProvider, Modal, Table } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { PropsWithChildren } from 'react'

const theme: MantineThemeOverride = createTheme({
  colors: MANTINE_COLORS,
  primaryColor: 'red',
  primaryShade: 9,
  fontFamily: 'Nunito, sans-serif',
  headings: {
    fontFamily: 'Montserrat, sans-serif',
  },
  defaultRadius: 'md',
  scale: 1.05,
  components: {
    Table: Table.extend({
      styles: {
        td: { padding: '12px 16px' },
        th: { padding: '12px' },
      },
    }),
    Modal: Modal.extend({
      styles: {
        content: { borderRadius: '12px' },
        title: { fontSize: 22, fontWeight: 600 },
      },
    }),
  },
})

export const WithMantine = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <MantineProvider defaultColorScheme={'light'} theme={theme}>
      <Notifications position={'top-right'} />
      {children}
    </MantineProvider>
  )
}
