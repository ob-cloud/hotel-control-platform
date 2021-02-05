<template>
  <div class="container">
    <a-checkbox-group v-model="powers">
      <template v-for="(item, index) in keyTotalCount" :value="index">
        <a-checkbox :class="{snap: [2, 4].includes(primaryCount)}" v-if="countList[0] >= index + 1" :value="index" :key="index" @change="(e) => handleChange(e, {index, extra: 0})">
          <slot name="icon">
            <i class="obicon obicon-power" :title="getKeyTips()"></i>
            <label v-if="tips">{{ getKeyTips() }}</label>
          </slot>
        </a-checkbox>
        <a-checkbox v-else :class="{snap: [2, 4].includes(primaryCount)}" :value="index" :key="index" @change="(e) => handleChange(e, {index, extra: 1})">
          <slot name="icon"><i class="obicon obicon-power" :title="getKeyTips(1)"></i><label v-if="tips">{{ getKeyTips(1) }}</label></slot>
        </a-checkbox>
      </template>
      <!-- <a-checkbox v-for="(item, index) in keyTotalCount" :value="index" :key="index" @change="(e) => handleChange(e, {index})">
        <i class="obicon obicon-power"></i>
      </a-checkbox> -->
    </a-checkbox-group>
  </div>
</template>

<script>
const KeyTypeEnum = {
  SWITCH: 'switch',
  SCENE: 'scene',
  LINE: 'line',
  SOCKET: 'socket',
  RADAR: 'radar',
  INFRARED: 'infrared'
}
const KeyTypeDescriptor = {
  [KeyTypeEnum.SWITCH]: '触摸开关',
  [KeyTypeEnum.SCENE]: '情景开关',
  [KeyTypeEnum.LINE]: '单线开关',
  [KeyTypeEnum.SOCKET]: '插座开关',
  [KeyTypeEnum.RADAR]: '雷达开关'
}
export default {
  props: {
    keyTypes: { // 按键类型
      type: Object,
      default: () => {}
    },
    count: { // 按键数
      type: [Number, Array],
      default: 6
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    tips: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      powers: []
    }
  },
  computed: {
    status () {
      return this.dataSource && this.dataSource.length ? this.dataSource : new Array(this.count).fill(0)
    },
    primaryCount () {
      if (!this.count) return 0
      if (typeof this.count === 'number') return this.count
      return this.count[0]
    },
    keyTotalCount () {
      if (!this.count) return 0
      if (typeof this.count === 'number') return this.count
      else if (this.count.length) return this.count.reduce((a, b) => +a + (+b))
      else return 0
    },
    countList () {
      if (typeof this.count === 'number') return [this.count]
      return this.count
    },
    validTypes () { // eg: ['switch', 'scene']
      if (!this.keyTypes) return []
      return Object.keys(this.keyTypes).filter(k => this.keyTypes[k])
    }
  },
  mounted () {
  },
  watch: {
    dataSource (val) {
      console.log(val)
      this.initPowers(val)
    }
  },
  methods: {
    initPowers (val) { // [0, 1, 0] => [1], [1, 1, 0] => [0, 1], [0, 1, 1] => [1, 2]
      if (!val) return
      let curValue = val
      if (val.length > this.keyTotalCount) {
        curValue = val.slice(0, this.count)
      }
      const powers = []
      curValue.forEach((item, index) => {
        if (item) powers.push(index)
      })
      // if (powers.length) this.powers = powers
      // console.log('value +++ === ', val, this.powers)
      this.powers = powers.length ? powers : []
    },
    getKeyTips (extra) { // 获取按键提示
      let validKeyTypes = [...this.validTypes]
      if (!validKeyTypes || !validKeyTypes.length) return ''
      if (validKeyTypes.length === 1) return KeyTypeDescriptor[validKeyTypes[0]]
      if (validKeyTypes.length === 3) { // TODO 红外面板，截取前两位
        validKeyTypes = validKeyTypes.includes(KeyTypeEnum.INFRARED) ? validKeyTypes.slice(0, validKeyTypes.indexOf(KeyTypeEnum.INFRARED)) : validKeyTypes
      }
      if (validKeyTypes.length === 2) { // ["switch", "scene"] ["switch", "infrared"] ["scene", "infrared"] ["switch", "scene", "infrared"]...
        // 情景混合开关
        const sceneIndex = validKeyTypes.indexOf(KeyTypeEnum.SCENE)
        if (sceneIndex !== -1) {
          const unSceneIndex = 1 - sceneIndex
          return !extra ? KeyTypeDescriptor[KeyTypeEnum.SCENE] : KeyTypeDescriptor[validKeyTypes[unSceneIndex]]
        }
        return ''
      }
    },
    __resetStatus (status) {
      status.forEach((item, index) => this.$set(this.status, index, +item))
    },
    resetScene (status) {
      const sceneStatus = status.filter((item, index) => index < this.primaryCount)
      const set = sceneStatus.concat(this.status.slice(sceneStatus.length))
      console.log('status _=_+_+_+ ', status, sceneStatus, this.status, set)
      // this.initPowers(set)
      this.__resetStatus(set)
    },
    reset (status) {
      // this.initPowers(status)
      this.__resetStatus(status)
    },
    handleChange (e, record) {
      const item = e.target.checked
      const index = record.index
      const oldStatus = [...this.status]
      this.$set(this.status, index, +item)
      this.$emit('change', this.status, oldStatus, record)
    }
  },
  destroyed () {
    this.powers = []
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 400px;
  margin: 20px auto;

  .key-tips {
    text-align: center;
    height: 26px;
    font-size: 16px;
    color: #333;
    transition: all .3s;
    // border: 1px solid #e7e7e7;
    width: 30%;
    margin: 4px auto;
    border-radius: 10px;
    // background: #e7e7e7;
  }

  & /deep/ .ant-checkbox-group{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    align-content: center;
    background-color: #e7e7e7;

    padding: 20px 10px;
    border-radius: 4px;
  }
  & /deep/ .ant-checkbox-wrapper {

    &.snap {
      width: 140px;
    }
    &.normal {
      width: 120px;
    }
    width: 120px;
    height: 100px;
    object-fit: contain;
    display: flex;
    justify-content: center;
    align-items: center;

    &  + .ant-checkbox-wrapper {
      margin-left: 0;
    }
    span{
      // display: inline-block;
      position: relative;
      transition: all .3s;

      border: 1px solid #cfcbcb;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      vertical-align: middle;
      display: flex;
      align-items: center;
      justify-content: center;

      padding: 4px;
      background-color: #e7e7e7;
      object-fit: contain;
      // box-shadow: inset 0 5px white, inset 0 -5px #bbb, inset 5px 0 #d7d7d7, inset -5px 0 #d7d7d7;

      > label{
        position: absolute;
        bottom: -30px;
        font-size: 12px;
        // color: #000;
        color: #787878;
      }

      > i{
        font-size: 30px;
      }
    }
    span.ant-checkbox {
      display: none;
    }
  }
  & /deep/ .ant-checkbox-wrapper-checked span{
    color: #dd0b0b;
    background-color: #fff;
    border-color: #d8d815;
    // box-shadow: inset 0 5px white, inset 0 -3px #fbfb1c, inset 1px 0 #fbfb1c, inset -1px 0 #fbfb1c;
  }
}
</style>
