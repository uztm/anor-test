import type { Exam, ExamLocale } from 'entities/exam'
import { useExamStore } from 'entities/exam'
import { requestFullscreen } from 'shared/lib'

import {
  NAME_MAX_LENGTH,
  validateParticipantName,
} from '../model/name-validation'
import {
  Alert,
  Button,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { RiFullscreenLine, RiInformationLine } from '@remixicon/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface StartExamFormProps {
  exam: Exam
}

const resolveLocale = (language: string): ExamLocale =>
  language.startsWith('uz') ? 'uz' : 'ru'

export const StartExamForm = ({ exam }: Readonly<StartExamFormProps>) => {
  const { t, i18n } = useTranslation('exam')
  const navigate = useNavigate()
  const startAttempt = useExamStore((state) => state.startAttempt)

  const [name, setName] = useState('')
  const [isTouched, setIsTouched] = useState(false)
  const [isFullscreenDenied, setIsFullscreenDenied] = useState(false)

  const locale = resolveLocale(i18n.language)

  // The exam itself only exists in uz and ru; any other UI language is
  // narrowed down before the attempt starts.
  useEffect(() => {
    if (i18n.language !== 'uz' && i18n.language !== 'ru') {
      void i18n.changeLanguage('ru')
    }
  }, [i18n])

  const nameError = validateParticipantName(name)
  const isValid = nameError === null

  const handleLocaleChange = (value: string) => {
    void i18n.changeLanguage(value)
  }

  const handleStart = () => {
    setIsTouched(true)

    if (!isValid) {
      return
    }

    // Must stay synchronous inside the click handler or the browser rejects it.
    requestFullscreen()
      .then(() => {
        setIsFullscreenDenied(false)
        startAttempt({ exam, participantName: name, locale })
        return navigate('/exam/run')
      })
      .catch(() => {
        setIsFullscreenDenied(true)
      })
  }

  return (
    <Stack gap={'lg'}>
      <Stack gap={'xs'}>
        <Text size={'sm'} fw={500}>
          {t('welcome.language')}
        </Text>
        <SegmentedControl
          value={locale}
          onChange={handleLocaleChange}
          data={[
            { value: 'uz', label: t('welcome.localeUz') },
            { value: 'ru', label: t('welcome.localeRu') },
          ]}
          fullWidth={true}
        />
      </Stack>

      <TextInput
        label={t('welcome.nameLabel')}
        placeholder={t('welcome.namePlaceholder')}
        value={name}
        maxLength={NAME_MAX_LENGTH}
        autoComplete={'off'}
        onChange={(event) => {
          setName(event.currentTarget.value)
        }}
        onBlur={() => {
          setIsTouched(true)
        }}
        error={isTouched && nameError ? t(nameError) : null}
      />

      <Alert
        variant={'light'}
        color={'blue'}
        icon={<RiInformationLine />}
        title={t('welcome.rulesTitle')}
      >
        <Stack gap={4}>
          <Text size={'sm'}>
            {t('welcome.ruleDuration', {
              minutes: exam.config.durationMinutes,
            })}
          </Text>
          <Text size={'sm'}>
            {t('welcome.ruleQuestions', {
              total: exam.config.totalQuestions,
            })}
          </Text>
          <Text size={'sm'}>
            {t('welcome.ruleViolations', {
              max: exam.config.maxViolations,
            })}
          </Text>
          <Text size={'sm'}>{t('welcome.ruleFullscreen')}</Text>
        </Stack>
      </Alert>

      {isFullscreenDenied && (
        <Alert
          variant={'light'}
          color={'red'}
          title={t('fullscreen.deniedTitle')}
        >
          {t('fullscreen.deniedMessage')}
        </Alert>
      )}

      <Button
        size={'md'}
        leftSection={<RiFullscreenLine />}
        disabled={!isValid}
        onClick={handleStart}
      >
        {isFullscreenDenied ? t('fullscreen.retry') : t('welcome.start')}
      </Button>
    </Stack>
  )
}
