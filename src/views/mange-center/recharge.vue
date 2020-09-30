<!--
 * @Description:管理中心/申请充值页面
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-23 09:08:11
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-11-12 17:30:56
 -->

<template>
  <div class="mange-center form">
    <el-form ref="form" class="apply-form" :model="form" :rules="rules" label-width="385px" @submit.prevent="onSubmit"
      style="margin-bottom: 36px;">
      <el-form-item label="充值金额" prop="orderAmount">
        <el-input type="text" v-model="form.orderAmount" @input="oninput" placeholder="请输入0-999999999的充值金额（元）"
          maxlength="9">
        </el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="form.contactPhone" placeholder="请输入联系电话" maxlength="11" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="付款凭据" class="recharge_evidence">
        <uploadImg @checkImg="checkImg"></uploadImg>
      </el-form-item>
      <div class="tip">大小不超过2M，最多上传3张</div>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" placeholder="请输入备注" v-model="form.remark" resize='none' :rows="4" maxlength="200"
          show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="发票" prop="invoice">
        <el-select v-model="form.invoice" placeholder="请选择">
          <el-option v-for="(item,index) in invoiceType" :key='index' :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.invoice == 1">
        <el-radio-group v-model="invoice_title_type">
          <el-radio :label="1">个人</el-radio>
          <el-radio :label="2">单位</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="invoice-detail" v-if="form.invoice != 0">
      <div class="invoice-form"
        :style="form.invoice == 2 ? 'height:580px':invoice_title_type==2?'height:335px':'height:210px'">
        <div class="title">发票抬头</div>
        <div class="invoice-list">
          <el-form v-if="form.invoice == 2" ref="form1" :model="invoiceForm" :rules="rules" label-width="130px"
            @submit.prevent="onSubmit">
            <el-form-item label="单位名称" prop="title">
              <el-input type="text" v-model="invoiceForm.title" placeholder="请输入单位名称" maxlength="40" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="税号" prop="taxpayer">
              <el-input type="text" v-model="invoiceForm.taxpayer" placeholder="请输入纳税人识别号" maxlength="30"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="bank">
              <el-input type="text" v-model="invoiceForm.bank" placeholder="请输入开户银行" maxlength="20" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="account">
              <el-input type="text" v-model="invoiceForm.account" placeholder="请输入银行账号" maxlength="20" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="单位地址" prop="company_address">
              <el-input type="text" v-model="invoiceForm.company_address" placeholder="请输入单位地址" maxlength="40"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="单位电话" prop="company_phone">
              <el-input type="text" v-model="invoiceForm.company_phone" placeholder="请输入单位电话" maxlength="20"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="收票人姓名" prop="name">
              <el-input type="text" v-model="invoiceForm.name" placeholder="请输入收票人姓名" maxlength="8" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="收票人手机" prop="phone">
              <el-input type="text" v-model="invoiceForm.phone" placeholder="请输入收票人手机号" maxlength="11" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="收票人邮箱" prop="email">
              <el-input type="text" v-model="invoiceForm.email" placeholder="用来接收电子发票邮件" maxlength="40" show-word-limit>
              </el-input>
            </el-form-item>
          </el-form>
          <el-form v-if="form.invoice == 1" ref="form1" :model="invoiceForm" :rules="rules" label-width="130px"
            @submit.prevent="onSubmit">
            <div v-if="invoice_title_type == 2 ">
              <el-form-item label="单位名称" prop="title">
                <el-input type="text" v-model="invoiceForm.title" placeholder="请输入单位名称" maxlength="40" show-word-limit>
                </el-input>
              </el-form-item>
              <el-form-item label="税号" prop="taxpayer">
                <el-input type="text" v-model="invoiceForm.taxpayer" placeholder="请输入纳税人识别号" maxlength="30"
                  show-word-limit></el-input>
              </el-form-item>
            </div>
            <el-form-item label="收票人姓名" prop="name">
              <el-input type="text" v-model="invoiceForm.name" placeholder="请输入收票人姓名" maxlength="8" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="收票人手机" prop="phone">
              <el-input type="text" v-model="invoiceForm.phone" placeholder="请输入收票人手机号" maxlength="11" show-word-limit>
              </el-input>
            </el-form-item>
            <el-form-item label="收票人邮箱" prop="email">
              <el-input type="text" v-model="invoiceForm.email" placeholder="用来接收电子发票邮件" maxlength="40" show-word-limit>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="invoice-content">
        <div class="title">
          <div>发票内容</div> <span>（发票内容选项已根据税法调整，具<br />体请以展示为准）</span>
        </div>
        <div class="contentDiv">
          <div>
            <label for="">发票内容:</label>
            <span>代理商账户充值</span>
          </div>
          <div class="recharge-amount">
            <label for="">充值金额:</label>
            <span>￥{{Number(form.orderAmount).toFixed(2)}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :disabled="disabled" @click="submitForm()">提交</el-button>
    </div>
  </div>
</template>
<script>
import uploadImg from "../../components/uploadImg";
import { applyRecharge } from "../../api/mangeCenter.js";
export default {
  components: {
    uploadImg
  },
  data() {
    //手机号验证
    var validatePhone = (rule, value, callback) => {
      var Regx = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/; //手机号正则
      if (value === "") {
        callback();
      } else if (!Regx.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    //电话验证
    var validatePhone1 = (rule, value, callback) => {
      var Regx = /^[0-9]+$/; //电话正则
      if (value === "") {
        callback();
      } else if (!Regx.test(value)) {
        callback(new Error("单位电话格式不正确"));
      } else {
        callback();
      }
    };
    //邮箱验证
    var validateEmail = (rule, value, callback) => {
      var Regx = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (value === "") {
        callback(new Error("请输入邮箱地址"));
      } else if (!Regx.test(value)) {
        callback(new Error("邮箱地址格式不正确"));
      } else {
        callback();
      }
    };
    //姓名验证
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else if (value.replace(/^\s*|\s*$/, "").length == 0) {
        callback(new Error("姓名不能为空"));
      } else if (
        value.replace(/^\s*|\s*$/, "").length < 2 ||
        value.replace(/^\s*|\s*$/, "").length > 8
      ) {
        callback(new Error("姓名长度在2-8个字符之间"));
      } else {
        callback();
      }
    };
    var validateAmount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入0-999999999的充值金额"));
      } else {
        callback();
      }
    };
    return {
      form: {
        orderAmount: "", //充值金额
        contactPhone: "", //联系电话1
        invoice: 0, //发票
        imgDetail: [], //付款凭据图片
        remark: "" // 备注说明
      },
      //发票类型
      invoiceType: ["无需发票", "普通发票", "增值税专用发票"],
      invoice: "无需发票", //默认无需发票
      //发票表单
      invoiceForm: {
        title: "", //单位名称
        name: "", //收票人姓名
        taxpayer: "", //税号
        bank: "", //开户银行
        account: "", //银行账号
        company_address: "", //单位地址
        company_phone: "", //单位电话
        phone: "", //收票人手机号
        email: "" //接收电子发票邮件
      },
      invoice_title_type: 1, //发票类型
      //验证规则
      rules: {
        contactPhone: [{ validator: validatePhone, trigger: "blur" }],
        orderAmount: [
          { required: true, validator: validateAmount, trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        company_phone: [
          { required: true, message: "请输入单位电话", trigger: "blur" },
          { required: true, validator: validatePhone1, trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入收票人姓名", trigger: "blur" }
        ],
        taxpayer: [{ required: true, message: "请输入税号", trigger: "blur" }],
        bank: [{ required: true, message: "请输入开户银行", trigger: "blur" }],
        account: [
          { required: true, message: "请输入银行账号", trigger: "blur" }
        ],
        company_address: [
          { required: true, message: "请输入单位地址", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入收票人手机号", trigger: "blur" },
          { required: true, validator: validatePhone, trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入单位名称", trigger: "blur" }]
      },
      disabled: false // 提交按钮是否可操作
    };
  },
  watch: {
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 监控发票类型 清除验证
     * @param {type}
     * @return:
     * @Date: 2019-10-25 17:35:28
     */
    "form.invoice": {
      deep: true,
      handler: function(val) {
        if (this.$refs.form1 !== undefined) {
          this.$refs.form1.clearValidate();
        }
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 监控发票抬头 清除验证
     * @param {type}
     * @return:
     * @Date: 2019-10-25 17:35:28
     */
    invoice_title_type: {
      deep: true,
      handler: function(val) {
        this.$refs.form1.clearValidate();
      }
    }
  },
  methods: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 输入充值金额验证
     * @param {type}
     * @return:
     * @Date: 2019-10-14 08:57:23
     */
    oninput(val) {
      val = val.replace(/[^\d]/g, ""); //清除"数字"以外的字符
      this.form.orderAmount = val;
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 上传图片 接口组件调用
     * @param {type}
     * @return:
     * @Date: 2019-09-29 19:12:43
     */
    checkImg(data) {
      this.form.imgDetail = data;
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 提交表单
     * @param {type}
     * @return:
     * @Date: 2019-09-12 11:26:29
     */
    submitForm() {
      var formData = {};
      if (this.form.invoice == 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            formData = {
              orderAmount: this.form.orderAmount * 100,
              contactPhone: this.form.contactPhone,
              evidence: JSON.stringify(this.form.imgDetail),
              needNote: 0,
              remark: this.form.remark,
              noteType: 1
            };
            this.applyRechargeSumbit(formData);
          } else {
            return false;
          }
        });
      } else if (this.form.invoice == 1) {
        this.$refs.form.validate(valid => {
          this.$refs.form1.validate(valid1 => {
            if (valid && valid1) {
              var head1 = this.invoice_title_type === 2 ? 1 : 2;
              formData = {
                orderAmount: this.form.orderAmount * 100,
                contactPhone: this.form.contactPhone,
                evidence: JSON.stringify(this.form.imgDetail),
                needNote: 1,
                noteType: 1,
                head: head1,
                remark: this.form.remark,
                receiverName: this.invoiceForm.name,
                receiverPhone: this.invoiceForm.phone,
                receiverEmail: this.invoiceForm.email,
                content: "代理商账户充值",
                amount: this.form.orderAmount * 100
              };
              if (head1 === 1) {
                this.$set(formData, "headName", this.invoiceForm.title);
                this.$set(formData, "taxFileNumber", this.invoiceForm.taxpayer);
              }
              this.applyRechargeSumbit(formData);
            } else {
              return false;
            }
          });
        });
      } else {
        this.$refs.form.validate(valid => {
          this.$refs.form1.validate(valid1 => {
            if (valid && valid1) {
              formData = {
                orderAmount: this.form.orderAmount * 100,
                contactPhone: this.form.contactPhone,
                evidence: JSON.stringify(this.form.imgDetail),
                needNote: 1,
                noteType: 2,
                remark: this.form.remark,
                headName: this.invoiceForm.title,
                content: "代理商账户充值",
                taxFileNumber: this.invoiceForm.taxpayer,
                bankName: this.invoiceForm.bank,
                bankAccount: this.invoiceForm.account,
                address: this.invoiceForm.company_address,
                telephone: this.invoiceForm.company_phone,
                amount: this.form.orderAmount * 100,
                receiverName: this.invoiceForm.name,
                receiverPhone: this.invoiceForm.phone,
                receiverEmail: this.invoiceForm.email
              };
              this.applyRechargeSumbit(formData);
            } else {
              return false;
            }
          });
        });
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 提交表单接口
     * @param {type}
     * @return:
     * @Date: 2019-10-11 17:28:37
     */
    applyRechargeSumbit(formData) {
      this.disabled = true;
      applyRecharge(formData).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.$router.go(-1);
          this.disabled = false;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
          this.disabled = false;
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 取消并返回
     * @param {type}
     * @return:
     * @Date: 2019-09-12 11:26:24
     */
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.el-textarea .el-input__count {
  line-height: 13px;
  background-color: #fff;
  bottom: 1px;
}
</style>
<style scoped lang="less">
.footer-btn {
  bottom: 0;
}
.apply-content {
  padding: 20px;
}
.invoice-detail {
  background: #f7f8fa;
  border-bottom: 55px solid #fff;
}
.invoice-form {
  display: -webkit-flex;
  display: flex;
  height: 392px;
  border: 1px solid #e5e5e5;
}
.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.invoice-form .title {
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 265px;
  height: 100%;
  border-right: 1px solid #e5e5e5;
}
.invoice-content {
  display: -webkit-flex;
  display: flex;
  border: 1px solid #e5e5e5;
  border-top: none;
}
.invoice-content .title {
  width: 255px;
  /* height: 110px; */
  padding: 22px 0 20px;
  line-height: 1;
  border-right: 1px solid #e5e5e5;
  text-align: center;
}
.invoice-content .title div {
  margin-bottom: 9px;
}
.invoice-content .title span {
  font-size: 12px;
  color: #808080;
  line-height: 20px;
  font-weight: normal;
}
.invoice-list {
  width: calc(100% - 200px);
  padding: 0 0;
}
.contentDiv {
  padding: 28px 0;
}
.contentDiv .recharge-amount {
  margin-top: 30px;
}
.contentDiv label {
  width: 130px;
  display: inline-block;
  text-align: right;
  padding-right: 12px;
  box-sizing: border-box;
}
.tip {
  margin-left: 18px;
  padding-left: 368px;
  color: #808080;
  font-size: 12px;
  margin-bottom: 20px;
}
.recharge_evidence {
  margin-bottom: 10px;
}
</style>