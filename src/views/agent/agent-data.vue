<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-18 11:40:52
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="agentData">
    <div class="tab">
      <tab :tabItem="tabList" :currentTab="currentTab" @tabActiveIndex="tabActiveIndex"></tab>
    </div>
    <div :is="currentView"></div>
  </div>
</template>
<script>
import tab from "../../components/tab";
import agentList from "./agent-list";
import agentNici from "./agent-nici";
export default {
  components: {
    tab,
    agentList,
    agentNici
  },
  data() {
    return {
      currentTab: 0,
      tabList: [
        // tab列表数据
        { name: "数据总览", child: "agentNici" },
        { name: "代理商数据", child: "agentList" }
      ],
      currentView: "agentNici" // 当前组件名称
    };
  },
  created() {
    if (this.$route.query.proxyId) {
      this.proxyId = this.$route.query.proxyId;
      this.currentTab = 1;
      this.currentView = "agentList";
    }
  },
  mounted() {},
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 切换tab更改当前选中index
     * @param { Number } index [tab切换当前index]
     * @Date: 2019-09-24 15:53:39
     */
    tabActiveIndex(index) {
      this.currentView = this.tabList[index].child;
      this.active = index;
    }
  }
};
</script>
<style lang="less" scoped>
.agentData {
  .tab {
    height: 46px;
    line-height: 46px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>