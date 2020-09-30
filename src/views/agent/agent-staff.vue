<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-18 15:43:46
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="agentData">
    <Table :tableData="tableData" :tableItem="tableItem" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { getEmployeeList } from "../../api/employee.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      proxyId: JSON.parse(sessionStorage.proxyId), //代理id
      currentPage: 1, //当前页面
      pageNum: 1, //当前页
      exportPartUrl: "/list/export/exportEmployeeExcel" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "empName", label: "员工姓名" },
      { prop: "mobilePhone", label: "手机号" },
      { prop: "transactionAmount", label: "成交金额", type: "money" },
      { prop: "createTime", label: "添加时间" }
    ];
    this.exportUrl = "/list/export/exportEmployeeExcel";
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 15:53:39
     */
    getSelecData(val) {
      this.checkArr = { employeeList: val, filename:"员工" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let data = {
        proxyId: this.proxyId,
        filename:"员工"
      };
      Object.assign(data, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", data);
      getEmployeeList(data).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
        }
      });
    }
  }
};
</script>