<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-26 09:03:18
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-21 19:11:50
 -->
<template>
  <div class="form-wap">
    <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
    </Search>
    <Table :tableData="changeData" :tableItem="tableItem" :isShowBtn="true" @handlePass="handlePass"
      @handleRefuse="handleRefuse" @handleDredge="handleDredge" @handleLookView="handleLookView"
      @getSelecData="getSelecData" @getDataList="getDataList" @exportExcel="exportExcel" :exportUrl="exportUrl"
      :tableBtnItem="tableBtnItem" :pageParams="pageParams">
    </Table>
    <open-account @dialogSubmit="dialogSubmit" :disabled="disabled" :isShow="isShow" @closeDialog="closeDialog" :loginAccount="loginAccount"></open-account>
    <pass-review @passSubmit="passSubmit" :disabled="disabled" :paymentAmount="amountCount" :showPassReview="showPassReview"
      @closeDialogReview="closeDialogReview">
    </pass-review>
    <refuse-review @refuseSubmit="refuseSubmit" :disabled="disabled" :showReview="showReview" @closeReview="closeReview"></refuse-review>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import openAccount from "../../components/openAccount";
import passReview from "../../components/passReview";
import refuseReview from "../../components/refuseReview";
import {
  rechargeRecord,
  apiAccountData,
  apiAuditOrder
} from "../../api/mangeCenter.js";
export default {
  mixins: [mixinTable],
  components: {
    openAccount,
    passReview,
    refuseReview
  },
  data() {
    return {
      disabled: false,
      loginAccount: "", // 登录账号
      id: 0, // 订单id
      proxyId: JSON.parse(localStorage.getItem("token")).proxyId, //代理商id
      isShow: false, //是否显示弹框
      showPassReview: false, // 是否显示审核通过弹框
      showReview: false, //是否显示审核拒绝弹框
      exportPartUrl: "/list/export/rechargeRecord", // 部分导出链接
      active: "", // tab选中index值
      amountCount: 0 //扣除金额
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "proxyName1", label: "提交代理商", type: "MtextBlue" },
      { prop: "contactPhone", label: "联系电话" },
      { prop: "amount", label: "充值金额" },
      { prop: "balance", label: "账户余额" },
      { prop: "paymentAmount1", label: "扣款信息", type: "Mtext" },
      { prop: "needNote1", label: "是否需要发票" },
      { prop: "remark", label: "备注", type: "tooltip", width: "120" },
      { prop: "evidence", label: "付款凭据", type: "img" },
      { prop: "createTime", label: "申请时间", width: "100" },
      { prop: "orderStatus1", label: "状态", type: "Mtext" },
      { prop: "updateTime1", label: "审核时间", width: "100" },
      { label: "操作", type: "btn", width: "180", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "通过", type: "text", fnName: "handlePass" },
      { name: "拒绝", type: "text", fnName: "handleRefuse", className: "red" },
      { name: "开通账号", type: "text", fnName: "handleDredge" },
      { name: "查看详情", type: "text", fnName: "handleLookView" }
    ];
    this.searchItem = [
      {
        type: "input",
        label: "提交代理商",
        prop: "username",
        placeholder: "用户名/手机号/企业名称"
      },
      {
        type: "select",
        label: "是否需要发票",
        prop: "needNote",
        placeholder: "请选择",
        selectList: [{ label: "否", value: "0" }, { label: "是", value: "1" }]
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
        if (item.orderStatus === 0) {
          item.orderStatus1 = [["blue", "待审核"]];
          item.btnShow = [true, true, false, true];
        } else if (item.orderStatus === 1) {
          if (item.activeAccount === 1) {
            item.btnShow = [false, false, true, true];
            item.orderStatus1 = ["已通过"];
          } else {
            item.orderStatus1 = ["已通过"];
            item.btnShow = [false, false, false, true];
          }
        } else {
          item.orderStatus1 = ["已拒绝"];
          item.btnShow = [false, false, false, true];
        }
        item.proxyName1 = item.proxyName.split("\n");
        item.needNote1 = item.needNote === 0 ? "否" : "是";
        item.updateTime1 = item.updateTime === null ? "-" : item.updateTime;
        if (item.orderStatus === 0) {
          item.paymentAmount1 = [
            "预扣除",
            "￥ " + Number(item.paymentAmount / 100).toFixed(2)
          ];
        } else if (item.orderStatus === 1) {
          item.paymentAmount1 = [
            "扣除",
            "￥ " + Number(item.paymentAmount / 100).toFixed(2)
          ];
        } else {
          item.paymentAmount1 = ["扣除", "￥ 0.00"];
        }
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 审核拒绝接口
     * @param {type}
     * @return:
     * @Date: 2019-10-08 16:13:13
     */
    refuseSubmit() {
      let data = {
        orderId: this.id,
        // password: passReview.password,
        proxyId: this.proxyId,
        orderStatus: 2
      };
      this.disabled = true;
      apiAuditOrder(data).then(res => {
        if (res.code === 200) {
          this.disabled = false;
          this.showReview = false;
          this.$message.success(res.msg);
          this.getDataList();
          this.$emit("changeStatus");
        } else {
          this.disabled = false;
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 审核通过接口
     * @param {type}
     * @return:
     * @Date: 2019-10-08 15:44:58
     */
    passSubmit(passReview) {
      let data = {
        orderId: this.id,
        password: rsaJsencrypt(passReview.password),
        proxyId: this.proxyId,
        orderStatus: 1,
        rechargeType: 0
      };
      this.disabled = true;
      apiAuditOrder(data).then(res => {
        if (res.code === 200) {
          this.disabled = false;
          this.showPassReview = false;
          this.$message.success(res.msg);
          this.getDataList();
          this.$emit("changeStatus");
        } else {
          this.disabled = false;
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 开通账号接口
     * @param {type}
     * @return:
     * @Date: 2019-10-08 15:33:43
     */
    dialogSubmit(dialogForm) {
      let data = {
        orderId: this.id,
        username: dialogForm.login,
        password: dialogForm.password
      };
      this.disabled = true;
      apiAccountData(data).then(res => {
        if (res.code == 200) {
          this.isShow = false;
          this.disabled = false;
          this.$message.success(res.msg);
          this.getDataList();
          this.$emit("changeStatus");
        } else {
          this.disabled = false;
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 关闭弹框
     * @param {type}
     * @return:
     * @Date: 2019-10-08 10:40:30
     */
    closeDialog() {
      this.isShow = false;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 关闭审核通过弹框
     * @param {type}
     * @return:
     * @Date: 2019-10-08 11:28:35
     */
    closeDialogReview() {
      this.showPassReview = false;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 关闭审核拒绝弹框
     * @param {type}
     * @return:
     * @Date: 2019-10-08 11:48:40
     */
    closeReview() {
      this.showReview = false;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取当前tab的index值
     * @param { Number } index [选中值]
     * @Date: 2019-09-24 16:54:39
     */
    getActiveIndex(index) {
      this.pageParams.currentPage = 1;
      this.pageParams.pageNum = 1;
      this.active = index > 0 ? index - 1 : "";
      this.getDataList();
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 16:54:39
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, filename: "充值单", type: 2 };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 通过操作
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:55:01
     */
    handlePass(row) {
      this.amountCount = row.paymentAmount;
      this.id = row.id;
      this.showPassReview = true;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 拒绝操作
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:55:01
     */
    handleRefuse(row) {
      this.id = row.id;
      this.showReview = true;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 开通账号
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:55:01
     */
    handleDredge(row) {
      this.isShow = true;
      this.id = row.id;
      this.loginAccount = row.buyerInfo.split("\n")[1];
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 查看详情
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:55:01
     */
    handleLookView(row) {
      this.$router.push({
        path: "/agent/formDetail",
        name: "agentFormDetail",
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
        recordType: 1,
        orderStatus: this.active,
        orderType: 2,
        filename: "充值单",
        type: 2
      };
      Object.assign(this.searchData, parmse, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      rechargeRecord(this.searchData).then(res => {
        if (res.code === 200) {
          this.pageParams.total = res.data.total;
          this.pageParams.currentPage = res.data.pageNum;
          this.tableData = res.data.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>