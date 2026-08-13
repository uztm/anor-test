import { requestFullscreen } from 'shared/lib'

import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { RiAlertLine } from '@remixicon/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LockdownWarningModalProps {
  opened: boolean
  violationCount: number
  maxViolations: number
  onReturn: () => void
  onLeave: () => void
}

export const LockdownWarningModal = ({
  opened,
  violationCount,
  maxViolations,
  onReturn,
  onLeave,
}: Readonly<LockdownWarningModalProps>) => {
  const { t } = useTranslation('exam')
  const [hasFullscreenError, setHasFullscreenError] = useState(false)

  const handleReturn = async () => {
    try {
      await requestFullscreen()
      setHasFullscreenError(false)
      onReturn()
    } catch {
      setHasFullscreenError(true)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onLeave}
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered={true}
      title={t('lockdown.title')}
    >
      <Stack gap={'md'}>
        <Alert
          variant={'light'}
          color={'red'}
          icon={<RiAlertLine />}
          title={t('lockdown.alertTitle')}
        >
          {t('lockdown.message')}
        </Alert>

        <Text size={'sm'} c={'dimmed'}>
          {t('lockdown.violationCount', {
            current: violationCount,
            max: maxViolations,
          })}
        </Text>

        {hasFullscreenError && (
          <Alert variant={'light'} color={'orange'}>
            {t('fullscreen.deniedMessage')}
          </Alert>
        )}

        <Group justify={'flex-end'} gap={'sm'}>
          <Button variant={'default'} onClick={onLeave}>
            {t('lockdown.leave')}
          </Button>
          <Button onClick={handleReturn}>{t('lockdown.return')}</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
