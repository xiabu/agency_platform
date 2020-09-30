<!--
 * @Description: 创建页面
 * @Author: 赵亮
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-30 18:09:29
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="form-wap">
    <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
    </Search>
    <Table :tableData="changeData" :tableItem="tableItem" @handleLookView="handleLookView" @getDataList="getDataList"
      :tableBtnItem="tableBtnItem" :pageParams="pageParams">
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
      empId: JSON.parse(localStorage.getItem("token")).empId //员工id
    };
  },
  created() {
    this.tableItem = [
      { prop: "buyerInfo1", label: "购买人信息", type: "Mtext" },
      { prop: "productInfo1", label: "商品信息", type: "Mtext" },
      { prop: "amount", label: "总价", type: "money" },
      { prop: "orderType1", label: "类型" },
      { prop: "isNeedNote1", label: "是否需要发票" },
      { prop: "evidence", label: "付款凭据", type: "img" },
      { prop: "employeeName", label: "关联员工" },
      { prop: "createTime", label: "提交时间" },
      { prop: "submmitterName", label: "提交人" },
      { prop: "orderStatus1", label: "状态", type: "Mtext" },
      { label: "操作", type: "btn", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "查看详情", type: "text", fnName: "handleLookView" }
    ];
    this.searchItem = [
      {
        type: "input",
        label: "购买人信息",
        prop: "phone",
        placeholder: "用户名/手机号/企业名称"
      },
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
  },
  watch: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当输入框发生变化时，添加属性值companyName
     * @Date: 2019-09-24 16:55:01
     */
    searchData: {
      handler(newData) {
        this.searchData.companyName = this.searchData.phone;
        this.searchData.username = this.searchData.phone;
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
        item.buyerInfo1 = item.buyerInfo.split("\n");
        item.productInfo1 = item.productInfo.split("\n");
        if (item.orderStatus === 0) {
          item.orderStatus1 = [["blue", "待审核"]];
        } else if (item.orderStatus === 1) {
          if (item.activeAccount === 1) {
            item.orderStatus1 = item.orderType === 1 ? ["已通过"] : ["已通过", ["redTxt", "（账号未开通）"]]
          } else {
            item.orderStatus1 = item.orderType === 1 ? ["已通过"] : ["已通过", ["green", "（账号已开通）"]]
          }
        } else {
          item.orderStatus1 = ["已拒绝"];
        }
        item.orderType1 = item.orderType === 0 ? "新购单" : "续费单";
        item.isNeedNote1 = item.isNeedNote === 0 ? "否" : "是";
      });
      return this.tableData;
    }
  },
  methods: {
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
      let data = {};
      if (JSON.parse(localStorage.getItem("token")).roleType === 3) {
        data = {
          empId: JSON.parse(localStorage.getItem("token")).empId
        };
      } else if (JSON.parse(localStorage.getItem("token")).roleType === 2) {
        data = {
          empId: JSON.parse(localStorage.getItem("token")).empId,
          formType: 0
        };
      }
      Object.assign(this.searchData, data, this.pageParams);
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
.form-wap {
  .search .search_btn {
    margin-left: 82px;
  }
}
</style>