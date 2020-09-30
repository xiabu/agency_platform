<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-14 14:44:38
 * @LastEditors: 郭亮（849324068@qq.com）
 -->
<template>
  <div class="agentData">
    <Table :tableData="tableData" :tableItem="tableItem" @getDataList="getDataList" @getSelecData="getSelecData"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { apiGetBillList } from "../../api/mangeCenter.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      exportPartUrl: "/list/export/billList" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "createTime", label: "时间" },
      { prop: "billDetail", label: "详情", type: "formatter" },
      { prop: "billType", label: "类型", type: "formatter" },
      { prop: "amount", label: "金额", type: "formatter" },
      { prop: "balance", label: "余额", type: "formatter" }
    ];
    this.exportUrl = "/list/export/billList";
  },
  mounted() {},
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 15:53:39
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, filename: "收支明细" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let params = {
        proxyId: sessionStorage.getItem("proxyId"),
        filename: "收支明细"
      };
      Object.assign(params, this.searchData, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", params);
      apiGetBillList(params).then(res => {
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