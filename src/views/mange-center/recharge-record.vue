<!--
 * @Description: 管理中心/充值记录页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-29 09:49:37
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="mange-center1">
    <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
    </Search>
    <Table :tableData="changeDataList" :tableItem="tableItem" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
    <el-button class="goback1" type="primary" @click="$router.go(-1)">返回</el-button>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { rechargeRecord } from "../../api/mangeCenter.js";
import { type } from "os";
export default {
  mixins: [mixinTable],
  data() {
    return {
      exportPartUrl: "/list/export/rechargeRecord" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "rechargeType", label: "充值方式", type: "formatter" },
      { prop: "amount", label: "充值金额" },
      { prop: "balance", label: "余额" },
      { prop: "needNote", label: "是否需要发票", type: "formatter" },
      { prop: "remark", label: "备注", type: "tooltip", width: "120" },
      { prop: "evidence", label: "付款凭据", type: "img" },
      { prop: "createTime", label: "申请时间" },
      { prop: "orderStatus", label: "状态", type: "formatter" },
      { prop: "updateTime1", label: "充值时间" }
    ];
    this.searchItem = [
      {
        type: "select",
        label: "充值方式",
        prop: "rechargeType",
        placeholder: "请选择充值方式",
        selectList: [
          { label: "申请充值", value: "0" },
          { label: "上级手动充值", value: "1" }
        ]
      },
      {
        type: "select",
        label: "状态",
        prop: "orderStatus",
        placeholder: "请选择状态",
        selectList: [
          { label: "待审核", value: "0" },
          { label: "已通过", value: "1" },
          { label: "已拒绝", value: "2" }
        ]
      },
      {
        type: "daterange",
        label: "充值时间",
        prop: ["beginDate", "endDate"]
      }
    ];
    this.exportUrl = "/list/export/rechargeRecord";
  },

  computed: {
    changeDataList() {
      this.tableData.forEach(item => {
        item.updateTime1 = item.updateTime !== null ? item.updateTime : "-";
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 16:55:39
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, filename: "充值记录", type: 1 };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:55:39
     */
    getDataList() {
      let params = {
        recordType: 0,
        filename: "充值记录",
        type: 1
      };
      Object.assign(this.searchData, params, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      rechargeRecord(this.searchData).then(res => {
        if (res.code == 200) {
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
<style lang="less">
.mange-center1 {
  .goback1 {
    position: fixed;
    top: 79px;
    width: 80px;
    right: 20px;
    border-radius: 4px;
  }
  .search .search_btn {
    margin-left: 66px;
  }
}
</style>