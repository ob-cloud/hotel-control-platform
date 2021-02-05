<template>
  <div class="user-wrapper">
    <div class="content-box">
      <notice-icon class="action" />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar v-if="avatar" class="avatar" size="small" :src="avatar" />
          <a-avatar v-else>User</a-avatar>
          <span>{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting" />
              <span>账户设置</span>
            </router-link>
          </a-menu-item> -->
          <a-menu-item key="2" @click="updatePassword">
            <a-icon type="setting" />
            <span>密码修改</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <user-password ref="userPassword"></user-password>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import UserPassword from './UserPassword'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,
    UserPassword
  },
  computed: {
    ...mapGetters(['nickname', 'avatar', 'userInfo'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    updatePassword () {
      const username = this.userInfo.username
      this.$refs.userPassword.show(username)
    },
    // 当前页刷新
    reload () {
      this.$store.dispatch('ToggleMultiTab', false)
      this.$store.dispatch('SetReloadFlag', false)
      this.$nextTick(() => {
        this.$store.dispatch('ToggleMultiTab', true)
      this.$store.dispatch('SetReloadFlag', true)
      })
    }
  }
}
</script>
