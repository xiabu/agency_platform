<!--
 * @Description: 店铺管理模块 开通账号 、修改页面
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-11 17:07:36
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-11-20 11:49:33
 -->
<template>
  <div>
    <div class="ruleForm1 form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="245px" class="demo-ruleForm">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="ruleForm.customerName" placeholder="客户姓名长度不得小于2位" maxlength="8" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="cardLoginUsername">
          <el-input v-model="ruleForm.cardLoginUsername" placeholder="请输入登录账号" autocomplete="new-password"
            maxlength="11" show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item label="登录密码" :prop="!editShow ?'':'cardLoginPassword'">
          <el-input type="password" maxlength="16" v-model="ruleForm.cardLoginPassword" autocomplete="new-password"
            placeholder="请输入8-16位的密码长度" :disabled="!editShow"></el-input>
          <span class="updatePass" v-if="!editShow" @click="updateSignPassword">修改</span>
        </el-form-item>
        <el-form-item label="确认登录密码" prop="checkPass" v-if="editShow">
          <el-input type="password" maxlength="16" v-model="ruleForm.checkPass" autocomplete="new-pwd"
            placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="ruleForm.companyName" placeholder="请输入企业名称" maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="商品信息" prop="productName" v-if="editShow">
          <el-select v-model="ruleForm.productName" placeholder="请选择商品信息" style="width: 400px" @change="selectChange">
            <el-option v-for="(item, index) in productList" :key="index" :label="item.productName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop="productName" v-if="!editShow">
          <span>{{ruleForm.productName}}</span><span @click="upGrade" class="updatePass"
            v-if="ruleForm.roleType == 1 ? false : true">修改版本</span>
        </el-form-item>
        <el-form-item label="购买年限" prop="buyYears" class="yearWidth" v-if="editShow">
          <el-input-number v-model="ruleForm.buyYears" :min="1" :max="100" label="描述文字">
          </el-input-number><span style="padding-left: 5px;color:rgba(51,51,51,1);">年</span>
        </el-form-item>
        <el-form-item label="付款凭据" class="recharge_evidence" v-if="editShow">
          <uploadImg @checkImg="checkImg"></uploadImg>
        </el-form-item>
        <div class="tip" v-if="editShow">大小不超过2M，最多上传3张</div>
        <el-form-item label="有效时间" prop="effectiveTime" required v-if="!editShow">
          <p>{{ruleForm.effectiveTime}}</p>
        </el-form-item>
        <el-form-item label="关联员工" prop="relevanceEmployeeName">
          <p class="employee" v-if="showEmpList"><span class="fontEmp">{{ruleForm.relevanceEmployeeName}}</span><img
              src="../../assets/img/X@2x.png" @click="deleteEmp" v-if="ruleForm.roleType == 1 ? false : true" /></p>
          <p v-if="!showEmpList" class="selectEmployee" @click="selectEmp" :class=" 'showVat' ? 'showWarn' : ''"><img
              src="../../assets/img/add@2x.png" alt="" /></p>
          <span v-if="showVat" class="rulesvat">请选择关联员工</span>
        </el-form-item>
      </el-form>
      <div class="footer-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :disabled="isDisable" @click="save('ruleForm')">保存</el-button>
      </div>
    </div>
    <employee :show.sync="showEmps" @empName="empName"></employee>
    <payPassword :effectiveTime.sync="effectiveTime" :productName.sync="productName" :productPrice.sync="productPrice"
      :show.sync="dialogVisible" :typeOfSubmit.sync="typeOfSubmit" :passwordOne.sync="passwordOne">
    </payPassword>
    <updatePassword :show1.sync="dialogVisible1" @updatedPaw="updatedPaw"></updatePassword>
    <el-dialog title="修改版本" :visible.sync="dialogVisible2" :close-on-click-modal="false">
      <el-form :model="formData" :rules="rules" ref="formData">
        <el-form-item v-if="showYear">
          <span class="waining"><img src="../../assets/img/warning@3x.png" />
            修改商品信息，该客户的系统版本和系统有效时间将重新进行<br />
            <span class="move">计算并扣费，之前版本剩余金额将返还到代理商账户。</span>
          </span>
        </el-form-item>
        <el-form-item label="商品信息" prop="productName" style="width: 600px;">
          <el-select v-model="formData.productId" placeholder="请选择商品信息" @change="selectChange1">
            <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买年限" prop="buyYears" class="yearWidth" v-if="showYear">
          <el-input-number v-model="formData.buyYears" :min="1" :max="100">
          </el-input-number><span style="padding-left: 5px;color:rgba(51,51,51,1);">年</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUp">取 消</el-button>
        <el-button type="primary" @click="checkProduct('formData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import employee from "../../components/employee.vue";
import payPassword from "../../components/payPassword.vue";
import updatePassword from "../../components/updatePassword.vue";
import { findProductList, getProductData } from "../../api/product.js";
import uploadImg from "../../components/uploadImg";
import {
  getMoney,
  shopFindOne,
  updateShop,
  checkPhone
} from "../../api/shop.js";
import { validateScaleInteger } from "../../assets/js/form_validate.js";
export default {
  components: {
    employee: employee, //员工列表弹窗组件
    payPassword: payPassword, //支付密码弹窗组件
    updatePassword: updatePassword, //修改密码弹窗
    uploadImg
  },
  data() {
    //验证用户姓名
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户姓名"));
      } else if (value.length < 2) {
        callback(new Error("客户姓名长度不得小于2"));
      } else {
        callback();
      }
    };
    //验证登录账号
    var validatePhone = (rule, value, callback) => {
      let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      if (value === "") {
        callback(new Error("请输入登录账号"));
      } else if (!reg.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else if (value != "" && reg.test(value) && value !== this.createPhone) {
        let params = {
          cardLoginUsername: value
        };
        if (this.shopId) {
          this.$set(params, "shopId", this.shopId);
        }
        checkPhone(params).then(res => {
          if (res.code === 200) {
            if (res.data === 1) {
              callback();
            } else {
              callback(new Error("该账号已开通店铺，请重新输入"));
            }
          }
        });
      } else {
        callback();
      }
    };
    //验证密码是否填写
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入登录密码"));
      } else if (value.length < 8 || value.length > 16) {
        callback(new Error("请输入8-16位的密码长度"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    //验证密码是否填写与初次对应
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入登录密码"));
      } else if (value !== this.ruleForm.cardLoginPassword) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      isDisable: false, //是否禁用提交按钮
      effectiveTime: "", //有效时间
      productName: "", //商品名称
      showVat: false, //是否显示提示
      showEmps: false, //是否展示员工弹窗
      dialogVisible: false, //是否展示支付密码弹窗
      dialogVisible1: false, //是否展示修改密码弹窗
      dialogVisible2: false, //是否展示修改商品类型是购买年限
      typeOfSubmit: true, //支付组件提示语变化
      editShow: false, //区分添加还是编辑
      showYear: false, //修改页面下 是否显示年限
      createProductId: "", //初始商品id
      createYear: "", //初始年限
      createPhone: "", //初始电话
      //表单信息
      ruleForm: {
        customerName: "", //客户姓名
        cardLoginUsername: "", //电话账号
        cardLoginPassword: "", //登录密码
        checkPass: "", //再次输入密码
        companyName: "", //企业名称
        productId: "", //产品id
        productName: "", //商品名称
        buyYears: 1, //购买年份
        detailImg: [], //付款凭据
        relevanceEmployeeId: JSON.parse(localStorage.getItem("token")).empId, //员工id
        effectiveTime: "", //激活期限
        relevanceEmployeeName: JSON.parse(localStorage.getItem("token"))
          .username, //员工姓名
        roleType: JSON.parse(localStorage.getItem("token")).roleType //角色信息
      },
      formData: {
        productName: "", //商品名称
        buyYears: 1, //购买年份
        productId: "" //商品id
      },
      productPrice: 0, //商品价格
      showEmpList: true, //展示添加员工按钮
      productList: [], //商品列表
      shopId: "", //店铺Id
      passwordOne: {}, //支付密码窗口调用数据
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
        cardLoginPassword: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            required: true,
            validator: validatePass2,
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
        productName: [
          { required: true, message: "请选择商品信息", trigger: "change" }
        ],
        buyYears: [
          { required: true, validator: validateScaleInteger, trigger: "blur" }
        ],
        relevanceEmployeeName: [
          { required: true, message: " ", trigger: "blur" }
        ]
      }
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
    this.shopId = this.$route.params.shopId;
    this.shopId ? (this.editShow = false) : (this.editShow = true);
    this.shopId ? (this.typeOfSubmit = false) : (this.typeOfSubmit = true);
    if (!this.editShow) {
      this.getShopData();
    }
  },
  methods: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 修改版本控制
     * @param {type}
     * @return:
     * @Date: 2019-09-25 21:05:39
     */
    upGrade() {
      this.dialogVisible2 = true;
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
            this.formData.productName = "";
            this.showYear = false;
            this.$refs.formData.clearValidate();
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 商品信息 开通年限 绑定变化
     * @param {type}
     * @return:
     * @Date: 2019-09-25 21:05:54
     */
    checkProduct(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.dialogVisible2 = false;
          this.ruleForm.productName = this.formData.productName;
          if (this.showYear) {
            this.ruleForm.buyYears = this.formData.buyYears;
            this.ruleForm.effectiveTime =
              this.currentDate() +
              " - " +
              this.currentDateLater(this.ruleForm.buyYears);
          }
          this.ruleForm.productId = this.formData.productId;
          if (this.createProductId === this.ruleForm.productId) {
            this.ruleForm.effectiveTime = this.createYear;
          }
          this.effectiveTime = this.ruleForm.effectiveTime;
          this.productName = this.ruleForm.productName;
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
     * @description: 取消修改版本
     * @param {type}
     * @return:
     * @Date: 2019-09-26 17:14:23
     */
    cancelUp() {
      this.dialogVisible2 = false;
      if (!this.formData.productId) {
        this.showYear = false;
        this.$refs.formData.clearValidate();
      }
      if (this.ruleForm.productId == this.createProductId) {
        this.showYear = false;
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 获取当前时间并格式化时间
     * @param {type}
     * @return:
     * @Date: 2019-09-25 16:31:11
     */
    currentDate() {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 修改年限后的日期
     * @param {type}
     * @return:
     * @Date: 2019-09-25 17:14:15
     */
    currentDateLater(buyYears) {
      var date = new Date();
      var y = date.getFullYear() + buyYears;
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
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
     * @description: 修改密码弹窗控制
     * @param {type}
     * @return:
     * @Date: 2019-09-17 14:28:07
     */
    updateSignPassword() {
      this.dialogVisible1 = true;
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
     * @description: 修改密码返回值
     * @param {type}
     * @return:
     * @Date: 2019-09-25 20:33:11
     */
    updatedPaw(data) {
      if (data === "") {
        this.$message({
          message: "密码不能为空",
          type: "warning",
          customClass: "zZindex"
        });
        this.dialogVisible1 = true;
        return;
      } else {
        this.dialogVisible1 = false;
        this.ruleForm.cardLoginPassword = data;
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
     * @description: 点击修改店铺的回显接口请求
     * @param {type}
     * @return:
     * @Date: 2019-09-26 14:41:25
     */
    getShopData() {
      let params = {
        shopId: this.shopId
      };
      shopFindOne(params).then(res => {
        if (res.code === 200) {
          this.ruleForm.customerName = res.data.customerName;
          this.ruleForm.cardLoginUsername = res.data.cardLoginUsername;
          this.ruleForm.cardLoginPassword = "........";
          this.ruleForm.companyName = res.data.companyName;
          this.ruleForm.productId = res.data.productId;
          this.ruleForm.relevanceEmployeeId = res.data.relevanceEmployeeId;
          this.ruleForm.productName = res.data.productName;
          this.ruleForm.relevanceEmployeeName = res.data.relevanceEmployeeName;
          let beginTime = res.data.beginTime.substring(0, 10);
          let endTime = res.data.endTime.substring(0, 10);
          this.ruleForm.effectiveTime = beginTime + " - " + endTime;
          this.createProductId = res.data.productId;
          this.createYear = beginTime + " - " + endTime;
          this.createPhone = res.data.cardLoginUsername;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
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
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: dialog弹出窗口 選中商品後 獲取商品id 商品价格
     * @param {type}
     * @return:
     * @Date: 2019-09-19 11:15:49
     */
    selectChange1(value) {
      let data = {
        productId: value
      };
      getProductData(data).then(res => {
        if (res.code === 200) {
          this.formData.productName = res.data.productName;
          this.$refs.formData.clearValidate();
        } else {
          this.$message.error(res.msg);
        }
      });
      if (
        this.formData.productId !== this.ruleForm.productId &&
        this.formData.productId !== this.createProductId
      ) {
        this.showYear = true;
      } else {
        this.showYear = false;
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 提交表单
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:55:37
     */
    save(ruleForm) {
      let _this = this;
      _this.watchEmp();
      _this.isDisable = true; //开始可以点击
      _this.$refs[ruleForm].validate(valid => {
        if (valid) {
          _this.getMoneyData();
          if (_this.shopId === undefined) {
            _this.dialogVisible = true;
          } else {
            if (_this.showYear) {
              _this.dialogVisible = true;
            } else {
              let params = {
                customerName: _this.ruleForm.customerName,
                cardLoginUsername: _this.ruleForm.cardLoginUsername,
                cardLoginPassword:
                  _this.ruleForm.cardLoginPassword === "........"
                    ? ""
                    : _this.ruleForm.cardLoginPassword,
                companyName: _this.ruleForm.companyName,
                productId: _this.ruleForm.productId,
                buyYears: _this.ruleForm.buyYears,
                relevanceEmployeeId: _this.ruleForm.relevanceEmployeeId,
                id: _this.shopId
              };
              updateShop(params).then(res => {
                this.isDisable = false; //执行请求后就不能点击了
                if (res.code === 200) {
                  _this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  _this.$router.push("/shop");
                } else {
                  _this.$message({
                    message: res.msg,
                    type: "error"
                  });
                }
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 获取支付金额
     * @param {type}
     * @return:
     * @Date: 2019-09-24 20:53:22
     */
    getMoneyData() {
      let _this = this;
      var dataMoney = {
        customerName: _this.ruleForm.customerName,
        cardLoginUsername: _this.ruleForm.cardLoginUsername,
        cardLoginPassword:
          _this.ruleForm.cardLoginPassword === "........"
            ? ""
            : _this.ruleForm.cardLoginPassword,
        companyName: _this.ruleForm.companyName,
        productId: _this.ruleForm.productId,
        buyYears: _this.ruleForm.buyYears,
        relevanceEmployeeId: _this.ruleForm.relevanceEmployeeId
      };
      getMoney(dataMoney).then(res => {
        if (res.code === 200) {
          _this.productPrice = res.data;
        } else {
          _this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
      if (this.showYear) {
        _this.$set(dataMoney, "id", _this.shopId);
      } else {
        _this.$set(
          dataMoney,
          "paymentVoucherPicUrl",
          JSON.stringify(_this.ruleForm.detailImg)
        );
      }
      _this.passwordOne = JSON.parse(JSON.stringify(dataMoney));
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
      this.$router.push("/shop");
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
  padding-left: 226px;
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
    padding-left: 10px;
  }
}

.fontEmp {
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
.updatePass {
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
  color: rgba(51, 51, 51, 1);
  img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 3px;
    padding-right: 4px;
  }
  .move {
    position: relative;
    top: -15px;
    left: 23px;
  }
}
</style>