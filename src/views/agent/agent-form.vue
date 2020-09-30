<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-22 14:17:10
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="agent-form">
    <div>
      <Search :searchData="searchData" :searchItem="searchItem" @getDataList="getDataList" :pageParams="pageParams">
      </Search>
    </div>
    <Table :tableData="changeData" :tableItem="tableItem" :tableBtnItem="tableBtnItem" @getSelecData="getSelecData"
      @getDataList="getDataList" @exportExcel="exportExcel" :exportUrl="exportUrl" @handleLookView="handleLookView"
      :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { apiGetOrderList } from "../../api/mangeCenter.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      exportPartUrl: "/list/export/orderList" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "buyerInfo", label: "购买人信息" },
      { prop: "productInfo", label: "商品信息" },
      { prop: "amount", label: "总价", type: "money" },
      { prop: "paymentAmount1", label: "扣款信息", type: "Mtext" },
      { prop: "orderType1", label: "类型" },
      { prop: "isNeedNote1", label: "是否需要发票" },
      { prop: "orderStatus1", label: "状态", type: "Mtext" },
      { prop: "employeeName", label: "关联员工" },
      { prop: "createTime", label: "提交时间" },
      { label: "操作", type: "btn", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "查看", type: "text", fnName: "handleLookView" }
    ];
    this.searchItem = [
      {
        type: "select",
        label: "类型",
        prop: "orderType",
        placeholder: "请选择类型",
        selectList: [
          { label: "新购单", value: "0" },
          { label: "续费单", value: "1" }
        ]
      }
    ];
    this.exportUrl = "/list/export/orderList";
  },
  computed: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 修改列表数据，将状态值转换为需要的中文
     * @Date: 2019-09-24 16:55:01
     */
    changeData() {
      this.tableData.forEach(item => {
        if (item.orderStatus === 0) {
          item.orderStatus1 = [["blue", "待审核"]];
          item.btnShow = [true, true, false, true];
        } else if (item.orderStatus === 1) {
          if (item.activeAccount === 2) {
            item.btnShow = [false, false, true, true];
            item.orderStatus1 = ["已通过", ["green", "（账号已开通）"]];
          } else {
            item.orderStatus1 = ["已通过", ["redTxt", "（账号未开通）"]];
            item.btnShow = [false, false, false, true];
          }
        } else {
          item.orderStatus1 = ["已拒绝"];
          item.btnShow = [false, false, false, true];
        }
        item.orderType1 = item.orderType === 0 ? "新购单" : "续费单";
        item.isNeedNote1 = item.isNeedNote === 0 ? "否" : "是";
        item.updateTime = item.updateTime === null ? "-" : item.updateTime;
        if (item.orderStatus === 0) {
          item.paymentAmount1 = [
            "预扣除",
            "￥ " + Number(item.paymentAmount / 100).toFixed(2)
          ];
        } else if (item.orderStatus === 1) {
          item.paymentAmount1 = [
            "扣除",
            "￥ " + Number(item.paymentAmount / 100).toFixed(2)
          ];
        } else {
          item.paymentAmount1 = ["扣除", "￥ 0.00"];
        }
      });
      return this.tableData;
    }
  },
  watch: {
    $route(to, from) {
      this.getDataList();
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 查看按钮
     * @param { Object } row [当前查看列表数据]
     * @Date: 2019-09-24 15:53:39
     */
    handleLookView(row) {
      this.$router.push({
        path: "/form/detail",
        name: "formDetail",
        params: { id: row.id }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 15:53:39
     */
    getSelecData(val) {
      this.checkArr = {
        orderList: val,
        formType: 0,
        filename: "表单信息",
        typeFlag: 0
      };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let parmse = {
        proxyId: sessionStorage.getItem("proxyId"),
        filename: "表单信息",
        typeFlag: 0,
        formType: 0
      };
      Object.assign(this.searchData, parmse, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      apiGetOrderList(this.searchData).then(res => {
        if (res.code === 200) {
          this.pageParams.total = res.data.total;
          this.tableData = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="less">
.agent-form .el-table .cell {
  white-space: pre-line;
}
</style>
<style lang="less" scoped>
.agent-form {
  .search_btn {
    margin-left: 40px;
  }
}
</style>
