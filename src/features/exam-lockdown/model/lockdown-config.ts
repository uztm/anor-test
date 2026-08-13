/**
 * Window in which a `blur` following a `visibilitychange` is treated as the
 * same incident, so one alt-tab is logged once instead of twice.
 */
export const VIOLATION_DEBOUNCE_MS = 700

/** Ctrl/Cmd combinations blocked on the exam screen. Best-effort only. */
export const BLOCKED_KEYS = ['c', 'v', 'x', 'p', 's', 'u'] as const

/** Function keys blocked on the exam screen. */
export const BLOCKED_FUNCTION_KEYS = ['F12'] as const

/** Devtools shortcuts of the form Ctrl/Cmd + Shift + <key>. */
export const BLOCKED_DEVTOOLS_KEYS = ['i', 'j', 'c'] as const

/** Tags whose native text selection and context menu must keep working. */
export const EDITABLE_TAGS = ['INPUT', 'TEXTAREA'] as const
