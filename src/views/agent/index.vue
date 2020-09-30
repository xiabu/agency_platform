<!--
 * @Description: 创建页面，弹窗
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-11-19 08:52:47
 * @LastEditors: 李沛韬（929498346@qq.com）
= -->
<template>
  <div class="agent-index">
    <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
    </Search>
    <el-button type="primary" class="btm-btn" @click="$router.push('/agent/dredge')">开通代理商</el-button>
    <Table :tableData="changeData" :tableItem="tableItem" @handleSort="handleSort" @handleLookView="handleLookView"
      @handleRecharge="handleRecharge" @handleSetting="handleSetting" @getSelecData="getSelecData"
      @getDataList="getDataList" @exportExcel="exportExcel" :exportUrl="exportUrl" :isShowBtn="true"
      :tableBtnItem="tableBtnItem" :pageParams="pageParams">
    </Table>
    <!-- 充值弹窗 -->
    <el-dialog title="充值" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="cancelRecharge">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-form-item label="充值金额" prop="amount">
          <el-input autoComplete="new-password" v-model="dialogForm.amount" placeholder="请输入充值金额（元）" @input="oninput"
            maxlength="9"></el-input>
        </el-form-item>
        <el-form-item label="支付密码" prop="payPassword">
          <el-input maxlength="16" autoComplete="new-password" type="password" v-model="dialogForm.payPassword"
            placeholder="请输入支付密码">
          </el-input>
          <span>&nbsp;</span>
        </el-form-item>
        <el-form-item label="付款凭据">
          <upload-img class="uploadImg" @checkImg="checkImg" :imgs='dialogForm.detailImg'></upload-img>
          <p class="tip">大小不超过2M,最多上传3张</p>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" maxlength="200" show-word-limit v-model="dialogForm.remark" placeholder="请输入备注"
            :rows="4">
          </el-input>
        </el-form-item>
        <span style="padding-left: 88px;" v-if="roleType !== 1"><i class="el-icon-warning"></i>
          预计扣除账户余额￥{{Number(amountPay/100).toFixed(2)}}</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="handleDialogSubmit('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置拿货折扣比例外层 -->
    <el-dialog title="设置拿货折扣比例" :visible.sync="dialogDiscount" :close-on-click-modal="false" @close="cancelDiscount">
      <el-form :model="setDiscount" :rules="rulesDiscount" ref="setDiscount">
        <span v-if="roleType != 1"><i class="el-icon-warning icon"></i> 上调下级代理商折扣，需联系总部，联系方式：0571-87796692</span>
        <el-form-item label="拿货折扣比例" prop="discount">
          <el-input v-model="setDiscount.discount" placeholder="请输入1-100的整数"></el-input>
          <span>&nbsp;%</span>
        </el-form-item>
        <el-form-item v-if="roleType == 1" label="支付密码" prop="pass">
          <el-input maxlength="16" type="password" v-model="setDiscount.pass" placeholder="请输入支付密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDiscount = false">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="handleDialogConfirm('setDiscount')">确定</el-button>
      </div>
    </el-dialog>
    <!-- 设置拿货折扣比例内层 -->
    <el-dialog title="设置拿货折扣比例" :visible.sync="dialogUnDiscount" :close-on-click-modal="false" @close="cancelDiscount1">
      <p style="margin-top: -5px;"><i class="el-icon-warning"></i> 确定要下调{{this.username}}的拿货折扣？</p>
      <p style="margin-left: 24px;margin-top: 12px;margin-bottom: 28px;">预计扣除账户余额￥{{Number(count/100).toFixed(2)}}</p>
      <el-form style="margin-left: -30px;" :model="setDiscount1" :rules="rulesDiscount1" ref="setDiscount1">
        <el-form-item label="支付密码" prop="pass">
          <el-input maxlength="16" type="password" v-model="setDiscount1.pass" placeholder="请输入支付密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUnDiscount = false">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="handleUnDiscountSubmit('setDiscount1')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import mixinTable from "../../components/mixinTable";
import uploadImg from "../../components/uploadImg";
import {
  manageProxies,
  recharge,
  rechargeInfo,
  setDiscount,
  discountInfo
} from "../../api/agent.js";
import {
  validateNum,
  validateScale,
  validateInteger
} from "../../assets/js/form_validate.js";
export default {
  mixins: [mixinTable],
  components: {
    uploadImg
  },
  data() {
    return {
      disabled: false,
      roleType: JSON.parse(localStorage.getItem("token")).roleType, //登录权限
      username: "", //代理商名字
      discount1: "", //初始折扣
      discount: "", //拿货折扣
      dialogFormVisible: false, // 弹窗状态
      dialogDiscount: false, //拿货折扣比例外层弹框
      dialogUnDiscount: false, //拿货折扣比例内层弹框
      balanceAsc: true, //是否按余额升序，true：升序；false：降序
      rechargeAsc: true, //是否按累计充值金额升序，true：升序；false：降序
      changeSort: false, //开关 控制是否排序
      indexSort: "", //排序区分 1是按累计充值金额升序 2按余额升序
      subProxyId: "", //下级代理id
      count: "", //账户余额
      amountPay: "", //实际预扣余额
      dialogForm: {
        amount: "", // 金额
        payPassword: "", // 支付密码
        remark: "", // 备注
        detailImg: [] //付款凭据
      },
      rules: {
        amount: [
          {
            required: true,
            message: "请输入0-999999999的充值金额",
            trigger: "blur"
          }
        ],
        payPassword: [
          { required: true, message: "请输入支付密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      },
      setDiscount: {
        discount: "", //拿货折扣比例
        pass: "" // 支付密码
      },
      setDiscount1: {
        pass: "" // 支付密码
      },
      //验证
      rulesDiscount: {
        discount: [
          { required: true, message: "请输入拿货折扣比例", trigger: "blur" },
          { validator: validateScale, trigger: "blur" },
          { validator: validateInteger, trigger: "change" }
        ],
        pass: [
          { required: true, message: "请输入支付密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      },
      //验证
      rulesDiscount1: {
        pass: [
          { required: true, message: "请输入支付密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      },
      exportPartUrl: "/list/proxyCompany/exportSelectedProxies" // 部分导出链接
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "proxyUserName", label: "客户姓名" },
      { prop: "mobilePhone", label: "手机号" },
      { prop: "proxyCompanyName", label: "企业名称" },
      { prop: "cityName", label: "区域" },
      { prop: "proxyLevel1", label: "层级" },
      {
        prop: "rechargeAmount",
        label: "充值金额",
        isSort: "true",
        type: "money"
      },
      { prop: "balance", label: "账户余额", isSort: "true", type: "money" },
      { prop: "discount", label: "拿货折扣比例" },
      { prop: "employeeName", label: "关联员工" },
      { prop: "createTime", label: "创建时间", width: "100" },
      { label: "操作", type: "btn", width: "180", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "查看", type: "text", fnName: "handleLookView" },
      {
        name: "充值",
        type: "text",
        fnName: "handleRecharge",
        className: "btnRed"
      },
      { name: "设置折扣比例", type: "text", fnName: "handleSetting" }
    ];
    this.searchItem = [
      {
        label: "客户姓名",
        prop: "proxyUserName",
        placeholder: "请输入客户姓名"
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
      },
      {
        label: "关联员工",
        prop: "employeeName",
        placeholder: "请输入关联员工"
      },
      {
        type: "city",
        label: "区域",
        label_width: "68px",
        cityItem: ["provinceCode", "cityCode"]
      }
    ];
    if (this.roleType !== 1) {
      this.tableItem.splice(5, 1);
    }
    this.exportUrl = "/list/proxyCompany/exportAllProxies";
  },
  computed: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 对按钮进行判断 当前行的数据等于localstory的数据时,判定按钮可用
     * @param {type}
     * @return:
     * @Date: 2019-10-10 19:35:12
     */
    changeData() {
      this.tableData.forEach(element => {
        element.proxyLevel1 = element.proxyLevel + "级";
        if (element.pid !== JSON.parse(localStorage.getItem("token")).proxyId) {
          element.btnShow = [true, false, true];
        } else {
          element.btnShow = [true, true, true];
        }
      });
      return this.tableData;
    }
  },
  watch: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 监控金额,发生变化时 获取折扣金额
     * @param {type}
     * @return:
     * @Date: 2019-10-08 16:56:19
     */
    "dialogForm.amount": {
      deep: true,
      handler: function(val) {
        if (val === "") {
          val = 0;
        }
        this.validateAmount(val);
      }
    }
  },
  methods: {
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 异步验证,调取amount的值传入后台,对充值金额进行折扣计算
     * @param {type}
     * @return:
     * @Date: 2019-10-23 15:37:08
     */
    validateAmount(value) {
      let params = {
        amount: value * 100,
        subProxyId: this.subProxyId
      };
      rechargeInfo(params).then(res => {
        if (res.code === 200) {
          this.amountPay = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 输入充值金额验证
     * @param {type}
     * @return:
     * @Date: 2019-10-23 15:21:53
     */
    oninput(val) {
      val = val.replace(/[^\d]/g, ""); //清除"数字"以外的字符
      this.dialogForm.amount = val;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 排序发生变化
     * @param { Array } sortArr [排序信息]
     * @Date: 2019-09-25 15:56:56
     */
    handleSort(sortArr) {
      this.changeSort = true;
      this.pageParams.pageNum = 1;
      if (sortArr[1] === "rechargeAmount") {
        this.indexSort = "1";
        if (sortArr[0] !== "descending") {
          this.rechargeAsc = true;
        } else {
          this.rechargeAsc = false;
        }
      } else if (sortArr[1] === "balance") {
        this.indexSort = "2";
        if (sortArr[0] !== "descending") {
          this.balanceAsc = true;
        } else {
          this.balanceAsc = false;
        }
      }
      this.getDataList();
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 拿货折扣比例内层确认
     * @param {type}
     * @return:
     * @Date: 2019-09-27 19:43:44
     */
    handleUnDiscountSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.disabled = true;
          let data = {
            subProxyId: this.subProxyId,
            payPassword: rsaJsencrypt(this.setDiscount1.pass),
            discount: this.discount
          };
          setDiscount(data).then(res => {
            if (res.code == 200) {
              this.disabled = false;
              this.$message({
                type: "success",
                message: res.msg
              });
              this.dialogDiscount = false;
              this.dialogUnDiscount = false;
              this.getDataList();
            } else {
              this.disabled = false;
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 拿货折扣比例外层确认
     * @param {type}
     * @return:
     * @Date: 2019-09-27 19:42:56
     */
    handleDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.disabled = true;
          if (this.roleType == 1) {
            if (
              parseInt(this.setDiscount.discount) == parseInt(this.discount1)
            ) {
              this.$message({
                type: "error",
                message: "拿货折扣比例无变化，请重新输入"
              });
              this.disabled = false;
            } else {
              let data = {
                subProxyId: this.subProxyId,
                payPassword: rsaJsencrypt(this.setDiscount.pass),
                discount: this.setDiscount.discount
              };
              setDiscount(data).then(res => {
                if (res.code == 200) {
                  this.disabled = false;
                  this.$message({
                    type: "success",
                    message: res.msg
                  });
                  this.dialogDiscount = false;
                  this.dialogUnDiscount = false;
                  this.getDataList();
                } else {
                  this.disabled = false;
                  this.$message({
                    type: "error",
                    message: res.msg
                  });
                }
              });
            }
          } else {
            if (
              parseInt(this.setDiscount.discount) > parseInt(this.discount1)
            ) {
              this.$message({
                type: "error",
                message: "上调折扣比例，需联系总部"
              });
              this.disabled = false;
              this.setDiscount.discount = this.discount1;
            } else if (
              parseInt(this.setDiscount.discount) == parseInt(this.discount1)
            ) {
              this.$message({
                type: "error",
                message: "拿货折扣比例无变化，请重新输入"
              });
              this.disabled = false;
            } else {
              this.dialogDiscount = false;
              this.dialogUnDiscount = true;
              this.discount = this.setDiscount.discount;
              let params = {
                subProxyId: this.subProxyId,
                discount: this.setDiscount.discount
              };
              discountInfo(params).then(res => {
                if (res.code == 200) {
                  this.disabled = false;
                  this.count = res.data;
                } else {
                  this.disabled = false;
                  this.$message.error(res.msg);
                }
              });
            }
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 上传图片 接口组件调用
     * @param {type}
     * @return:
     * @Date: 2019-09-29 19:12:43
     */
    checkImg(data) {
      this.dialogForm.detailImg = data;
    },
    /**
     * @author:  郭亮(849324068@qq.com)
     * @description: 提交表单
     * @param { String } formName [表单对象名字]
     * @Date: 2019-09-24 16:43:01
     * @update: 对接后台接口 郭亮(849324068@qq.com) 2019年9月27日16:43:07
     */
    handleDialogSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            subProxyId: this.subProxyId,
            amount: this.dialogForm.amount * 100,
            payPassword: rsaJsencrypt(this.dialogForm.payPassword),
            remark: this.dialogForm.remark,
            evidence: JSON.stringify(this.dialogForm.detailImg)
          };
          this.disabled = true;
          recharge(params).then(res => {
            if (res.code === 200) {
              this.disabled = false;
              this.$message({
                type: "success",
                message: res.msg
              });
              this.getDataList();
              this.dialogFormVisible = false;
              this.dialogForm.detailImg = [];
              this.$refs.dialogForm.resetFields();
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
              this.disabled = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 关闭充值弹框清空
     * @Date: 2019-09-24 16:38:01
     */
    cancelRecharge() {
      this.dialogForm.detailImg = [];
      this.$refs.dialogForm.resetFields();
      this.dialogForm = {
        amount: "", // 金额
        payPassword: "", // 支付密码
        remark: "" // 备注
      };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 审核通过关闭弹框清空
     * @Date: 2019-09-24 16:38:01
     */
    cancelDiscount() {
      this.$refs.setDiscount.resetFields();
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 审核通过内层关闭弹框清空
     * @param {type}
     * @return:
     * @Date: 2019-10-10 09:47:34
     */
    cancelDiscount1() {
      this.$refs.setDiscount1.resetFields();
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 16:44:01
     */
    getSelecData(val) {
      this.checkArr = { orderList: val, filename: "代理商列表" };
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 查看
     * @Date: 2019-09-24 16:45:01
     */
    handleLookView(row) {
      let temp = true;
      if (row.pid !== JSON.parse(localStorage.getItem("token")).proxyId) {
        temp = false;
      }
      localStorage.setItem("isShowRecharge", temp);
      this.$router.push({
        name: "agentDetail",
        params: {
          proxyId: row.proxyId,
          name: row.proxyCompanyName
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 设置折扣比例
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:44:01
     */
    handleSetting(row) {
      this.dialogDiscount = true;
      this.setDiscount.discount = row.discount.split("%")[0];
      this.discount1 = this.setDiscount.discount;
      this.setDiscount1.pass = "";
      this.subProxyId = row.proxyId;
      this.username = row.proxyUserName;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 充值
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:44:01
     */
    handleRecharge(row) {
      this.dialogFormVisible = true;
      this.subProxyId = row.proxyId;
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
      //区分排序方式 1是按累计充值金额排序 2按余额排序
      if (this.changeSort && this.indexSort === "1") {
        var dataSort = {
          rechargeAsc: this.rechargeAsc,
          balanceAsc: ""
        };
      } else if (this.changeSort && this.indexSort === "2") {
        dataSort = {
          balanceAsc: this.balanceAsc,
          rechargeAsc: ""
        };
      }
      let data = {
        filename: "代理商列表"
      };
      Object.assign(this.searchData, this.pageParams, data, dataSort);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
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
        dataSort = {};
      });
    }
  }
};
</script>
<style lang="less" scoped>
.agent-index {
  .uploadImg {
    margin-top: 0;
    margin-bottom: 0;
  }
  .tip {
    line-height: 12px !important;
    margin-left: 110px;
    margin-top: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .icon {
    margin-bottom: 30px;
  }
}
</style>
<style lang="less">
.agent-index {
  .el-textarea .el-input__count {
    line-height: 15px;
  }
  .item-btn:first-child {
    display: inline;
  }
  .item-btn:nth-child(2) {
    display: inline;
    margin-left: 25px;
  }
  .el-icon-warning:before {
    color: #ff7b8c;
    margin-right: 5px;
  }
  .search .search_btn {
    margin-left: 68px;
  }
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog .el-dialog__header {
    padding: 15px 0;
  }
}
</style>
