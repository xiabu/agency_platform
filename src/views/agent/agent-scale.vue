<template>
  <div class="agent-index">
    <el-button type="primary" class="btm-btn" @click="$router.push('/agent/dredge')">添加等级</el-button>
    <Table
      :tableData="changeData"
      :tableItem="tableItem" 
      @handleDelete="handleDelete"
      @getDataList="getDataList"
      :tableBtnItem="tableBtnItem" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import {
  manageProxies
} from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  data() {
    return {
      disabled: false,
      roleType: JSON.parse(localStorage.getItem("token")).roleType // 登录权限
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "proxyUserName", label: "等级" },
      { prop: "mobilePhone", label: "代理商数量" },
      { prop: "proxyCompanyName", label: "创建时间" },
      { label: "操作", type: "btn", width: "90", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "删除", type: "text", className: "red", fnName: "handleDelete" }
    ];
  },
  computed: {
    changeData() {
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 删除
     * @Date: 2019-09-24 16:45:01
     */
    handleDelete(row) {
      console.log("删除");
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 获取table列表数据
     * @param {type}
     * @return:
     * @Date: 2019-09-27 10:04:33
     * @update: 对接后台接口 郭亮(849324068@qq.com) 2019年9月27日16:43:07
     */
    getDataList() {
      manageProxies(this.searchData).then(res => {
        if (res.code === 200) {
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
</style>
