<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-24 13:48:26
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="agentDevelop">
    <div>
      <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
      </Search>
    </div>
    <Table :tableData="tableData" :tableItem="tableItem" @getDataList="getDataList" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { manageProxies } from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  data() {
    return {};
  },
  created() {
    this.tableItem = [
      { prop: "proxyUserName", label: "客户名称" },
      { prop: "mobilePhone", label: "手机号" },
      { prop: "proxyCompanyName", label: "企业名称" },
      { prop: "cityName", label: "区域" },
      { prop: "createTime", label: "创建时间" }
    ];
    this.searchItem = [
      {
        label: "客户名称",
        prop: "proxyUserName",
        placeholder: "请输入客户名称"
      },
      { label: "手机号", prop: "mobilePhone", placeholder: "请输入手机号" },
      {
        label: "企业名称",
        prop: "proxyCompanyName",
        placeholder: "请输入企业名称"
      }
    ];
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let parmse = { empId: JSON.parse(localStorage.getItem("token")).empId };
      Object.assign(parmse, this.searchData, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", parmse);
      manageProxies(parmse).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
<style lang="less">
.agentDevelop {
  .search .search_btn {
    margin-left: 68px;
  }
}
</style>