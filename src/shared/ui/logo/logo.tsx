import { Image } from '@mantine/core'

interface ILogoProps {
  variant?: 'default' | 'small'
}

export const Logo = ({ variant = 'default' }: ILogoProps) => {
  return variant === 'default' ? (
    <Image
      src={'/assets/logo.svg'}
      w={'100%'}
      h={'auto'}
      data-testid={'default'}
    />
  ) : (
    <Image
      src={'/assets/logo-small.svg'}
      w={'auto'}
      h={'100%'}
      mah={'75px'}
      data-testid={'small'}
    />
  )
}
