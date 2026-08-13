import './config/i18n'

import './styles/global.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/dropzone/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/charts/styles.css'
import 'mantine-datatable/styles.css'

import { WithMantine } from './providers/with-mantine'
import { WithQuery } from './providers/with-query'
import { WithRouter } from './providers/with-router'

export const App = () => {
  return (
    <WithQuery>
      <WithMantine>
        <WithRouter />
      </WithMantine>
    </WithQuery>
  )
}
