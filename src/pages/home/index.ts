import { lazy } from 'react'

const HomePage = lazy(() =>
  import('./ui/home-page').then((res) => ({ default: res.HomePage })),
)
export { HomePage }
