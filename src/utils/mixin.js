import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import { mapState } from 'vuex'

const mixin = {
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile,
      layoutMode: state => state.app.layout,
      layout: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixSiderbar: state => state.app.fixSiderbar,
      fixSidebar: state => state.app.fixSiderbar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,
      sideCollapsed: state => state.app.sideCollapsed,
      multiTab: state => state.app.multiTab,
      fixedMultiTab: state => state.app.fixedMultiTab
    }),
    isTopMenu () {
      return this.layout === 'topmenu'
    }
  },
  methods: {
    isSideMenu () {
      return !this.isTopMenu
    }
  }
}
const baseMixin = mixin

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.app.device,
      isMobile: state => state.app.isMobile
    })
  },
  methods: {
    isMobile () {
      return this.isMobile
    },
    isDesktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet () {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

const AppDeviceEnquire = {
  mounted () {
    const { $store } = this
    deviceEnquire(deviceType => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          // $store.commit('TOGGLE_DEVICE', 'desktop')
          $store.dispatch('setSidebar', false)
          break
        case DEVICE_TYPE.TABLET:
          // $store.commit('TOGGLE_DEVICE', 'tablet')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          // $store.commit('TOGGLE_DEVICE', 'mobile')
          $store.dispatch('setSidebar', false)
          break
      }
    })
  }
}

const i18nMixin = {
  computed: {
    ...mapState({
      currentLang: state => state.app.lang
    })
  },
  methods: {
    setLang (lang) {
      this.$store.dispatch('setLang', lang)
    }
  }
}

export { mixin, baseMixin, AppDeviceEnquire, mixinDevice, i18nMixin }
