import { Locales } from '../../types'
import { resources } from '../i18n/resources'
import { createInstance } from 'i18next'

const instance = createInstance()

instance.init({
  defaultNS: 'translation',
  lng: Locales.ru,
  fallbackLng: Locales.en,
  resources,
  debug: false,
})

//CONFIG ONLY
// eslint-disable-next-line import/no-default-export
export default instance
