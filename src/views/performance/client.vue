<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-11-20 14:23:38
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="performance">
    <div>
      <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
      </Search>
    </div>
    <Table :tableData="changeDataList" :tableItem="tableItem" :tableBtnItem="tableBtnItem" @handleEdit="handleEdit" @getDataList="getDataList" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { getShopList } from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  data() {
    return {};
  },
  created() {
    this.tableItem = [
      { prop: "customerName", label: "客户名称" },
      { prop: "customerPhone", label: "手机号" },
      { prop: "companyName", label: "企业名称" },
      { prop: "productName", label: "购买商品版本" },
      { prop: "renewNum", label: "续费次数" },
      { prop: "dateTime", label: "有效期", type: "Mtext" },
      { prop: "createTime", label: "创建时间" },
      { label: "操作", type: "btn", width: "100", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "续费", type: "text", fnName: "handleEdit" },
    ];
    this.searchItem = [
      {
        label: "客户名称",
        prop: "customerName",
        placeholder: "请输入客户名称"
      },
      { label: "手机号", prop: "customerPhone", placeholder: "请输入手机号" },
      { label: "企业名称", prop: "companyName", placeholder: "请输入企业名称" }
    ];
  },
  computed: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 更改列表数据，根据状态条件显示正确的中文
     * @Date: 2019-10-08 16:51:41
     */
    changeDataList() {
      this.tableData.forEach(item => {
        item.dateTime = [item.beginTime, "至", item.endTime];
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 续费
     * @param {type} 
     * @Date: 2019-11-20 14:16:18
     */
    handleEdit(row){
      console.log(123123);
      
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取table列表数据
     * @Date: 2019-09-24 16:18:39
     */
    getDataList() {
      let parmse = { empId: JSON.parse(localStorage.getItem("token")).empId };
      Object.assign(parmse, this.searchData, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", parmse);
      getShopList(parmse).then(res => {
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
.performance {
  .search .search_btn {
    margin-left: 68px;
  }
}
</style>