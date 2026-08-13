import { ExamResultPage } from 'pages/exam/result'
import { ExamRunPage } from 'pages/exam/run'
import { ExamWelcomePage } from 'pages/exam/welcome'

import type { RouteObject } from 'react-router-dom'

/**
 * The exam runs outside the authenticated layout: no navbar, no auth loader.
 * Participants are identified by the name they type on the welcome screen.
 */
export const examRoutes: RouteObject = {
  path: '/exam',
  children: [
    { index: true, element: <ExamWelcomePage /> },
    { path: 'run', element: <ExamRunPage /> },
    { path: 'result', element: <ExamResultPage /> },
  ],
}
