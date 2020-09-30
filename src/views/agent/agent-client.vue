<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-21 09:15:32
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="agent-client">
    <div>
      <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
      </Search>
    </div>
    <Table :tableData="changeDataList" :tableItem="tableItem" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { getShopList } from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      exportPartUrl: "/list/export/exportShopExcel" ,// 部分导出链接
      proxyId: JSON.parse(sessionStorage.proxyId), //代理id
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "companyName", label: "企业名称" },
      { prop: "customerPhone", label: "手机号" },
      { prop: "productName", label: "购买商品版本" },
      { prop: "cardNumAll", label: "已使用/开通名片数" },
      { prop: "renewNum", label: "续费次数" },
      { prop: "relevanceEmployeeName", label: "关联员工" },
      { prop: "dateTime", label: "有效期", type: "Mtext" },
      { prop: "createTime", label: "创建时间" }
    ];
    this.searchItem = [
      { label: "企业名称", prop: "companyName", placeholder: "请输入企业名称" },
      { label: "手机号", prop: "customerPhone", placeholder: "请输入手机号" }
    ];
    this.exportUrl = "/list/export/exportShopExcel";
  },
  computed: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 更改列表数据，根据状态条件显示正确的中文
     * @Date: 2019-10-08 16:51:41
     */
    changeDataList() {
      this.tableData.forEach(item => {
        item.cardNumAll = `${item.cardUseNum}/${item.cardNum}`;
        item.dateTime = [item.beginTime, "至", item.endTime];
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
      this.checkArr = { shopList: val, filename: "客户系统" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let data = {
        filename: "客户系统",
        proxyId: this.proxyId
      };
      Object.assign(this.searchData, this.pageParams, data);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      getShopList(this.searchData).then(res => {
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
  .agent-client {
  .search .search_btn {
    margin-left: 68px;
  }
}
</style>