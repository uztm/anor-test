import { useEffect, useRef, useState } from 'react'

const TICK_INTERVAL_MS = 1000

/**
 * Counts down to an absolute timestamp, so reloading the page cannot extend
 * the deadline. `onExpire` fires once, as soon as the deadline has passed —
 * including immediately on mount if it passed while the page was closed.
 */
export const useCountdown = (endsAt: number | null, onExpire?: () => void) => {
  const [now, setNow] = useState(() => Date.now())
  const onExpireRef = useRef(onExpire)
  const hasExpiredRef = useRef(false)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    hasExpiredRef.current = false
  }, [endsAt])

  useEffect(() => {
    if (endsAt === null) {
      return
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, TICK_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [endsAt])

  const remainingMs = endsAt === null ? 0 : Math.max(endsAt - now, 0)
  const isExpired = endsAt !== null && remainingMs === 0

  useEffect(() => {
    if (!isExpired || hasExpiredRef.current) {
      return
    }

    hasExpiredRef.current = true
    onExpireRef.current?.()
  }, [isExpired])

  const totalSeconds = Math.floor(remainingMs / 1000)

  return {
    remainingMs,
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    isExpired,
  }
}
