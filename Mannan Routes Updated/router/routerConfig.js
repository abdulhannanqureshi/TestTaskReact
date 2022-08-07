import { ROUTES } from 'utils/common/constant/constant'
import { PrivateLayout, PublicLayout } from './routerLayout'

import Login from 'pages/Login'
import Dashboard from 'pages/Dashboard'

export const publicRoutes = [
  {
    key: 'login',
    path: ROUTES.LOGIN_PATH,
    component: Login,
    layout: PublicLayout
  }
]

export const privateRoutes = [
  {
    key: 'Dashboard',
    path: ROUTES.DASHBOARD_PATH,
    component: Dashboard,
    exact: true,
    layout: PrivateLayout
  },
]