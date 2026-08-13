import 'i18next'

import type { resources } from 'shared/lib'

import type { defaultNS } from '../config/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: (typeof resources)['ru']
  }
}
