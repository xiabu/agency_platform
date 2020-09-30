<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-26 09:03:18
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-22 20:45:39
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-11 19:18:30
 -->
<template>
  <div class="form-wap-recharge">
    <Search :searchData="searchData" :searchItem="searchItem" :pageParams="pageParams" @getDataList="getDataList">
    </Search>
    <Table :tableData="changeData" :tableItem="tableItem" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { rechargeRecord } from "../../api/mangeCenter.js";
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
      { prop: "proxyName1", label: "代理商", type: "MtextBlue" },
      { prop: "rechargeType1", label: "充值方式" },
      { prop: "amount", label: "充值金额" },
      { prop: "balance", label: "余额" },
      { prop: "needNote1", label: "是否需要发票" },
      { prop: "remark", label: "备注", type: "tooltip", width: "120" },
      { prop: "evidence", label: "付款凭据", type: "img" },
      { prop: "createTime1", label: "申请时间", width: "100" },
      { prop: "orderStatus1", label: "状态", type: "Mtext" },
      { prop: "updateTime1", label: "操作时间", width: "100" }
    ];
    this.searchItem = [
      {
        type: "select",
        label: "充值方式",
        option_width: "96px",
        prop: "rechargeType",
        placeholder: "请选择充值方式",
        selectList: [
          { label: "申请充值", value: 0 },
          { label: "上级手动充值", value: 1 }
        ]
      },
      {
        type: "select",
        label: "状态",
        option_width: "96px",
        prop: "orderStatus",
        placeholder: "请选择状态",
        selectList: [
          { label: "待审核", value: 0 },
          { label: "已通过", value: 1 },
          { label: "已拒绝", value: 2 }
        ]
      },
      {
        type: "input",
        label: "代理商",
        width: "96px",
        prop: "username",
        placeholder: "用户名/手机号/企业名称"
      },
      {
        type: "select",
        label: "是否需要发票",
        prop: "needNote",
        placeholder: "请选择",
        selectList: [{ label: "是", value: 1 }, { label: "否", value: 0 }]
      }
    ];
    this.exportUrl = "/list/export/rechargeRecord";
  },
  computed: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 充值单列表数据处理
     * @param {type}
     * @return:
     * @Date: 2019-10-11 09:52:12
     */
    changeData() {
      this.tableData.forEach((item, index) => {
        item.proxyName1 = item.proxyName.split("\n");
        item.needNote1 = item.needNote === 0 ? "否" : "是";
        item.updateTime1 = item.updateTime === null ? "-" : item.updateTime;
        item.createTime1 = item.createTime === null ? "-" : item.createTime;
        item.rechargeType1 =
          item.rechargeType === 0 ? "申请充值" : "上级手动充值";
        let order = item.orderStatus;
        item.orderStatus1 =
          order === 0
            ? [["blue", "待审核"]]
            : order === 2 ? ["已拒绝"] : ["已通过"];
      });
      return this.tableData;
    }
  },
  watch: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 当输入框发生变化时，添加属性值phone，companyName
     * @param {type}
     * @return:
     * @Date: 2019-10-11 09:50:07
     */
    searchData: {
      handler(newData) {
        this.searchData.phone = this.searchData.username;
        this.searchData.companyName = this.searchData.username;
      },
      deep: true
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
      this.checkArr = { orderList: val, type: 4, filename: "充值单列表" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:52:39
     */
    getDataList() {
      let parmse = {
        recordType: 2,
        orderType: 2,
        type: 4,
        filename: "充值单列表"
      };
      Object.assign(this.searchData, parmse, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      rechargeRecord(this.searchData).then(res => {
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
.form-wap-recharge {
  .search .search_btn {
    margin-left: 96px;
  }
}
</style>