import { ExamValidationError } from '../lib/validate-exam'
import { Alert, Code, Container, List, Stack, Text } from '@mantine/core'
import { RiErrorWarningLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

interface ExamDataErrorProps {
  error: Error | null
}

export const ExamDataError = ({ error }: Readonly<ExamDataErrorProps>) => {
  const { t } = useTranslation('exam')

  const issues = error instanceof ExamValidationError ? error.issues : []

  return (
    <Container size={'sm'} py={'xl'}>
      <Alert
        variant={'light'}
        color={'red'}
        icon={<RiErrorWarningLine />}
        title={t('dataError.title')}
      >
        <Stack gap={'sm'}>
          <Text size={'sm'}>{t('dataError.message')}</Text>

          {issues.length > 0 ? (
            <List size={'sm'} spacing={4}>
              {issues.map((issue) => (
                <List.Item key={issue}>
                  <Code>{issue}</Code>
                </List.Item>
              ))}
            </List>
          ) : (
            <Code block={true}>{error?.message ?? t('dataError.unknown')}</Code>
          )}
        </Stack>
      </Alert>
    </Container>
  )
}
