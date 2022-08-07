import * as API from './ApiRoutes'
import * as ROUTER_PATH from './RouterPath'

export const API_ROUTES = {
  ...API.UserAPI
}

export const ROUTES = {
  ...ROUTER_PATH.PUBLIC_ROUTES,
  ...ROUTER_PATH.PRIVATE_ROUTES
}