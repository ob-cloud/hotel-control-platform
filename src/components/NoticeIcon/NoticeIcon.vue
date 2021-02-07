<template>
  <a-popover
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :visible="visible"
    @visibleChange="handleHoverChange"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane :tab="noticeTitle" key="1">
            <a-list>
              <a-list-item v-for="(record, index) in notice" :key="index">
                <div style="margin-left: 5%; width: 76%">
                  <p><a @click="showAnnouncement(record)">标题：{{ record.title }}</a></p>
                  <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.date | dayjs('YYYY-MM-DD HH:mm:ss') }} 上报</p>
                </div>
                <div style="text-align: right">
                  <a-tag @click="showAnnouncement(record)" v-if="record.type === 1" color="orange">离线</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.type === 2" color="red">异常</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.type === 3" color="green">上线</a-tag>
                  <!-- <a-tag @click="showAnnouncement(record)" v-else color="red">其他</a-tag> -->
                  <!-- <a-tag @click="showAnnouncement(record)" v-if="record.type === 'H'" color="red">紧急消息</a-tag> -->
                </div>
              </a-list-item>
              <div style="margin-top: 5px; text-align: center">
                <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
              </div>
            </a-list>
          </a-tab-pane>
          <a-tab-pane :tab="sysMsgTitle" key="2">
            <a-list>
              <a-list-item v-for="(record, index) in sysMsg" :key="index">
                <div style="margin-left: 5%; width: 76%">
                  <p><a @click="showAnnouncement(record)">标题：{{ record.title }}</a></p>
                  <p style="color: rgba(0,0,0,.45); margin-bottom: 0px">{{ record.date | dayjs('YYYY-MM-DD HH:mm:ss') }} 上报</p>
                </div>
                <div style="text-align: right">
                  <a-tag @click="showAnnouncement(record)" color="red">欠费</a-tag>
                  <!-- <a-tag @click="showAnnouncement(record)" v-if="record.type === 'L'" color="blue">一般消息</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.type === 'M'" color="orange">重要消息</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.type === 'H'" color="red">紧急消息</a-tag> -->
                </div>
              </a-list-item>
              <div style="margin-top: 5px; text-align: center">
                <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
              </div>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="noticeTotal" dot>
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
    <show-announcement ref="ShowAnnouncement"></show-announcement>
  </a-popover>
</template>

<script>
import { getAnnouncementListByUser, editAnnouncementStatus, queryAnnouncementDetail } from '@/api/system'
import { WebSocketMixin } from '@/utils/websocket'
import { BroadcastMixin } from '@/utils/broadcast'
import ShowAnnouncement from '@/components/tools/ShowAnnouncement'
export default {
  name: 'HeaderNotice',
  mixins: [ WebSocketMixin, BroadcastMixin ],
  components: { ShowAnnouncement },
  data () {
    return {
      loading: false,
      visible: false,
      notice: [],
      noticeCount: '0',
      noticeTitle: '设备离线',
      sysMsg: [],
      sysMsgCount: '0',
      sysMsgTitle: '酒店欠费'
    }
  },
  computed: {
    noticeTotal () {
      return +this.noticeCount + +this.sysMsgCount
    }
  },
  mounted () {
    this.initWebSocket(this.$store.getters.userInfo.id)
    this.websocket.onmessage = this.onWebSocketMessage
    this.loadData()
  },
  methods: {
    loadData () {
      getAnnouncementListByUser().then(res => {
        if (this.$isAjaxSuccess(res.code)) {
          this.notice = this.filterList(res.result.deviceList)
          this.noticeCount = res.result.deviceCount || 0
          this.noticeTitle = `设备(${this.noticeCount})`
          this.sysMsg = this.filterList(res.result.arrearsList)
          this.sysMsgCount = res.result.arrearsCount || 0
          this.sysMsgTitle = `欠费(${this.sysMsgCount})`
        }
      }).catch(err => {
        console.log(err)
      })
    },
    filterList (list, count = 5) {
      if (!list) return []
      const sortList = list.sort((l1, l2) => {
        if (l1.date > l2.date) return -1
        return 1
      })
      return sortList.slice(0, count)
    },
    fetchNotice () {
      if (this.loading) {
        this.loading = false
        return
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    toMyAnnouncement () {
      this.$router.push({
        path: '/isystem/annountcement',
        name: 'isystem-annountcement'
      })
      this.visible = false
    },
    handleHoverChange (visible) {
      this.visible = visible
    },
    onWebSocketMessage (e) {
      console.log('socket message ', e)
      // eslint-disable-next-line no-eval
      const data = eval(`(${e.data})`)
      if (data.cmd !== 'heartcheck') {
        this.loadData()
        // this.handleNotification(data)
      }
      // 心跳重置检测
      // this.startHeartBeat()

      console.log('socket message ', data)
      // 广播 websocket 事件
      this.broadcast(data)
    },
    handleNotification (data) {
      const text = data.msgTxt
      const key = `open${Date.now()}`
      this.$notification.open({
        message: '消息提醒',
        placement: 'bottomRight',
        description: text,
        key,
        btn: (h) => {
          return h('a-button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => this.showDetail(key, data)
            }
          }, '查看详情')
        }
      })
    },
    showDetail (key, data) {
      this.$notification.close(key)
      const id = data.msgId
      queryAnnouncementDetail({ id }).then(res => {
        this.$isAjaxSuccess(res.code) && this.showAnnouncement(res.result)
      })
    },
    showAnnouncement (record) {
      editAnnouncementStatus({ anntId: record.id }).then(res => {
        this.$isAjaxSuccess(res.code) && this.loadData()
      })
      this.visible = false
      this.$refs.ShowAnnouncement.detail(record)
    }
  },
  destroyed () {
    this.closeWebSocket()
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>
