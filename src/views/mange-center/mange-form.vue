<!--
 * @Description: 管理中心/提交表单页面
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-25 15:53:44
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-11-12 14:11:21
 -->
<template>
  <div>
    <div class="ruleForm1 form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="380px" class="demo-ruleForm">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="ruleForm.customerName" placeholder="客户姓名长度不得小于2位" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="cardLoginUsername">
          <el-input v-model="ruleForm.cardLoginUsername" placeholder="请输入手机号" maxlength="11" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="ruleForm.companyName" placeholder="请输入企业名称" maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="关联员工" prop="relevanceEmployeeName">
          <p class="employee" v-if="showEmpList"><span class="fontEmp">{{ruleForm.relevanceEmployeeName}}</span><img
              src="../../assets/img/X@2x.png" @click="deleteEmp" v-if=" roleType == 2 " /></p>
          <p v-if="!showEmpList" class="selectEmployee" @click="selectEmp" :class=" 'showVat' ? 'showWarn' : ''"><img
              src="../../assets/img/add@2x.png" alt="" /></p>
          <span v-if="showVat" class="rulesvat">请选择关联员工</span>
        </el-form-item>
        <el-form-item label="选择服务类型" class="recharge_evidence" prop="orderType">
          <el-radio-group v-model="ruleForm.orderType">
            <el-radio :label=1>新购系统</el-radio>
            <el-radio :label=2>续费系统</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品信息" prop="productId" v-if="shopId ===''">
          <el-select v-model="ruleForm.productName" placeholder="请选择商品信息" style="width: 400px" @change="selectChange">
            <el-option v-for="(item, index) in productList" :key="index" :label="item.productName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop="productId" v-if="shopId !==''">
          <span>{{ruleForm.productName}}</span><span @click="upGrade" class="updateVersion">修改版本</span>
        </el-form-item>
        <el-form-item label="购买年限" prop="buyYears" class="yearWidth">
          <el-input-number v-model="ruleForm.buyYears" :min="1" :max="100" label="描述文字">
          </el-input-number><span style="padding-left: 5px;color:rgba(51,51,51,1);">年</span>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <span class="classAmount"
            v-if="ruleForm.orderType == 1">￥{{Number((buyPrice / 100) + (renewalPrice / 100 * (ruleForm.buyYears-1))).toFixed(2)}}</span>
          <span class="classAmount" v-else><span
              v-if="createProductId !==ruleForm.productId">￥{{Number((buyPrice / 100) + (renewalPrice / 100 * (ruleForm.buyYears-1))).toFixed(2)}}</span>
            <span class="classAmount"
              v-else>￥{{Number((renewalPrice / 100 * (ruleForm.buyYears))).toFixed(2)}}</span></span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="4" placeholder="请填写备注" v-model="ruleForm.remark" maxlength="200"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="付款凭据" class="recharge_evidence">
          <uploadImg @checkImg="checkImg"></uploadImg>
        </el-form-item>
        <div class="tip">大小不超过2M，最多上传3张</div>
        <el-form-item label="发票" prop="invoice">
          <el-select v-model="ruleForm.invoice" placeholder="请选择">
            <el-option v-for="(item,index) in invoiceType" :key='index' :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.invoice == 1">
          <el-radio-group v-model="invoice_title_type">
            <el-radio :label="1">个人</el-radio>
            <el-radio :label="2">单位</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="invoice-detail" v-if="ruleForm.invoice != 0">
        <div class="invoice-form"
          :style="ruleForm.invoice == 2 ? 'height:580px':invoice_title_type==2?'height:335px':'height:210px'">
          <div class="title">发票抬头</div>
          <div class="invoice-list">
            <el-form v-if="ruleForm.invoice == 2" ref="ruleForm1" :model="invoiceForm" :rules="rules"
              label-width="130px" @submit.prevent="onSubmit">
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
                <el-input type="text" v-model="invoiceForm.account" placeholder="请输入银行账号" maxlength="20"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="单位地址" prop="company_address">
                <el-input type="text" v-model="invoiceForm.company_address" placeholder="请输入单位地址" maxlength="40"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="单位电话" prop="company_phone">
                <el-input type="text" v-model="invoiceForm.company_phone" placeholder="请输入单位电话" maxlength="20"
                  show-word-limit>
                </el-input>
              </el-form-item>
              <el-form-item label="收票人姓名" prop="name">
                <el-input type="text" v-model="invoiceForm.name" placeholder="请输入收票人姓名" maxlength="8" show-word-limit>
                </el-input>
              </el-form-item>
              <el-form-item label="收票人手机" prop="phone">
                <el-input type="text" v-model="invoiceForm.phone" placeholder="请输入收票人手机号" maxlength="11"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="收票人邮箱" prop="email">
                <el-input type="text" v-model="invoiceForm.email" placeholder="用来接收电子发票邮件" maxlength="40"
                  show-word-limit></el-input>
              </el-form-item>
            </el-form>
            <el-form v-if="ruleForm.invoice == 1" ref="ruleForm1" :model="invoiceForm" :rules="rules"
              label-width="130px" @submit.prevent="onSubmit">
              <div v-if="invoice_title_type == 2 ">
                <el-form-item label="单位名称" prop="title">
                  <el-input type="text" v-model="invoiceForm.title" placeholder="请输入单位名称" maxlength="40"
                    show-word-limit></el-input>
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
                <el-input type="text" v-model="invoiceForm.phone" placeholder="请输入收票人手机号" maxlength="11"
                  show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="收票人邮箱" prop="email">
                <el-input type="text" v-model="invoiceForm.email" placeholder="用来接收电子发票邮件" maxlength="40"
                  show-word-limit></el-input>
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
              <span v-if="productName">{{productName}},{{ruleForm.buyYears}}年</span>
            </div>
            <div class="recharge-amount">
              <label for="">发票金额:</label>
              <span
                v-if="ruleForm.orderType == 1">￥{{Number((buyPrice / 100) + (renewalPrice / 100 * (ruleForm.buyYears-1))).toFixed(2)}}</span>
              <span v-else><span
                  v-if="createProductId !==ruleForm.productId">￥{{Number((buyPrice / 100) + (renewalPrice / 100 * (ruleForm.buyYears-1))).toFixed(2)}}</span>
                <span v-else>￥{{Number((renewalPrice / 100 * (ruleForm.buyYears))).toFixed(2)}}</span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :disabled="disabled" @click="save('ruleForm')">提交</el-button>
      </div>
    </div>
    <employee :show.sync="showEmps" @empName="empName"></employee>
    <el-dialog title="修改版本" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="formData">
        <el-form-item label="商品信息" prop="productId" style="width: 600px;">
          <el-select v-model="formData.productId" placeholder="请选择商品信息" @change="selectChange1">
            <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="waining">
            修改商品信息，该客户的系统版本和系统有效时间将重新进行<br />
            <span class="move">计算并扣费，之前版本剩余金额将返还到代理商账户。</span>
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUp">取 消</el-button>
        <el-button type="primary" @click="checkProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import employee from "../../components/employee.vue";
import { findProductList, getProductData } from "../../api/product.js";
import uploadImg from "../../components/uploadImg";
import { validateScaleInteger } from "../../assets/js/form_validate.js";
import {
  findShopByPhone,
  submitFormGetMoney,
  submitForm
} from "../../api/employee.js";
import { checkRenewal, checkPhone } from "../../api/shop";
export default {
  components: {
    employee: employee, //员工列表弹窗组件
    uploadImg
  },
  data() {
    //电话验证
    var validatePhone2 = (rule, value, callback) => {
      var Regx = /^[0-9]+$/; //电话正则
      if (value === "") {
        callback();
      } else if (!Regx.test(value)) {
        callback(new Error("单位电话格式不正确"));
      } else {
        callback();
      }
    };
    //验证用户姓名
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户姓名"));
      } else if (value.length < 2) {
        callback(new Error("客户姓名长度不得小于2位"));
      } else {
        callback();
      }
    };
    //验证电话号 以及获取此电话号码可能存在的相关联数据
    var validatePhone = (rule, value, callback) => {
      let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!reg.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else if (this.smsMsg) {
        callback(new Error(this.smsMsg));
      } else {
        callback();
      }
    };
    //验证电话号 以及获取此电话号码可能存在的相关联数据
    var validatePhone1 = (rule, value, callback) => {
      let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      if (!reg.test(value)) {
        callback(new Error("手机号格式不正确"));
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
    return {
      showVat: false, //是否显示提示
      showEmps: false, //是否展示员工弹窗
      dialogVisible: false, //修改版本弹窗控制
      shopId: "", //店铺ID
      productName: "", //商品名称
      //表单信息
      ruleForm: {
        customerName: "", //客户姓名
        cardLoginUsername: "", //手机号
        companyName: "", //企业名称
        productId: "", //产品id
        productName: "", //商品名称
        buyYears: 1, //购买年份
        detailImg: [], //付款凭据
        relevanceEmployeeId: JSON.parse(localStorage.getItem("token")).empId, //员工id
        relevanceEmployeeName: JSON.parse(localStorage.getItem("token"))
          .username, //员工姓名
        invoice: 0, //发票
        orderType: 1, //选择服务类型
        amount: 0, //金额
        remark: "" //备注
      },
      formData: {
        productName: "", //商品名称
        productId: "" //商品id
      },
      buyPrice: "", //商品单价
      renewalPrice: "", //商品续费价格
      roleType: JSON.parse(localStorage.getItem("token")).roleType, //登录用户角色
      productPrice: 0, //商品价格
      showEmpList: true, //展示添加员工按钮
      productList: [], //商品列表
      createProductId: "", //已存在的商品
      //发票类型
      invoiceType: ["无需发票", "普通发票", "增值税专用发票"], //发票类型选择
      invoice: "无需发票", //默认无需发票
      smsMsg: "", //验证信息
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
        customerName: [
          {
            required: true,
            validator: validateName,
            trigger: "blur"
          }
        ],
        cardLoginUsername: [
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        companyName: [
          {
            required: true,
            message: "请输入企业名称",
            trigger: "blur"
          }
        ],
        productId: [
          {
            required: true,
            message: "请选择商品信息",
            trigger: "change"
          }
        ],
        buyYears: [
          { required: true, validator: validateScaleInteger, trigger: "blur" }
        ],
        relevanceEmployeeName: [
          { required: true, message: " ", trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        company_phone: [
          { required: true, message: "请输入单位电话", trigger: "blur" },
          { required: true, validator: validatePhone2, trigger: "blur" }
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
          { required: true, validator: validatePhone1, trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入单位名称", trigger: "blur" }]
      },
      disabled: false // 确定按钮是否可操作
    };
  },
  /**
   * @author: 郭亮（849324068@qq.com）
   * @description: 初始化数据
   * @param {type}
   * @return:
   * @Date: 2019-09-25 09:49:04
   */
  created() {
    this.loadProduct();
    if (this.$route.query.productId) {
      this.ruleForm.productName = this.$route.query.productName;
      this.productName = this.$route.query.productName;
      this.ruleForm.productId = this.$route.query.productId;
      let data = {
        productId: this.ruleForm.productId
      };
      getProductData(data).then(res => {
        if (res.code === 200) {
          this.buyPrice = res.data.buyPrice;
          this.renewalPrice = res.data.renewalPrice;
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  watch: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 监控电话号码 当电话号码为空或小于11位且shopid存在时 清除所有数据
     * @param {type}
     * @return:
     * @Date: 2019-10-08 16:56:19
     */
    "ruleForm.cardLoginUsername": {
      deep: true,
      handler: function(val) {
        if ((val === "" || val.length < 11) && this.shopId) {
          this.ruleForm.customerName = "";
          this.ruleForm.companyName = "";
          this.ruleForm.productId = "";
          this.ruleForm.productName = "";
          this.ruleForm.amount = 0;
          this.shopId = "";
        } else if (val.length === 11) {
          this.validatePhoneNumber(this.ruleForm.orderType);
        }
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 监控商品id 变化取金额
     * @param {type}
     * @return:
     * @Date: 2019-10-08 16:56:19
     */
    "ruleForm.productId": {
      deep: true,
      handler: function(val) {
        if (val !== "") {
          this.getMoneyData();
        }
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 监控购买年限 变化取金额
     * @param {type}
     * @return:
     * @Date: 2019-10-08 16:56:19
     */
    "ruleForm.buyYears": {
      deep: true,
      handler: function(val) {
        if (val !== "" && this.ruleForm.productId) {
          this.getMoneyData();
        }
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 监控服务类型
     * @param {type}
     * @return:
     * @Date: 2019-10-12 17:15:22
     */
    "ruleForm.orderType": {
      deep: true,
      handler: function(val) {
        this.validatePhoneNumber(val);
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 监控发票类型 清除验证
     * @param {type}
     * @return:
     * @Date: 2019-10-25 17:35:28
     */
    "ruleForm.invoice": {
      deep: true,
      handler: function(val) {
        if (this.$refs.ruleForm1 !== undefined) {
          this.$refs.ruleForm1.clearValidate();
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
        this.$refs.ruleForm1.clearValidate();
      }
    }
  },
  methods: {
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 电话号码测试
     * @param {type}
     * @return:
     * @Date: 2019-10-22 16:28:49
     */
    validatePhoneNumber(val) {
      let dataPhone = {
        phone: this.ruleForm.cardLoginUsername
      };
      if (val === 2) {
        checkRenewal(dataPhone).then(res0 => {
          if (res0.code === 200) {
            if (res0.data === 2) {
              this.smsMsg = "该手机号店铺未绑定当前代理商";
              if (this.smsMsg) {
                this.$refs.ruleForm.validateField("cardLoginUsername");
              }
            } else if (res0.data === 3) {
              this.smsMsg = "该手机号店铺未绑定当前代理商";
              if (this.smsMsg) {
                this.$refs.ruleForm.validateField("cardLoginUsername");
              }
            } else {
              findShopByPhone(dataPhone).then(res1 => {
                if (res1.code === 200) {
                  this.shopId = res1.data.id;
                  this.ruleForm.customerName = res1.data.customerName;
                  this.ruleForm.companyName = res1.data.companyName;
                  this.ruleForm.productId = res1.data.productId;
                  this.createProductId = res1.data.productId;
                  this.ruleForm.productName = res1.data.productName;
                  this.productName = res1.data.productName;
                  this.$refs.ruleForm.clearValidate();
                  this.getMoneyData();
                  let data = {
                    productId: this.ruleForm.productId
                  };
                  getProductData(data).then(res => {
                    if (res.code === 200) {
                      this.buyPrice = res.data.buyPrice;
                      this.renewalPrice = res.data.renewalPrice;
                    } else {
                      this.$message.error(res.msg);
                    }
                  });
                  this.smsMsg = "";
                } else {
                  this.smsMsg = res1.msg;
                  if (this.smsMsg) {
                    this.$refs.ruleForm.validateField("cardLoginUsername");
                    this.smsMsg = "";
                  }
                }
              });
            }
          } else {
            this.smsMsg = res0.msg;
            if (this.smsMsg) {
              this.$refs.ruleForm.validateField("cardLoginUsername");
              this.smsMsg = "";
            }
          }
        });
      } else {
        if (this.shopId) {
          this.ruleForm.customerName = "";
          this.ruleForm.companyName = "";
          this.ruleForm.productId = "";
          this.ruleForm.productName = "";
          this.ruleForm.amount = 0;
          this.shopId = "";
        }
        this.$refs.ruleForm.clearValidate("cardLoginUsername");
        let dataTelephone = {
          cardLoginUsername: this.ruleForm.cardLoginUsername
        };
        if (this.ruleForm.cardLoginUsername.length === 11) {
          checkPhone(dataTelephone).then(res => {
            if (res.code === 200) {
              if (res.data === 2) {
                this.smsMsg = "该手机号已开通店铺，请重新输入";
                if (this.smsMsg) {
                  this.$refs.ruleForm.validateField("cardLoginUsername");
                }
              } else {
                this.smsMsg = "";
              }
            } else {
              this.smsMsg = res.msg;
              if (this.smsMsg) {
                this.$refs.ruleForm.validateField("cardLoginUsername");
                this.smsMsg = "";
              }
            }
          });
        } else {
          this.smsMsg = "手机号格式不正确";
          if (this.smsMsg) {
            this.$refs.ruleForm.validateField("cardLoginUsername");
          }
        }
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 获取金额
     * @param {type}
     * @return:
     * @Date: 2019-09-25 21:05:39
     */
    getMoneyData() {
      let params = {
        customerName: this.ruleForm.customerName,
        cardLoginUsername: this.ruleForm.cardLoginUsername,
        companyName: this.ruleForm.companyName,
        productId: this.ruleForm.productId,
        buyYears: this.ruleForm.buyYears,
        relevanceEmployeeId: this.ruleForm.relevanceEmployeeId
      };
      if (this.ruleForm.orderType === 2 && this.shopId) {
        var dataAmount = {
          serviceType: 2,
          id: this.shopId
        };
      } else {
        dataAmount = {
          serviceType: 1
        };
      }
      Object.assign(params, dataAmount);
      submitFormGetMoney(params).then(res => {
        if (res.code === 200) {
          this.ruleForm.amount = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 修改版本控制
     * @param {type}
     * @return:
     * @Date: 2019-09-25 21:05:39
     */
    upGrade() {
      this.dialogVisible = true;
      this.formData.productName = this.productName;
      this.formData.productName = this.ruleForm.productName;
      let data = {
        productId: this.ruleForm.productId
      };
      getProductData(data).then(res => {
        if (res.code === 200) {
          if (res.data.productStatus == "1") {
            this.formData.productId = this.ruleForm.productId;
          } else {
            this.formData.productId = "";
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 取消修改版本
     * @param {type}
     * @return:
     * @Date: 2019-09-26 17:14:23
     */
    cancelUp() {
      this.dialogVisible = false;
      this.$refs.formData.resetFields();
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 商品信息 开通年限 绑定变化
     * @param {type}
     * @return:
     * @Date: 2019-09-25 21:05:54
     */
    checkProduct() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          this.productName = this.formData.productName;
          this.ruleForm.productName = this.formData.productName;
          this.ruleForm.productId = this.formData.productId;
        } else {
          console.log("error submit!!");
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
      this.ruleForm.detailImg = data;
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 验证是否关联员工
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:09:52
     */
    watchEmp() {
      this.ruleForm.relevanceEmployeeName === ""
        ? (this.showVat = true)
        : (this.showVat = false);
    },

    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 显示选择员工弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-16 11:00:36
     */
    selectEmp() {
      this.showEmps = true;
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 保存选择的员工
     * @param {type} data
     * @return:
     * @Date: 2019-09-17 10:55:14
     */
    empName(data) {
      if (data === "") {
        this.$message({
          message: "请选择一名员工",
          type: "warning",
          customClass: "zZindex"
        });
        this.showEmps = true;
        return;
      } else {
        this.showEmps = false;
        this.showEmpList = true;
        this.ruleForm.relevanceEmployeeName = data.empName;
        this.ruleForm.relevanceEmployeeId = data.id;
        this.watchEmp();
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 商品信息列表
     * @param {type}
     * @return:
     * @Date: 2019-09-19 10:58:32
     */
    loadProduct() {
      let that = this;
      let params = {
        productStatus: "1"
      };
      findProductList(params).then(res => {
        if (res.code === 200) {
          that.productList = res.data.list;
        } else {
          that.$message({ message: res.msg, type: "error" });
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 選中商品後 獲取商品id 商品价格
     * @param {type}
     * @return:
     * @Date: 2019-09-19 11:15:49
     */
    selectChange(value) {
      let that = this;
      that.ruleForm.productId = value;
      let data = {
        productId: value
      };
      getProductData(data).then(res => {
        if (res.code === 200) {
          that.productName = res.data.productName;
          that.buyPrice = res.data.buyPrice;
          that.renewalPrice = res.data.renewalPrice;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: dialog弹出窗口 選中商品後 獲取商品id 商品价格
     * @param {type}
     * @return:
     * @Date: 2019-09-19 11:15:49
     */
    selectChange1(value) {
      let that = this;
      let data = {
        productId: value
      };
      getProductData(data).then(res => {
        if (res.code === 200) {
          that.formData.productName = res.data.productName;
          that.buyPrice = res.data.buyPrice;
          that.renewalPrice = res.data.renewalPrice;
          this.$refs.formData.clearValidate();
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 提交表单
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:55:37
     */
    save(ruleForm) {
      var formData = {};
      if (this.ruleForm.invoice == 0) {
        this.$refs[ruleForm].validate(valid => {
          if (valid) {
            formData = {
              id: this.shopId,
              customerName: this.ruleForm.customerName,
              cardLoginUsername: this.ruleForm.cardLoginUsername,
              companyName: this.ruleForm.companyName,
              productId: this.ruleForm.productId,
              buyYears: this.ruleForm.buyYears,
              relevanceEmployeeId: this.ruleForm.relevanceEmployeeId,
              paymentVoucherPicUrl: JSON.stringify(this.ruleForm.detailImg),
              remark: this.ruleForm.remark,
              serviceType: this.ruleForm.orderType,
              receipt: 1
            };
            this.submitFormInterface(formData);
          } else {
            return false;
          }
        });
      } else if (this.ruleForm.invoice == 1) {
        this.$refs[ruleForm].validate(valid => {
          this.$refs.ruleForm1.validate(valid1 => {
            if (valid && valid1) {
              var head1 = this.invoice_title_type == 2 ? 1 : 2;
              formData = {
                id: this.shopId,
                customerName: this.ruleForm.customerName,
                cardLoginUsername: this.ruleForm.cardLoginUsername,
                companyName: this.ruleForm.companyName,
                productId: this.ruleForm.productId,
                buyYears: this.ruleForm.buyYears,
                relevanceEmployeeId: this.ruleForm.relevanceEmployeeId,
                paymentVoucherPicUrl: JSON.stringify(this.ruleForm.detailImg),
                remark: this.ruleForm.remark,
                serviceType: this.ruleForm.orderType,
                noteType: 1,
                head: head1,
                receiverName: this.invoiceForm.name,
                receiverPhone: this.invoiceForm.phone,
                receiverEmail: this.invoiceForm.email,
                content: this.productName + "," + this.ruleForm.buyYears + "年",
                amount:
                  this.ruleForm.orderType == 1
                    ? this.buyPrice +
                      this.renewalPrice * (this.ruleForm.buyYears - 1)
                    : this.createProductId !== this.ruleForm.productId
                    ? this.buyPrice +
                      this.renewalPrice * (this.ruleForm.buyYears - 1)
                    : this.renewalPrice * this.ruleForm.buyYears,
                receipt: 2
              };
              if (this.invoice_title_type == 2) {
                this.$set(formData, "headName", this.invoiceForm.title);
                this.$set(formData, "taxFileNumber", this.invoiceForm.taxpayer);
              }
              this.submitFormInterface(formData);
            } else {
              return false;
            }
          });
        });
      } else {
        this.$refs[ruleForm].validate(valid => {
          this.$refs.ruleForm1.validate(valid1 => {
            if (valid && valid1) {
              formData = {
                id: this.shopId,
                customerName: this.ruleForm.customerName,
                cardLoginUsername: this.ruleForm.cardLoginUsername,
                companyName: this.ruleForm.companyName,
                productId: this.ruleForm.productId,
                buyYears: this.ruleForm.buyYears,
                relevanceEmployeeId: this.ruleForm.relevanceEmployeeId,
                paymentVoucherPicUrl: JSON.stringify(this.ruleForm.detailImg),
                remark: this.ruleForm.remark,
                serviceType: this.ruleForm.orderType,
                noteType: 2,
                headName: this.invoiceForm.title,
                content: this.productName + "," + this.ruleForm.buyYears + "年",
                amount:
                  this.ruleForm.orderType == 1
                    ? this.buyPrice +
                      this.renewalPrice * (this.ruleForm.buyYears - 1)
                    : this.createProductId !== this.ruleForm.productId
                    ? this.buyPrice +
                      this.renewalPrice * (this.ruleForm.buyYears - 1)
                    : this.renewalPrice * this.ruleForm.buyYears,
                taxFileNumber: this.invoiceForm.taxpayer,
                bankName: this.invoiceForm.bank,
                bankAccount: this.invoiceForm.account,
                address: this.invoiceForm.company_address,
                telephone: this.invoiceForm.company_phone,
                receiverName: this.invoiceForm.name,
                receiverPhone: this.invoiceForm.phone,
                receiverEmail: this.invoiceForm.email,
                receipt: 3
              };
              this.submitFormInterface(formData);
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
     * @Date: 2019-10-11 17:33:12
     */
    submitFormInterface(formData) {
      submitForm(formData).then(res => {
        this.disabled = true;
        if (res.code === 200) {
          this.disabled = false;
          this.$message({
            type: "success",
            message: res.msg
          });
          this.$router.go(-1);
        } else {
          this.disabled = false;
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 重置表单
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:56:23
     */
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 删除关联员工
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:56:44
     */
    deleteEmp() {
      this.showEmpList = false;
      this.ruleForm.relevanceEmployeeName = "";
      this.watchEmp();
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 取消按钮跳转页面
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:57:00
     */
    cancel() {
      this.resetForm();
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.demo-ruleForm {
  .yearWidth {
    .el-input__inner {
      width: 180px !important;
    }
  }
  .zZindex {
    z-index: 3000 !important;
  }
  .el-textarea .el-input__count {
    line-height: 13px;
    background-color: #fff;
    bottom: 7px;
  }
}
.yearWidth {
  .el-input {
    width: 180px !important;
  }
}
</style>
<style lang="less" scoped>
.recharge_evidence {
  margin-bottom: 10px;
}

.banner-uploader-icon {
  font-size: 44px;
  color: rgba(229, 229, 229, 1);
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 4px;
  line-height: 120px;
  text-align: center;
}

.tip {
  margin-left: 18px;
  padding-left: 368px;
  color: #808080;
  font-size: 12px;
  margin-bottom: 20px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.employee {
  display: inline-block;
  cursor: pointer;
  padding: 0 14px;
  height: 40px;
  background: rgba(223, 237, 254, 1);
  border: 1px solid rgba(77, 161, 255, 0.5);
  border-radius: 4px;
  align-items: center;
  color: rgba(77, 161, 255, 1);
  text-align: center;
  img {
    width: 10px;
    height: 10px;
    cursor: pointer;
  }
}

.fontEmp {
  padding-right: 10px;
  width: 42px;
  height: 12px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(77, 161, 255, 1);
}
.selectEmployee {
  width: 90px;
  height: 40px;
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 4px;
  line-height: 40px;
  align-items: center;
  text-align: center;
  cursor: pointer;
  img {
    width: 14px;
    height: 14px;
  }
}
.rulesvat {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  display: flex;
  margin-top: 2px;
}
.updateVersion {
  padding-left: 10px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(77, 161, 255, 1);
  cursor: pointer;
}
.footer-btn {
  bottom: 0;
}
.showWarn {
  border: 1px solid #f56c6c;
  cursor: pointer;
}
.waining {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  position: relative;
  left: 42px;
  .move {
    position: relative;
    top: -15px;
  }
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
  width: 264px;
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
  width: 254px;
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
.classAmount {
  height: 15px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(255, 123, 140, 1);
}
</style>