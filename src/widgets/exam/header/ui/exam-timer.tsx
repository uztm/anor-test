import { useCountdown } from 'shared/lib'

import { Badge, Group, Text } from '@mantine/core'
import { RiTimeLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'

/** Below this the timer turns red to signal the last stretch. */
const WARNING_THRESHOLD_MS = 5 * 60 * 1000

interface ExamTimerProps {
  endsAt: number
  onExpire: () => void
}

const pad = (value: number): string => String(value).padStart(2, '0')

export const ExamTimer = ({ endsAt, onExpire }: Readonly<ExamTimerProps>) => {
  const { t } = useTranslation('exam')
  const { minutes, seconds, remainingMs } = useCountdown(endsAt, onExpire)

  const isRunningOut = remainingMs <= WARNING_THRESHOLD_MS

  return (
    <Group gap={'xs'} wrap={'nowrap'}>
      <Text size={'sm'} c={'dimmed'} visibleFrom={'sm'}>
        {t('header.timeLeft')}
      </Text>
      <Badge
        size={'lg'}
        radius={'sm'}
        variant={'light'}
        color={isRunningOut ? 'red' : 'blue'}
        leftSection={<RiTimeLine size={14} />}
      >
        {`${pad(minutes)}:${pad(seconds)}`}
      </Badge>
    </Group>
  )
}
