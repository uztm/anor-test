import type { ViolationType } from 'entities/exam'
import { useExamStore } from 'entities/exam'
import { isFullscreen } from 'shared/lib'

import {
  BLOCKED_DEVTOOLS_KEYS,
  BLOCKED_FUNCTION_KEYS,
  BLOCKED_KEYS,
  EDITABLE_TAGS,
  VIOLATION_DEBOUNCE_MS,
} from './lockdown-config'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseExamLockdownParams {
  /** Lockdown only runs while an attempt is actually in progress. */
  isActive: boolean
}

const isEditableTarget = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  EDITABLE_TAGS.includes(target.tagName as (typeof EDITABLE_TAGS)[number])

const isBlockedKeyCombination = (event: KeyboardEvent): boolean => {
  const key = event.key.toLowerCase()

  if (
    BLOCKED_FUNCTION_KEYS.includes(
      event.key as (typeof BLOCKED_FUNCTION_KEYS)[number],
    )
  ) {
    return true
  }

  const hasModifier = event.ctrlKey || event.metaKey

  if (!hasModifier) {
    return false
  }

  if (
    event.shiftKey &&
    BLOCKED_DEVTOOLS_KEYS.includes(
      key as (typeof BLOCKED_DEVTOOLS_KEYS)[number],
    )
  ) {
    return true
  }

  return BLOCKED_KEYS.includes(key as (typeof BLOCKED_KEYS)[number])
}

/**
 * Best-effort exam lockdown.
 *
 * A web page cannot close other windows, block Alt+Tab or stop `Esc` from
 * leaving fullscreen — so everything here is *detection plus warning*, never
 * prevention, except for the in-page clipboard/context-menu handlers.
 */
export const useExamLockdown = ({ isActive }: UseExamLockdownParams) => {
  const logViolation = useExamStore((state) => state.logViolation)
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const lastViolationAtRef = useRef(0)

  const closeWarning = useCallback(() => {
    setIsWarningOpen(false)
  }, [])

  useEffect(() => {
    if (!isActive) {
      return
    }

    const report = (type: ViolationType) => {
      const now = Date.now()

      if (now - lastViolationAtRef.current < VIOLATION_DEBOUNCE_MS) {
        return
      }

      lastViolationAtRef.current = now
      logViolation(type)
      setIsWarningOpen(true)
    }

    const handleFullscreenChange = () => {
      if (!isFullscreen()) {
        report('fullscreen_exit')
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        report('tab_hidden')
      }
    }

    const handleBlur = () => {
      // `visibilitychange` already covers tab switches; the debounce keeps a
      // single alt-tab from being counted twice.
      if (!document.hidden) {
        report('window_blur')
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Enough on its own in every current browser; the deprecated
      // `returnValue` assignment is deliberately left out.
      event.preventDefault()
    }

    const preventEvent = (event: Event) => {
      event.preventDefault()
    }

    const handleSelectStart = (event: Event) => {
      if (!isEditableTarget(event.target)) {
        event.preventDefault()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isBlockedKeyCombination(event)) {
        event.preventDefault()
      }
    }

    // A reload always drops fullscreen, so an active attempt that resumes
    // outside fullscreen is treated as leaving the exam.
    if (!isFullscreen()) {
      report('reload')
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('contextmenu', preventEvent)
    document.addEventListener('copy', preventEvent)
    document.addEventListener('cut', preventEvent)
    document.addEventListener('paste', preventEvent)
    document.addEventListener('dragstart', preventEvent)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('contextmenu', preventEvent)
      document.removeEventListener('copy', preventEvent)
      document.removeEventListener('cut', preventEvent)
      document.removeEventListener('paste', preventEvent)
      document.removeEventListener('dragstart', preventEvent)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive, logViolation])

  return { isWarningOpen, closeWarning }
}
