<!--
 * @Description: 管理中心/收支明细页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-15 11:57:12
 * @LastEditors: 郭亮（849324068@qq.com）
 -->
<template>
  <div class="mange-center">
    <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
    </Search>
    <Table :tableData="tableData" :tableItem="tableItem" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
    <el-button class="goback" type="primary" @click="$router.go(-1)">返回</el-button>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { apiGetBillList } from "../../api/mangeCenter";
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
    this.searchItem = [
      {
        type: "select",
        label: "类型",
        prop: "billType",
        placeholder: "请选择类型",
        selectList: [
          { label: "支出", value: "0" },
          { label: "收入", value: "1" }
        ]
      }
    ];
    this.exportUrl = "/list/export/billList";
  },
  mounted() {},
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 16:53:39
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, filename: "收支明细" };
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 获取收支明细列表数据
     * @param {type}
     * @return:
     * @Date: 2019-09-30 14:48:49
     */
    getDataList() {
      let data = {
        filename: "收支明细"
      };
      Object.assign(this.searchData, data, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      apiGetBillList(this.searchData).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
          this.pageParams.currentPage = res.data.pageNum;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.mange-center {
  .goback {
    position: fixed;
    top: 79px;
    width: 80px;
    right: 20px;
    border-radius: 4px;
  }
}
</style>