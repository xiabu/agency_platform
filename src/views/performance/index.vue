<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-15 11:05:15
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-09-23 15:24:35
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="agentData">
    <div class="agent-detail">
      <performance-detail :isShowNav="false" :isShowAchievements="true" :isShowProxy="true" :isShowBtn="false"
        :isShowAmount="true"></performance-detail>
    </div>
    <div class="tab">
      <tab :tabItem="tabList" @tabActiveIndex="tabActiveIndex"></tab>
    </div>
    <div :is="currentView"></div>
  </div>
</template>
<script>
import tab from "../../components/tab";
import performanceDetail from "../../components/performanceDetail";
import { getZixunList } from "../../api/agent.js";
import develop from "./develop";
import client from "./client";
export default {
  components: {
    tab,
    performanceDetail,
    client,
    develop
  },
  data() {
    return {
      active: 0, // 当前选中tab的index
      tabList: [
        // tab列表
        { name: "客户系统", child: "client" },
        { name: "发展代理商", child: "develop" }
      ],
      currentView: "client" // 当前组件名称
    };
  },
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
  .agent-detail {
    width: calc(100% + 40px);
    background: #f7f8fa;
    padding-bottom: 10px;
    margin-left: -20px;
    margin-top: -20px;
  }
  .capital-info {
    .left {
      border-right: 1px solid #ddd;
    }
  }
  .tab {
    height: 46px;
    line-height: 46px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>