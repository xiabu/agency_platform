<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-21 09:33:14
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="agent-sub">
    <div>
      <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
      </Search>
    </div>
    <Table :tableData="tableData" :tableItem="tableItem" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { manageProxies } from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      exportPartUrl: "/list/proxyCompany/exportSelectedProxies",
      proxyId: JSON.parse(sessionStorage.proxyId) //代理id // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "proxyUserName", label: "用户名" },
      { prop: "mobilePhone", label: "手机号" },
      { prop: "proxyCompanyName", label: "企业名称" },
      { prop: "cityName", label: "区域" },
      { prop: "rechargeAmount", label: "充值金额", type: "money" },
      { prop: "balance", label: "账户余额", type: "money" },
      { prop: "discount", label: "拿货折扣比例" },
      { prop: "employeeName", label: "关联员工" },
      { prop: "createTime", label: "创建时间" }
    ];
    this.searchItem = [
      { label: "用户名", prop: "proxyUserName", placeholder: "请输入用户名", width:"68px", },
      { label: "手机号", prop: "mobilePhone", placeholder: "请输入手机号", width:"68px", },
      {
        label: "企业名称",
        prop: "proxyCompanyName",
        placeholder: "请输入企业名称"
      }
    ];
    this.exportUrl = "/list/proxyCompany/exportAllProxies";
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 15:53:39
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, filename: "下级代理商" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let params = {
        proxyId: sessionStorage.getItem("proxyId"),
        filename: "下级代理商",
        proxyId: this.proxyId
      };
      Object.assign(params, this.searchData, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", params);
      manageProxies(params).then(res => {
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
.agent-sub {
  .search .search_btn {
    margin-left: 68px;
  }
}
</style>