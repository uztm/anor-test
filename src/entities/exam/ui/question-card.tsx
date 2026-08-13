import { isChoiceQuestion } from '../lib/load-exam'
import type { ExamQuestion, OptionId } from '../model/types'
import { ChoiceQuestion } from './choice-question'
import { OpenQuestion } from './open-question'
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface QuestionCardProps {
  question: ExamQuestion
  position: number
  total: number
  optionOrder?: OptionId[]
  value?: string
  onChange: (value: string) => void
}

export const QuestionCard = ({
  question,
  position,
  total,
  optionOrder,
  value,
  onChange,
}: Readonly<QuestionCardProps>) => {
  const { t } = useTranslation('exam')


  return (
    <Card withBorder={true} radius={'md'} padding={'lg'}>
      <Stack gap={'md'}>
        <Group justify={'space-between'} align={'flex-start'} wrap={'nowrap'}>
          <Text size={'sm'} c={'dimmed'} fw={500}>
            {t('question.counter', { current: position, total })}
          </Text>
          <Badge variant={'light'} radius={'sm'}>
            {t('question.points', { points: question.points })}
          </Badge>
        </Group>

        <Title order={3} fz={'h4'} lh={1.4}>
          {question.prompt}
        </Title>

        {isChoiceQuestion(question) ? (
          <ChoiceQuestion
            question={question}
            optionOrder={optionOrder}
            value={value}
            onChange={onChange}
          />
        ) : (
          <OpenQuestion value={value} onChange={onChange} />
        )}
      </Stack>
    </Card>
  )
}
