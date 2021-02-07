<template>
  <div :class="wrpCls">
    <notice-icon></notice-icon>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!-- <select-lang :class="prefixCls" /> -->
  </div>
</template>

<script>
import NoticeIcon from '../NoticeIcon'
import AvatarDropdown from './AvatarDropdown'
// import SelectLang from '@/components/SelectLang'
import { mapGetters } from 'vuex'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    NoticeIcon
    // SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    },
    ...mapGetters(['userInfo'])
  },
  mounted () {
    // setTimeout(() => {
    //   this.currentUser = {
    //     name: 'Serati Ma'
    //   }
    // }, 1500)
    this.currentUser = this.userInfo
  }
}
</script>
