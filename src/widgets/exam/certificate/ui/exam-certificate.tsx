import type { ExamAttempt, ExamScore } from 'entities/exam'

import classes from './exam-certificate.module.css'

import { Image } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface ExamCertificateProps {
  attempt: ExamAttempt
  score: ExamScore
}

const LOCALE_TAGS = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
} as const

/** Stable, readable id derived from the attempt itself — no randomness. */
const buildCertificateId = (attempt: ExamAttempt): string =>
  `AA-FE-${attempt.startedAt.toString(36).toUpperCase()}`

const formatIssueDate = (attempt: ExamAttempt): string =>
  new Intl.DateTimeFormat(LOCALE_TAGS[attempt.locale], {
    dateStyle: 'long',
  }).format(new Date(attempt.submittedAt ?? attempt.endsAt))

export const ExamCertificate = ({
  attempt,
  score,
}: Readonly<ExamCertificateProps>) => {
  const { t } = useTranslation('exam')

  const statusClass = score.passed ? classes.statPassed : classes.statFailed

  return (
    <div className={classes.container}>
      <div className={classes.certificate}>
        <span className={`${classes.corner} ${classes.cornerTopLeft}`} />
        <span className={`${classes.corner} ${classes.cornerBottomRight}`} />

        <div className={classes.frame}>
          <Image
            src={'/assets/logo.svg'}
            alt={t('brand.logoAlt')}
            className={classes.logo}
          />
          <div className={classes.organization}>{t('brand.track')}</div>

          <div className={classes.title}>{t('certificate.title')}</div>
          <div className={classes.subtitle}>{t('certificate.subtitle')}</div>

          <div className={classes.awardedTo}>{t('certificate.awardedTo')}</div>
          <div className={classes.name}>{attempt.participantName}</div>

          <div className={classes.description}>
            {t('certificate.description')}
          </div>

          <div className={classes.stats}>
            <div className={classes.stat}>
              <span className={classes.statLabel}>
                {t('certificate.score')}
              </span>
              <span className={classes.statValue}>
                {`${score.earnedPoints} / ${score.totalPoints}`}
              </span>
            </div>
            <div className={classes.stat}>
              <span className={classes.statLabel}>
                {t('certificate.percentage')}
              </span>
              <span
                className={classes.statValue}
              >{`${score.percentage}%`}</span>
            </div>
            <div className={classes.stat}>
              <span className={classes.statLabel}>
                {t('certificate.status')}
              </span>
              <span className={`${classes.statValue} ${statusClass}`}>
                {score.passed ? t('result.passed') : t('result.failed')}
              </span>
            </div>
          </div>

          <div className={classes.footer}>
            <div className={classes.footerBlock}>
              <span>{t('certificate.certificateId')}</span>
              <span className={classes.certificateId}>
                {buildCertificateId(attempt)}
              </span>
              <span>{`${t('certificate.date')}: ${formatIssueDate(attempt)}`}</span>
            </div>

            <div
              className={`${classes.footerBlock} ${classes.footerBlockRight}`}
            >
              <div className={classes.signatureLine} />
              <span>{t('certificate.signature')}</span>
              <span>{t('brand.organization')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
