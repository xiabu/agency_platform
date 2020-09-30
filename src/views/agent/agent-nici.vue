<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-11-18 16:39:32
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="agent-nice">
    <div>
      <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
      </Search>
    </div>
    <Table :tableData="changeDataList" :tableItem="tableItem" :exportUrl="exportUrl" @getSelecData="getSelecData"
      @getDataList="getDataList" @exportExcel="exportExcel" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { apiGetProxyData } from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      searchData: { statisticalUnit: "1" },
      exportPartUrl: "/list/proxyData/exportSelectedData" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "date", label: "时间" },
      { prop: "subProxyCount", label: "代理商总数量" },
      { prop: "newProxy", label: "新增代理商" },
      { prop: "proxyGrowthRate1", label: "代理商增长率" },
      { prop: "activateCount", label: "开通系统总数量" },
      { prop: "newActivate", label: "新开通数量" },
      { prop: "activateGrowthRate1", label: "开通增长率" },
      { prop: "renewActive", label: "续费数量" },
      { prop: "renewGrowthRate1", label: "续费增长率" },
      { prop: "rechargeAmount", label: "下级代理商充值总金额", type: "money" },
      { prop: "newRecharge", label: "新增充值金额", type: "money" }
    ];
    this.searchItem = [
      {
        type: "select",
        label: "查询方式",
        prop: "statisticalUnit",
        placeholder: "请选择查询方式",
        isClear: true,
        selectList: [
          { label: "按月查询", value: "1" },
          { label: "按年查询", value: "2" }
        ]
      },
      { type: "monthrange", label: "时间范围", prop: ["startDate", "endDate"] }
    ];
    this.exportUrl = "/list/proxyData/exportAllData";
  },
  watch: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当输入框发生变化时, 删除时间选择
     * @Date: 2019-09-24 16:55:01
     */
    searchData: {
      handler(newData) {
        if (newData.statisticalUnit === "1") {
          this.searchItem = [
            {
              type: "select",
              label: "查询方式",
              prop: "statisticalUnit",
              placeholder: "请选择查询方式",
              isClear: true,
              selectList: [
                { label: "按月查询", value: "1" },
                { label: "按年查询", value: "2" }
              ]
            },
            {
              type: "monthrange",
              label: "时间范围",
              prop: ["startDate", "endDate"]
            }
          ];
        } else {
          this.searchData.startDate = "";
          this.searchData.endDate = "";
          this.searchItem = [
            {
              type: "select",
              label: "查询方式",
              prop: "statisticalUnit",
              placeholder: "请选择查询方式",
              isClear: true,
              selectList: [
                { label: "按月查询", value: "1" },
                { label: "按年查询", value: "2" }
              ]
            }
          ];
        }
      },
      deep: true
    }
  },
  computed: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 更改列表数据，根据状态条件显示正确的中文
     * @Date: 2019-10-08 16:51:41
     */
    changeDataList() {
      this.tableData.forEach(item => {
        item.date = item.createMonth || item.createYear;
        item.proxyGrowthRate1 =
          item.proxyGrowthRate !== null
            ? item.proxyGrowthRate === 0
              ? "持平"
              : item.proxyGrowthRate + "%"
            : "无对比";
        item.activateGrowthRate1 =
          item.activateGrowthRate !== null
            ? item.activateGrowthRate === 0
              ? "持平"
              : item.activateGrowthRate + "%"
            : "无对比";
        item.renewGrowthRate1 =
          item.renewGrowthRate !== null
            ? item.renewGrowthRate === 0
              ? "持平"
              : item.renewGrowthRate + "%"
            : "无对比";
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 16:21:39
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, filename: "代理商数据-数据详情" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:19:39
     */
    getDataList() {
      if (this.searchData.statisticalUnit === "2") {
      }
      let data = {
        filename: "代理商数据-数据详情"
      };
      Object.assign(this.searchData, data, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      apiGetProxyData(this.searchData).then(res => {
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
.agent-nice {
  .search {
    .search_btn {
      margin-left: 64px;
    }
  }
}
</style>
