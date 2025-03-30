import AppContent from '@renderer/pages'
import { createMemoryRouter, RouteObject } from 'react-router-dom'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppContent />
  }
]

const router = createMemoryRouter(routes)
export default router
