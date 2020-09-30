<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-29 20:32:27
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="agent-detail">
    <h2 class="agent-title">{{userName}}</h2>
    <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
    </Search>
    <Table :tableData="changeDataList" :tableItem="tableItem" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
    <el-button class="goback" type="primary" @click="$router.go(-1)">返回</el-button>
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
      exportPartUrl: "/list/proxyData/exportSelectedData", // 部分导出链接
      proxyId: "", // 代理商id
      userName: "" //代理商名称
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "date", label: "时间" },
      { prop: "subProxyCount", label: "代理商总数量" },
      { prop: "newProxy", label: "新增代理商" },
      { prop: "proxyGrowthRate", label: "代理商增长率" },
      { prop: "activateCount", label: "开通系统总数量" },
      { prop: "newActivate", label: "新开通数量" },
      { prop: "activateGrowthRate", label: "开通增长率" },
      { prop: "renewActive", label: "续费数量" },
      { prop: "renewGrowthRate", label: "续费增长率" },
      { prop: "rechargeAmount", label: "下级代理商充值总金额" },
      { prop: "newRecharge", label: "新增充值金额" }
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
    this.userName = this.$route.params.companyName;
    this.exportUrl = "/list/proxyCompany/exportAllProxies";
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
        item.proxyGrowthRate =
          item.proxyGrowthRate !== null
            ? item.proxyGrowthRate === 0
              ? "持平"
              : item.proxyGrowthRate + "%"
            : "无对比";
        item.activateGrowthRate =
          item.activateGrowthRate !== null
            ? item.activateGrowthRate === 0
              ? "持平"
              : item.activateGrowthRate + "%"
            : "无对比";
        item.renewGrowthRate =
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
     * @Date: 2019-09-24 15:53:39
     */
    getSelecData(val) {
      this.checkArr = val;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let parmse = { proxyId: this.$route.params.proxyId };
      Object.assign(parmse, this.searchData, this.pageParams);
      apiGetProxyData(parmse).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.agent-detail {
  .goback {
    position: fixed;
    top: 79px;
    width: 80px;
    right: 20px;
    border-radius: 4px;
  }
  .agent-title {
    padding-bottom: 20px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
  }
}
</style>
<style lang="less">
  .agent-detail{
    .search {
    .search_btn {
      margin-left: 68px;
    }
  }
  }
</style>