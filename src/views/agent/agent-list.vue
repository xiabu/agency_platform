<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-30 13:45:43
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="agent-list">
    <div>
      <Search :searchData="searchData" :searchItem="searchItem" :pageParams="pageParams" @getDataList="getDataList">
      </Search>
    </div>
    <Table :tableData="changeData" :tableItem="tableItem" :exportUrl="exportUrl" @handleLookView="handleLookView"
      @getSelecData="getSelecData" @getDataList="getDataList" @exportExcel="exportExcel" :tableBtnItem="tableBtnItem"
      :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { apiGetProxyList } from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      roleType: JSON.parse(localStorage.getItem("token")).roleType, // 登录类型
      exportPartUrl: "/list/proxyData/exportSelectedProxyList" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "userName", label: "用户名" },
      { prop: "mobilePhone", label: "手机号" },
      { prop: "companyName", label: "企业名称" },
      { prop: "proxyLevel1", label: "层级" },
      { prop: "subProxyCount", label: "发展代理商数量" },
      { prop: "rechargeAmount", label: "充值金额", type: "money" },
      { prop: "activateCount", label: "开通系统数量" },
      { label: "操作", type: "btn", width: "90", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "查看详情", type: "text", fnName: "handleLookView" }
    ];
    this.searchItem = [
      {
        label: "用户名",
        prop: "proxyUserName",
        placeholder: "请输入用户名",
        width: "68px"
      },
      {
        label: "手机号",
        prop: "mobilePhone",
        placeholder: "请输入手机号",
        width: "68px"
      },
      {
        label: "企业名称",
        prop: "proxyCompanyName",
        placeholder: "请输入企业名称"
      }
    ];
    if (this.roleType !== 1) {
      this.tableItem.splice(4, 1);
    }
    this.exportUrl = "/list/proxyData/exportAllProxyList";
  },
  computed: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 修改列表数据
     * @Date: 2019-09-24 16:55:01
     */
    changeData() {
      this.tableData.forEach(item => {
        item.proxyLevel1 = item.proxyLevel + "级";
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
      this.checkArr = { orderList: val, filename: "代理商数据" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 查看按钮
     * @param { Object } row [当前查看列表数据]
     * @Date: 2019-09-24 15:53:39
     */
    handleLookView(row) {
      localStorage.setItem("userName", row.userName);
      this.$router.push({
        path: "/agent/dataDetail",
        name: "dataDetail",
        params: {
          proxyId: row.proxyId,
          companyName: row.companyName
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let data = {
        filename: "代理商数据",
        proxyId: this.$route.query.proxyId
      };
      Object.assign(this.searchData, data, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      apiGetProxyList(this.searchData).then(res => {
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
<style lang="less">
.agent-list {
  .search {
    .search_btn {
      margin-left: 68px;
    }
  }
}
</style>
