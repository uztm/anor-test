import type { ButtonVariant } from '@mantine/core'
import { Button, Image, Menu } from '@mantine/core'
import { RiArrowDownSLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

const locales = [
  {
    label: 'Русский',
    key: 'ru',
    flag: '/assets/ru.png',
  },
  {
    label: "O'zbekcha",
    key: 'uz',
    flag: '/assets/uz.png',
  },
  {
    label: 'English',
    key: 'en',
    flag: '/assets/en.png',
  },
]

interface ILocaleSwitcherProps {
  variant?: ButtonVariant
}

export const LocaleSwitcher = ({
  variant = 'transparent',
}: Readonly<ILocaleSwitcherProps>) => {
  const { t, i18n } = useTranslation()

  const activeLocale = locales.find((locale) => locale.key === t('langCode'))

  const renderFlag = (src: string | undefined) => <Image src={src} w={15} />

  return (
    <Menu width={200} withArrow={true}>
      <Menu.Target>
        <Button
          size={'xs'}
          variant={variant}
          radius={'md'}
          leftSection={renderFlag(activeLocale?.flag)}
          rightSection={<RiArrowDownSLine />}
        >
          {activeLocale?.label}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {locales.map((locale) => {
          const onClick = async () => {
            await i18n.changeLanguage(locale.key)
          }
          return (
            <Menu.Item
              disabled={locale.key === activeLocale?.key}
              key={locale.key}
              onClick={onClick}
              leftSection={renderFlag(locale.flag)}
              fz={13}
            >
              {locale.label}
            </Menu.Item>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  )
}
