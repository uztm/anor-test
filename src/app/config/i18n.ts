import { resources } from 'shared/lib'
import { Locales } from 'shared/types'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const defaultNS = 'translation'
export const fallbackLng = Locales.ru

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  defaultNS,
  fallbackLng,
  resources,
  debug: true,
})

//CONFIG ONLY
// eslint-disable-next-line import/no-default-export
export default i18n
