import { RouteLocationNormalizedLoaded } from 'vue-router'
import { UnwrapRef } from 'vue'

export function isInAppRoute(
  route: RouteLocationNormalizedLoaded | UnwrapRef<RouteLocationNormalizedLoaded>
): boolean {
  const appLayoutRoute = route.matched.find(matchedRoutes => matchedRoutes.path === '/app')
  return !!appLayoutRoute
}

export function deepPathCheck(
  route: RouteLocationNormalizedLoaded | UnwrapRef<RouteLocationNormalizedLoaded>,
  path: string
): boolean {
  return route.path.startsWith(path)
}
