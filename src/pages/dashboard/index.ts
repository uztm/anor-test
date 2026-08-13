import { lazy } from 'react'

const DashboardPage = lazy(() =>
  import('./ui/dashboard-page').then((res) => ({ default: res.DashboardPage })),
)
export { DashboardPage }
