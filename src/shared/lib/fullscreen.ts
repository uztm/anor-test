/**
 * Requests fullscreen on the document root.
 *
 * Must be called synchronously from a user gesture handler — browsers reject
 * the request otherwise. Never awaits anything before the actual call.
 */
export const requestFullscreen = (): Promise<void> => {
  const element = document.documentElement

  if (typeof element.requestFullscreen !== 'function') {
    return Promise.reject(
      new Error('The Fullscreen API is not available in this browser'),
    )
  }

  return element.requestFullscreen()
}

export const exitFullscreen = async (): Promise<void> => {
  if (
    document.fullscreenElement &&
    typeof document.exitFullscreen === 'function'
  ) {
    await document.exitFullscreen()
  }
}

export const isFullscreen = (): boolean => document.fullscreenElement !== null
