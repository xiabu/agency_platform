<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-28 16:07:10
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="agentData1">
    <div>
      <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
      </Search>
    </div>
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
      exportPartUrl: "/list/export/rechargeRecord", // 部分导出链接
      roleType: JSON.parse(localStorage.getItem("token")).roleType, //角色信息
      proxyId: JSON.parse(sessionStorage.proxyId) //代理id
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "proxyName1", label: "代理商", type: "Mtext" },
      { prop: "rechargeType", label: "充值方式", type: "formatter" },
      { prop: "amount", label: "充值金额" },
      { prop: "balance", label: "余额" },
      { prop: "needNote", label: "是否需要发票", type: "formatter" },
      { prop: "remark", label: "备注", type: "tooltip", width: "120" },
      { prop: "evidence", label: "付款凭据", type: "img" },
      { prop: "createTime", label: "申请时间" },
      { prop: "orderStatus", label: "状态", type: "formatter" },
      { prop: "updateTime", label: "操作时间" }
    ];
    this.searchItem = [
      {
        type: "select",
        label: "充值方式",
        prop: "rechargeType",
        option_width: "96px",
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
        option_width: "96px",
        placeholder: "请选择状态",
        selectList: [
          { label: "待审核", value: "0" },
          { label: "已通过", value: "1" },
          { label: "已拒绝", value: "2" }
        ]
      },
      {
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
        selectList: [{ label: "是", value: "1" }, { label: "否", value: "0" }]
      }
    ];
    this.exportUrl = "/list/export/rechargeRecord";
  },
  watch: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当输入框发生变化时，添加属性值phone，companyName
     * @Date: 2019-09-24 16:55:01
     */
    searchData: {
      handler(newData) {
        this.searchData.phone = this.searchData.username;
        this.searchData.companyName = this.searchData.username;
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
      this.tableData.forEach(item => {
        item.proxyName1 = item.proxyName.split("\n");
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 15:53:39
     */
    getSelecData(val) {
      this.checkArr = {
        orderList: val,
        type: this.roleType === 1 ? 5 : 0,
        filename: "充值记录"
      };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let data = {
        filename: "充值记录",
        type: 0,
        proxyId: this.proxyId
      };
      Object.assign(this.searchData, this.pageParams, data);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      rechargeRecord(this.searchData).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
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
.agentData1 {
  .search .search_btn {
    margin-left: 96px;
  }
}
</style>