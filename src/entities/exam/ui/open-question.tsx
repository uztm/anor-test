import { Textarea } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface OpenQuestionProps {
  value?: string
  onChange: (value: string) => void
}

export const OpenQuestion = ({
  value,
  onChange,
}: Readonly<OpenQuestionProps>) => {
  const { t } = useTranslation('exam')

  return (
    <Textarea
      value={value ?? ''}
      onChange={(event) => {
        onChange(event.currentTarget.value)
      }}
      placeholder={t('question.answerPlaceholder')}
      label={t('question.answerLabel')}
      autosize={true}
      minRows={3}
      maxRows={8}
      autoComplete={'off'}
      spellCheck={false}
    />
  )
}
