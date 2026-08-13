import type { ExamAttempt, ExamLocale } from 'entities/exam'
import { Logo } from 'shared/ui'

import { ExamTimer } from './exam-timer'
import {
  Badge,
  Box,
  Divider,
  Group,
  Paper,
  Progress,
  SegmentedControl,
  Stack,
  Text,
} from '@mantine/core'
import { RiShieldCheckLine, RiShieldFlashLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

interface ExamHeaderProps {
  attempt: ExamAttempt
  answeredCount: number
  onExpire: () => void
  onLocaleChange: (locale: ExamLocale) => void
}

export const ExamHeader = ({
  attempt,
  answeredCount,
  onExpire,
  onLocaleChange,
}: Readonly<ExamHeaderProps>) => {
  const { t } = useTranslation('exam')

  const total = attempt.questionOrder.length
  const violationCount = attempt.violations.length
  const hasViolations = violationCount > 0

  return (
    <Paper withBorder={true} radius={'md'} p={'md'}>
      <Stack gap={'sm'}>
        <Group justify={'space-between'} wrap={'nowrap'} gap={'md'}>
          <Box w={140} miw={140}>
            <Logo />
          </Box>
          <Text
            size={'xs'}
            fw={600}
            tt={'uppercase'}
            c={'dimmed'}
            ta={'right'}
            lineClamp={2}
          >
            {t('brand.examTitle')}
          </Text>
        </Group>

        <Divider />

        <Group justify={'space-between'} wrap={'wrap'} gap={'sm'}>
          <Group gap={'sm'} wrap={'nowrap'}>
            <Text fw={600} lineClamp={1}>
              {attempt.participantName}
            </Text>
            <Badge
              variant={'light'}
              radius={'sm'}
              color={hasViolations ? 'red' : 'gray'}
              leftSection={
                hasViolations ? (
                  <RiShieldFlashLine size={14} />
                ) : (
                  <RiShieldCheckLine size={14} />
                )
              }
            >
              {t('header.violations', {
                current: violationCount,
                max: attempt.maxViolations,
              })}
            </Badge>
          </Group>

          <Group gap={'md'} wrap={'nowrap'}>
            <SegmentedControl
              size={'xs'}
              value={attempt.locale}
              onChange={(value) => {
                onLocaleChange(value as ExamLocale)
              }}
              data={[
                { value: 'uz', label: t('welcome.localeUz') },
                { value: 'ru', label: t('welcome.localeRu') },
              ]}
            />
            <ExamTimer endsAt={attempt.endsAt} onExpire={onExpire} />
          </Group>
        </Group>

        <Stack gap={4}>
          <Group justify={'space-between'}>
            <Text size={'xs'} c={'dimmed'}>
              {t('header.progress', { current: answeredCount, total })}
            </Text>
            <Text size={'xs'} c={'dimmed'}>
              {t('question.counter', {
                current: attempt.currentIndex + 1,
                total,
              })}
            </Text>
          </Group>
          <Progress
            value={total > 0 ? (answeredCount / total) * 100 : 0}
            size={'sm'}
            radius={'xl'}
          />
        </Stack>
      </Stack>
    </Paper>
  )
}
