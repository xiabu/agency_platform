<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-26 09:03:18
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-10-31 09:43:39
 -->
<template>
  <div class="topup-audit">
    <Search :searchData="searchData" :searchItem="searchItem" :pageParams="pageParams" @getDataList="getDataList">
    </Search>
    <Table :tableData="changeData" :tableItem="tableItem" :tableBtnItem="tableBtnItem" @handleRefuse="handleRefuse"
      @handlePass="handlePass" @handleLookView="handleLookView" @getSelecData="getSelecData" @getDataList="getDataList"
      @exportExcel="exportExcel" :exportUrl="exportUrl" :isShowBtn="true" :pageParams="pageParams">
    </Table>
    <!-- 审核通过 -->
    <el-dialog title="审核通过" :visible.sync="dialogDiscount" :close-on-click-modal="false" @close="cancelDiscount">
      <el-form :model="setDiscount" :rules="rulesDiscount" ref="setDiscount">
        <span><i class="el-icon-warning"></i> 确定要通过审核？</span>
        <el-form-item label="支付密码" prop="password" class="pwd">
          <el-input maxlength="16" type="password" v-model="setDiscount.password" placeholder="请输入支付密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDiscount = false">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('setDiscount')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 审核拒绝 -->
    <el-dialog title="审核拒绝" :visible.sync="dialogUnDiscount" :close-on-click-modal="false">
      <p><i class="el-icon-warning"></i> 确定要拒绝审核？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUnDiscount = false">取 消</el-button>
        <el-button type="primary" @click="handleUnDiscountSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import { rechargeRecord, apiAuditOrder } from "../../api/mangeCenter.js";
export default {
  mixins: [mixinTable],
  data() {
    var checkPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入支付密码"));
      } else {
        return callback();
      }
    };
    return {
      dialogDiscount: false, //审核通过弹框
      dialogUnDiscount: false, //审核拒绝弹框
      setDiscount: {
        password: "" // 支付密码
      },
      rulesDiscount: {
        password: [
          { required: true, validator: checkPwd, trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      },
      exportPartUrl: "/list/export/rechargeRecord", // 部分导出链接
      proxyId: "", // 代理商Id
      orderId: "" // 订单ID
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "proxyName1", label: "提交代理商", type: "MtextBlue" },
      { prop: "contactPhone", label: "联系电话" },
      { prop: "amount", label: "充值金额" },
      { prop: "balance", label: "账户余额" },
      { prop: "needNote", label: "是否需要发票", type: "formatter" },
      { prop: "remark", label: "备注", type: "tooltip", width: "120" },
      { prop: "evidence", label: "付款凭据", type: "img" },
      { prop: "createTime", label: "申请时间" },
      { prop: "orderStatus", label: "状态", type: "formatter" },
      { prop: "updateTime", label: "审核时间" },
      { label: "操作", type: "btn", width: "180", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "通过", type: "text", fnName: "handlePass" },
      { name: "拒绝", type: "text", fnName: "handleRefuse", className: "red" },
      { name: "查看详情", type: "text", fnName: "handleLookView" }
    ];
    this.searchItem = [
      {
        type: "input",
        label: "提交代理商",
        width: "96px",
        prop: "username",
        placeholder: "用户名/手机号/企业名称"
      },
      {
        type: "select",
        label: "状态",
        option_width: "96px",
        prop: "orderStatus",
        placeholder: "请选择状态",
        selectList: [
          { label: "待审核", value: "0" },
          { label: "已通过", value: "1" },
          { label: "已拒绝", value: "2" }
        ]
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
    this.proxyId = JSON.parse(localStorage.getItem("token")).proxyId;
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
        if (item.orderStatus === 0) {
          item.btnShow = [true, true, true];
        } else {
          item.btnShow = [false, false, true];
        }
      });
      return this.tableData;
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
      this.checkArr = {
        orderList: val,
        orderType: 1,
        filename: "充值审核列表",
        type: 3
      };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 通过操作
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:55:01
     */
    handlePass(row) {
      this.dialogDiscount = true;
      this.orderId = row.id;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 拒绝操作
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:55:01
     */
    handleRefuse(row) {
      this.dialogUnDiscount = true;
      this.orderId = row.id;
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
      let params = { recordType: 1, filename: "充值审核列表", type: 3 };
      Object.assign(params, this.searchData, this.pageParams);
      this.$store.dispatch("searchData/changeSearch", params);
      rechargeRecord(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 审核通过确认
     * @param {type}
     * @return:
     * @Date: 2019-09-26 10:38:32
     */
    handleDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            orderId: this.orderId,
            password: rsaJsencrypt(this.setDiscount.password),
            proxyId: this.proxyId,
            orderStatus: 1,
            rechargeType: 0
          };
          apiAuditOrder(data).then(res => {
            if (res.code === 200) {
              this.dialogDiscount = false;
              this.$message.success(res.msg);
              this.getDataList();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 审核拒绝确认
     * @param {type}
     * @return:
     * @Date: 2019-09-26 11:13:29
     */
    handleUnDiscountSubmit() {
      let data = {
        orderId: this.orderId,
        proxyId: this.proxyId,
        orderStatus: 2
      };
      apiAuditOrder(data).then(res => {
        if (res.code === 200) {
          this.dialogUnDiscount = false;
          this.$message.success(res.msg);
          this.getDataList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 审核通过关闭弹框清空
     * @param {type}
     * @return:
     * @Date: 2019-09-26 11:54:40
     */
    cancelDiscount() {
      this.$refs.setDiscount.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.topup-audit {
  .el-icon-warning:before {
    color: #ff7b8c;
  }
  .pwd {
    margin-top: 38px;
    margin-left: -10px;
  }
}
</style>
<style lang="less">
.topup-audit {
  .search .search_btn {
    margin-left: 96px;
  }
}
</style>