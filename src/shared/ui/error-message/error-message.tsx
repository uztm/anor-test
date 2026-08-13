import { Box, Flex, Image, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface ErrorMessageProps {
  message?: string
}
export const ErrorMessage = ({ message }: Readonly<ErrorMessageProps>) => {
  const { t } = useTranslation()
  return (
    <Flex direction={'column'} m={'auto'} my={20} align={'center'} gap={24}>
      <Image src={'/assets/error.svg'} w={350} />
      <Box ta={'center'}>
        <Title order={4}>{t('errorMessage.title')}</Title>
        <Text>{message ?? t('errorMessage.message')}</Text>
      </Box>
    </Flex>
  )
}
