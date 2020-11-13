<script>
// import SimpleLogin from './components/SimpleLogin'
import ProLogin from './components/ProLogin'
// import MultipleLogin from './components/MultiLogin'
import config from '@/config/defaultSettings'
export default {
  name: 'Login',
  components: { ProLogin },
  beforeCreate () {
  },
  render () {
    return (
      config.pageOption.loginMode === 'simple' ? (<ProLogin />) : (<span></span>)
    )
  }
}
</script>
