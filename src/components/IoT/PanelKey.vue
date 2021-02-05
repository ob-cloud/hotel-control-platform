<template>
  <div class="container">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="content">
      <div class="keys-wrapper" :style="`${typeof width === 'number' ? 'width: ' + width + 'px' : 'width: ' + width}`">
        <div class="keys-list">
          <template v-for="(item, index) in list">
            <!-- <div class="keys-item" :class="{extra: orderCount[0] < index + 1}" v-if="!(orderCount[1] && index < orderCount[1])" :key="index" :title="getKeyTips(orderCount[0] < index + 1)"> -->
            <div class="keys-item" :class="{extra: orderCount[0] < index + 1}" :key="index" :title="getKeyTips(orderCount[0] < index + 1)">
              <span class="dot" @click="handleClick(item, index)"></span>
              <div class="label" style="width: 110px;" :style="`${item.editable ? 'transform: translateX(-40%)' : 'transform: translateX(-50%)'}`">
                <div v-if="item.editable">
                  <a-input
                    :value="item.v"
                    size="small"
                    style="width: 60px"
                    @change="e => handleChange(e.target.value, item)"
                  />
                  <a-icon class="icon" type="check" title="确认" @click="handleCheck(item, index, orderCount[0] < index + 1)"></a-icon>
                  <a-icon class="icon" type="delete" title="取消" @click="handleCancel(item, index, orderCount[0] < index + 1)"></a-icon>
                </div>
                <template v-else>
                  {{ item.v }}
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const KeyTypeEnum = {
  SWITCH: 'switch',
  SCENE: 'scene',
  LINE: 'line',
  SOCKET: 'socket',
  RADAR: 'radar',
  CURTAIN: 'curtain',
  INFRARED: 'infrared'
}
const KeyTypeDescriptor = {
  [KeyTypeEnum.SWITCH]: '触摸开关',
  [KeyTypeEnum.SCENE]: '情景开关',
  [KeyTypeEnum.LINE]: '单线开关',
  [KeyTypeEnum.SOCKET]: '插座开关',
  [KeyTypeEnum.RADAR]: '雷达开关',
  [KeyTypeEnum.CURTAIN]: '窗帘开关',
  [KeyTypeEnum.INFRARED]: '红外开关'
}
export default {
  name: 'KeyPanel',
  props: {
    keyTypes: { // 按键类型
      type: Object,
      default: () => {}
    },
    orderCount: { // 按键数
      type: [Number, Array],
      default: () => []
    },
    serialId: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: 400
    },
    dataSource: { // 初始化数据源
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.initList()
  },
  computed: {
    totalCount () {
      return typeof this.orderCount === 'number' ? this.orderCount : +this.orderCount.reduce((a, b) => +a + (+b))
    },
    setKeyCount () { // 命名按键数量，非情景按键
      if (typeof this.orderCount === 'number') return this.orderCount
      if (this.orderCount.length === 1) return this.orderCount[0]
      // [2, 0]
      if (this.orderCount.length === 2) return this.orderCount[1] || this.orderCount[0]
      return 0
    },
    validTypes () { // eg: ['switch', 'scene']
      return Object.keys(this.keyTypes).filter(k => this.keyTypes[k])
    }
  },
  watch: {
    dataSource (v) {
      if (v && v.length) {
        !this.list.length && this.initList()
        this.list.forEach((item, index) => {
          if (v[index]) {
            this.$set(this.list, v[index].childId - 1, { ...item, id: v[index].childId, pid: v[index].deviceSerialId, v: v[index].name })
          }
        })
      }
    }
  },
  methods: {
    initList () { // 仅保留非情景开关
      // this.totalCount
      for (let index = 0; index < this.setKeyCount; index++) {
        this.list.push({
          pid: this.serialId,
          v: index + 1,
          editable: false
        })
      }
      return this.list
    },
    getKeyTips (extra) { // 获取按键提示
      if (!this.validTypes || !this.validTypes.length) return ''
      if (this.validTypes.length === 1) return KeyTypeDescriptor[this.validTypes[0]]
      if (this.validTypes.length === 2) { // eg: ['switch', 'scene']
        // 情景混合开关
        const sceneIndex = this.validTypes.indexOf(KeyTypeEnum.SCENE)
        if (sceneIndex !== -1) {
          const unSceneIndex = 1 - sceneIndex
          return !extra ? KeyTypeDescriptor[KeyTypeEnum.SCENE] : KeyTypeDescriptor[this.validTypes[unSceneIndex]]
        }
        return ''
      }
    },
    displayEditable (item, bool = false) {
      item.editable = bool
    },
    handleClick (item) {
      item.editable = true
    },
    handleChange (value, item, index) {
      item.v = value
      this.$emit('change', value, item, index + 1)
    },
    handleCheck (item, index, extra) {
      // if (extra) index = index - this.orderCount[1] < 0 ? 0 : index - this.orderCount[1]
      this.$emit('check', item, index + 1, extra)
    },
    handleCancel (item, index, extra) {
      // if (extra) index = index - this.orderCount[1] < 0 ? 0 : index - this.orderCount[1]
      item.editable = false
      this.$emit('cancel', item, index + 1, extra)
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .header {}
  .content {
    padding: 10px;
    text-align: center;

    .keys-wrapper{
      // width: 400px;
      margin: 10px auto;
      background: #e7e7e7;
      overflow: hidden;
      border: 1px solid #e7e7e7;
      border-radius: 10px;

      .keys-list{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        align-content: center;
      }
      .keys-row{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        align-content: center;
      }
      .keys-line{
        padding: 10px 0;
      }
      .keys-item{
        // display: inline-block;
        // position: relative;
        // width: 33%;
        // padding: 24px 0;
        // margin: 0px 0px;
        // // border: 1px solid #eee;
        // width: 33%;
        // border-right: 1px solid #eee;
        // border-bottom: 1px solid #eee;

        display: inline-block;
        position: relative;
        background-color: #e7e7e7;
        width: 130px;
        height: 128px;
        object-fit: contain;
        /* box-shadow: inset 0 5px white, inset 0 -5px #bbb, inset 5px 0 #d7d7d7, inset -5px 0 #d7d7d7; */
        display: flex;
        justify-content: center;
        align-items: center;

        &:nth-child(-n+3) {
          // border-bottom: 1px solid #999;
        }
        // 非主程按键
        &.extra {
          // background-color: #e7e7e7;
          .dot {
            border-color: #999;
          }
        }

        & .dot{
          width: 34px;
          height: 34px;
          border: 2px solid #afacac;
          border-radius: 100%;
          margin: 12px 16px;
          display: inline-block;
          transition: all .3s;
          cursor: pointer;
        }
        & .label{
          color: #A2AAB5;
          position: absolute;
          bottom: 14px;
          // bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          transition: all .3s;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .icon {
            // vertical-align: middle;
            padding: 3px;
            margin: 1px;
            cursor: pointer;
          }
        }
        &.active,
        &:hover{
          & .dot {
            border-color: #0185ED;
          }
        }
      }
    }
  }
}
</style>
