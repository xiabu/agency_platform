<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-26 09:01:25
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-10-30 20:22:57
 -->

<template>
  <div class="form-wap-new">
    <Search :searchData="searchData" :searchItem="searchItem" @getDataList="getDataList" :pageParams="pageParams">
    </Search>
    <Table :tableData="changeData" :tableItem="tableItem" @handleLookView="handleLookView" @getSelecData="getSelecData"
      @getDataList="getDataList" @exportExcel="exportExcel" :exportUrl="exportUrl" :tableBtnItem="tableBtnItem"
      :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { apiGetListByAdmin } from "../../api/mangeCenter.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      exportPartUrl: "/list/export/adminOrderList" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "buyerInfo1", label: "购买人信息", type: "Mtext" },
      { prop: "productInfo1", label: "商品信息", type: "Mtext" },
      { prop: "amount", label: "总价", type: "money" },
      { prop: "paymentAmount1", label: "扣款信息", type: "Mtext" },
      { prop: "isNeedNote1", label: "是否需要发票" },
      { prop: "orderStatus1", label: "状态", type: "Mtext" },
      { prop: "proxyInfo1", label: "提交代理商", type: "MtextBlue" },
      { prop: "employeeName", label: "关联员工" },
      { prop: "createTime1", label: "提交时间", width: "100" },
      { label: "操作", type: "btn", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "查看", type: "text", fnName: "handleLookView" }
    ];
    this.searchItem = [
      {
        type: "input",
        label: "购买人",
        width: "96px",
        prop: "username",
        placeholder: "用户名/手机号/企业名称"
      },
      {
        type: "input",
        label: "提交代理商",
        width: "96px",
        prop: "proxyUserName",
        placeholder: "用户名/手机号/企业名称"
      },
      {
        type: "select",
        label: "状态",
        option_width: "96px",
        prop: "orderState",
        placeholder: "请选择状态",
        selectList: [
          { label: "待审核", value: 0 },
          { label: "已通过", value: 1 },
          { label: "已拒绝", value: 2 }
        ]
      },
      {
        type: "select",
        label: "是否需要发票",
        prop: "needNote",
        placeholder: "请选择",
        selectList: [{ label: "是", value: 1 }, { label: "否", value: 0 }]
      }
    ];
    this.exportUrl = "/list/export/adminOrderList";
  },
  watch: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当输入框发生变化时，添加属性值phone，companyName,proxyPhone
     * @Date: 2019-09-24 16:55:01
     */
    searchData: {
      handler(newData) {
        this.searchData.phone =
          this.searchData.username !== undefined
            ? this.searchData.username
            : "";
        this.searchData.companyName =
          this.searchData.username !== undefined
            ? this.searchData.username
            : "";
        this.searchData.proxyCompanyName =
          this.searchData.proxyUserName !== undefined
            ? this.searchData.proxyUserName
            : "";
        this.searchData.proxyPhone =
          this.searchData.proxyUserName !== undefined
            ? this.searchData.proxyUserName
            : "";
      },
      deep: true
    }
  },
  computed: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 修改列表数据，将状态值转换为需要的中文
     * @Date: 2019-09-24 16:55:01
     */
    changeData() {
      this.tableData.forEach((item, index) => {
        item.buyerInfo1 = item.buyerInfo.split("\n");
        item.productInfo1 = item.productInfo.split("\n");
        item.proxyInfo1 = item.proxyInfo.split("\n");
        item.isNeedNote1 = item.isNeedNote === 0 ? "否" : "是";
        item.createTime1 = item.createTime === null ? "-" : item.createTime;
        if (item.orderStatus === 0) {
          item.paymentAmount1 = [
            "预扣除",
            "￥" + Number(item.paymentAmount / 100).toFixed(2)
          ];
        } else if (item.orderStatus === 1) {
          item.paymentAmount1 = [
            "扣除 ",
            "￥" + Number(item.paymentAmount / 100).toFixed(2)
          ];
        } else {
          item.paymentAmount1 = ["扣除", "￥ 0"];
        }
        let order = item.orderStatus;
        item.orderStatus1 =
          order === 0
            ? [["blue", "待审核"]]
            : order === 2
            ? ["已拒绝"]
            : item.activeAccount === 1
            ? ["已通过", ["redTxt", "（账号未开通）"]]
            : ["已通过", ["green", "（账号已开通）"]];
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 16:54:39
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, orderType: 0, filename: "新购单列表" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 查看详情
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:55:01
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
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:52:39
     */
    getDataList() {
      let parmse = {
        orderType: 0,
        filename: "新购单列表"
      };
      Object.assign(this.searchData, parmse, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      apiGetListByAdmin(this.searchData).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="less">
.form-wap-new {
  .search .search_btn {
    margin-left: 96px;
  }
}
</style>