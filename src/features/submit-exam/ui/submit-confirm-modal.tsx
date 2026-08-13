import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface SubmitConfirmModalProps {
  opened: boolean
  unansweredCount: number
  onClose: () => void
  onConfirm: () => void
}

export const SubmitConfirmModal = ({
  opened,
  unansweredCount,
  onClose,
  onConfirm,
}: Readonly<SubmitConfirmModalProps>) => {
  const { t } = useTranslation('exam')

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered={true}
      title={t('submit.title')}
    >
      <Stack gap={'md'}>
        <Text size={'sm'}>{t('submit.message')}</Text>

        <Text size={'sm'} fw={500} c={unansweredCount > 0 ? 'orange' : 'green'}>
          {unansweredCount > 0
            ? t('submit.unansweredCount', { value: unansweredCount })
            : t('submit.allAnswered')}
        </Text>

        <Group justify={'flex-end'} gap={'sm'}>
          <Button variant={'default'} onClick={onClose}>
            {t('submit.cancel')}
          </Button>
          <Button color={'red'} onClick={onConfirm}>
            {t('submit.confirm')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
