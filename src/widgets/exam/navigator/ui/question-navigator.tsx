import classes from './question-navigator.module.css'

import { Button, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface QuestionNavigatorProps {
  questionIds: string[]
  answeredIds: Set<string>
  currentIndex: number
  onSelect: (index: number) => void
}

export const QuestionNavigator = ({
  questionIds,
  answeredIds,
  currentIndex,
  onSelect,
}: Readonly<QuestionNavigatorProps>) => {
  const { t } = useTranslation('exam')

  return (
    <Paper withBorder={true} radius={'md'} p={'md'}>
      <Stack gap={'sm'}>
        <Text size={'sm'} fw={600}>
          {t('navigator.title')}
        </Text>

        <SimpleGrid cols={{ base: 8, sm: 10, md: 7 }} spacing={'xs'}>
          {questionIds.map((questionId, index) => {
            const isCurrent = index === currentIndex
            const isAnswered = answeredIds.has(questionId)

            return (
              <Button
                key={questionId}
                size={'compact-sm'}
                px={0}
                radius={'sm'}
                variant={isCurrent || isAnswered ? 'filled' : 'default'}
                color={isCurrent ? 'blue' : 'teal'}
                onClick={() => {
                  onSelect(index)
                }}
                aria-current={isCurrent}
                aria-label={t('navigator.goToQuestion', { number: index + 1 })}
              >
                {index + 1}
              </Button>
            )
          })}
        </SimpleGrid>

        <Group gap={'md'}>
          <Group gap={6}>
            <span className={`${classes.dot} ${classes.current}`} />
            <Text size={'xs'} c={'dimmed'}>
              {t('navigator.current')}
            </Text>
          </Group>
          <Group gap={6}>
            <span className={`${classes.dot} ${classes.answered}`} />
            <Text size={'xs'} c={'dimmed'}>
              {t('navigator.answered')}
            </Text>
          </Group>
          <Group gap={6}>
            <span className={`${classes.dot} ${classes.unanswered}`} />
            <Text size={'xs'} c={'dimmed'}>
              {t('navigator.unanswered')}
            </Text>
          </Group>
        </Group>
      </Stack>
    </Paper>
  )
}
