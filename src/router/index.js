import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import { ROUTER_BASE } from '@/config/env.config'
import { initRouteHook } from './hook'

// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: ROUTER_BASE,
  routes: constantRouterMap
})

// Router Controller
initRouteHook(router)

export default router
