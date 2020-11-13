import { postAction } from '@/utils/ajax'

// 授权登录模块
const login = (params) => postAction('/auth/login', params)
const logout = (token) => postAction('/auth/logout', {}, { headers: { 'X-Access-Token': token } })

export {
  login,
  logout
}
