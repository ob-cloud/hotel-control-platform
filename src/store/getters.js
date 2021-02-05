import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'

const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => { state.user.avatar = storage.get(USER_INFO).avatar; return state.user.avatar },
  username: state => { state.user.realname = storage.get(USER_INFO).realname; return state.user.realname },
  nickname: state => state.user.username,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  permissionList: state => state.user.permissionList,
  userInfo: state => { state.user.info = storage.get(USER_INFO); return state.user.info },
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab
}

export default getters
