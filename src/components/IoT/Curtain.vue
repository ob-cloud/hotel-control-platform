<template>
  <div class="container">
    <!-- <a-radio-group v-model="power" name="radioGroup" @change="handleChange">
      <a-radio :value="2">
        <i class="obicon obicon-power"></i>
      </a-radio>
      <a-radio :value="0">
        <a-icon type="border" style="font-size: 16px;" />
      </a-radio>
      <a-radio :value="1">
        <a-icon type="pause" />
      </a-radio>
    </a-radio-group> -->
    <template v-for="(item, index) in group">
      <a-radio-group v-model="powers[index]" :name="`radioGroup${index}`" :key="index" @change="handleChange(index)">
        <a-radio :value="2">
          <i class="obicon obicon-power"></i>
          <label>开</label>
        </a-radio>
        <a-radio :value="0">
          <a-icon type="border" style="font-size: 16px;" />
          <label>关</label>
        </a-radio>
        <a-radio :value="1">
          <a-icon type="pause" />
          <label>停</label>
        </a-radio>
      </a-radio-group>
    </template>
  </div>
</template>

<script>
const PowerEnum = {
  ON: 2,
  OFF: 0,
  PAUSE: 1
}
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    group: { // 控制组数
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      powers: new Array(this.group).fill(0),
      oldPower: []
    }
  },
  watch: {
    dataSource (val) {
      if (val && val.length) this.powers = this.parsePower(val)
    },
    powers (newVal, oldVal) {
      this.oldPower = oldVal && oldVal.length ? [...oldVal] : [...newVal]
      // console.log(newVal, oldVal, this.oldPower)
    }
  },
  methods: {
    handleChange (row) {
      this.$emit('change', this.powers, this.oldPower, this.getIndex(), row)
    },
    // {ON: 0, OFF: 1, PAUSE: 0} => [2]...
    parsePower (status) {
      if (!status || !status.length) return new Array(this.group).fill(0)
      return status.map(item => PowerEnum[Object.keys(item)[0]])
    },
    // 获取索引
    // bits [0, 0, 0, 0, 0, 0] ---> [2, 4]
    // bit: [] --> 开、停、关 === 0, 1, 2 (索引) ===== 2、1、0 （power 值）
    getIndex () {
      const keyIndex = []
      for (let index = 0; index < this.group; index++) {
        const value = this.powers[index]
        // 0    0, 1, 2
        // 1    3, 4, 5
        // 2    6, 7, 8
        const map = {
          [PowerEnum.ON]: index * 3 + 0,
          [PowerEnum.PAUSE]: index * 3 + 1,
          [PowerEnum.OFF]: index * 3 + 2
        }
        keyIndex.push(map[value])
      }
      return keyIndex
    },
    reset (status) {
      this.powers = status
    }
  },
  destroyed () {
    this.powers = new Array(this.group).fill(0)
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 400px;
  margin: 20px auto;
  & /deep/ .ant-radio-group{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    align-content: center;
    background-color: #e7e7e7;

    padding: 20px 10px;
    border-radius: 4px;
  }
  & /deep/ .ant-radio-wrapper {

    width: 120px;
    height: 100px;
    object-fit: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0;

    &  + .ant-radio-wrapper {
      margin-left: 0;
    }
    span{
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
    span.ant-radio {
      display: none;
    }
  }
  & /deep/ .ant-radio-wrapper-checked span{
    color: #dd0b0b;
    background-color: #fff;
    border-color: #d8d815;
  }
}
</style>
