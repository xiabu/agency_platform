<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-11-20 14:28:58
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-09-29 18:41:41
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
<template>
  <div class="mange-center form">
    <el-form style="margin-bottom: 100px;" :model="formData" :rules="rules" ref="formData" label-width="245px"
      class="demo-formData">
      <el-form-item label="客户姓名" prop="userName">
        <el-input :maxlength="8" show-word-limit v-model="formData.userName" placeholder="客户姓名长度不得小于2位"></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="phone">
        <el-input autoComplete="new-password" v-model="formData.phone" :maxlength="11" show-word-limit
          placeholder="请输入登录账号"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="pass">
        <el-input autoComplete="new-password" type="password" :maxlength="16" v-model="formData.pass"
          placeholder="请输入8-16位的密码长度">
        </el-input>
      </el-form-item>
      <el-form-item label="确认登录密码" prop="checkPass">
        <el-input type="password" v-model="formData.checkPass" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="formData.name" :maxlength="40" show-word-limit placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item class="reletive" label="关联员工" prop="about">
        <p class="employee" v-if="showEmpList"><span class="fontEmp">{{formData.about}}</span><img
            src="../../assets/img/X@2x.png" @click="deleteEmp" v-if=" roleType !== 3 " /></p>
        <p v-if="!showEmpList" class="selectEmployee" @click="selectEmp" :class=" 'showVat' ? 'showWarn' : ''"><img
            src="../../assets/img/add@2x.png" alt="" /></p>
        <span class="addEmp" @click="addEmp" v-if="roleType == 1">添加员工</span>
        <div v-if="showVat" class="rulesvat">请选择关联员工</div>
      </el-form-item>
      <el-form-item label="区域" prop="address">
        <Address :addressObj="formData" />
      </el-form-item>
      <el-form-item label="详细地址" prop="adressDetail">
        <el-input type="textarea" :maxlength="60" :rows="4" show-word-limit v-model="formData.adressDetail"
          placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item label="代理商等级" prop="grade">
        <el-select v-model="formData.grade" placeholder="请选择等级">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付密码" prop="zfpass">
        <el-input maxlength="16" type="password" v-model="formData.zfpass" placeholder="请输入8-16位的密码长度"></el-input>
      </el-form-item>
      <el-form-item label="确认支付密码" prop="zfcheckPass">
        <el-input maxlength="16" type="password" v-model="formData.zfcheckPass" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item v-if="roleType == 1" label="账户余额" prop="num">
        <el-input v-model="formData.num" placeholder="请输入账户余额"></el-input>
      </el-form-item>
      <el-form-item label="拿货折扣比例" prop="num1" class="form-zk">
        <el-input v-model="formData.num1" placeholder="请设置折扣比例" maxlength="3"></el-input>
        <span>%</span>
      </el-form-item>
      <el-form-item label="开通店铺" v-if="roleType == 1">
        <el-switch v-model="formData.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="商品信息" v-if="formData.delivery" prop="productName">
        <el-select v-model="formData.productName" placeholder="请选择商品信息" style="width: 400px" @change="selectChange">
          <el-option v-for="(item, index) in productList" :key="index" :label="item.productName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="商品信息" prop="productId" v-if="shopId !==''">
        <span>{{formData.productName}}</span><span @click="upGrade" class="updateVersion">修改版本</span>
      </el-form-item> -->
      <el-form-item label="购买年限" prop="buyYears" class="yearWidth" v-if="formData.delivery">
        <el-input-number v-model="formData.buyYears" :min="1" :max="100" label="描述文字">
        </el-input-number><span style="padding-left: 5px;color:rgba(51,51,51,1);">年</span>
      </el-form-item>
      <el-form-item class="footer-btn">
        <el-button @click="handleGoBack">取消</el-button>
        <el-button type="primary" :disabled="disabled" @click="submitForm('formData')">提交</el-button>
      </el-form-item>
    </el-form>
    <employee :show.sync="showEmps" @empName="empName"></employee>
    <el-dialog class="el-dialog1" title="添加员工" :visible.sync="showAdd" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules1" ref="form">
        <el-form-item label="员工姓名" prop="empName1">
          <el-input v-model="form.empName1" placeholder="请输入员工姓名" show-word-limit maxlength="8"></el-input>
        </el-form-item>
      </el-form>
      <p class="remark">添加成功后，员工姓名将保存至员工列表，下次可直接选择。</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :disabled="disabled" @click="confirm('form')" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import Employee from "../../components/employee.vue";
import {
  validateInteger,
  validateNum,
  validateScale
} from "../../assets/js/form_validate.js";
import Address from "../../components/address";
import { postRegisterNewProxy } from "../../api/agent.js";
import { getAdminAddEmployee, checkPhone } from "../../api/employee.js";
import { findProductList, getProductData } from "../../api/product.js";
import { validateScaleInteger } from "../../assets/js/form_validate.js";
export default {
  data() {
    //验证用户姓名
    var validateName = (rule, value, callback) => {
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("请输入中文"));
      } else {
        callback();
      }
    };
    //验证最大金额
    var validateNum1 = (rule, value, callback) => {
      if (value > 999999999) {
        callback(new Error("最大不得超过999999999元"));
      } else {
        callback();
      }
    };
    //登录账号校验
    var validatePhone = (rule, value, callback) => {
      let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      if (value === "") {
        callback(new Error("请输入登录账号"));
      } else if (!reg.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else if (value != "" && reg.test(value)) {
        let params = {
          phone: value
        };
        checkPhone(params).then(res => {
          if (res.code === 200) {
            if (res.data === 1) {
              callback();
            } else {
              callback(new Error("该账号已开通代理商，请重新输入"));
            }
          }
        });
      } else {
        callback();
      }
    };
    // 登录密码校验
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入登录密码"));
      } else {
        if (this.formData.checkPass !== "") {
          this.$refs.formData.validateField("checkPass");
        }
        callback();
      }
    };
    // 确认登录密码校验
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入登录密码"));
      } else if (value !== this.formData.pass) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    // 支付密码校验
    const validatePassZ = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入支付密码"));
      } else {
        if (this.formData.zfcheckPass !== "") {
          this.$refs.formData.validateField("zfcheckPass");
        }
        callback();
      }
    };
    // 确认支付密码校验
    const validatePassZ1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入支付密码"));
      } else if (value !== this.formData.zfpass) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    // 关联员工校验
    const validateEmp = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择关联员工"));
      } else {
        callback();
      }
    };
    return {
      productList: "", //商品列表
      disabled: false,
      form: {
        empName1: "" //添加员工名
      },
      showAdd: false, //显示添加员工弹窗
      roleType: JSON.parse(localStorage.getItem("token")).roleType, //登录权限
      formData: {
        userName: "", // 客户姓名
        phone: "", // 登录账号
        pass: "", // 密码
        checkPass: "", // 确认密码
        name: "", // 企业名称
        about: JSON.parse(localStorage.getItem("token")).username, // 关联员工
        relatedEmployeeId: JSON.parse(localStorage.getItem("token")).empId, //关联员工id
        zfpass: "", // 支付密码
        zfcheckPass: "", //确认支付密码
        num: 0, // 账户余额
        num1: "", // 拿货折扣比例
        address: "", // 省
        city: "", // 市
        adressDetail: "", // 详细地址
        grade: "", //代理商等级
        productName: "", //商品名称
        buyYears: "", //购买年限
        productId: "", //商品id
        delivery: false //是否开通店铺
      },
      showVat: false, //是否显示提示
      showEmpList: true, // 员工添加按钮是否显示
      showEmps: false, // 员工添加弹窗是否显示
      rules1: {
        empName1: [
          { required: true, message: "请输入员工姓名", trigger: "blur" },
          { min: 2, message: "员工姓名长度不得小于2位", trigger: "blur" }
        ]
      }, // 添加员工校验
      rules: {
        userName: [
          { required: true, message: "请输入客户姓名", trigger: "blur" },
          { min: 2, message: "客户姓名长度不得小于2位", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        num: [
          { required: true, message: "请输入账户余额", trigger: "blur" },
          { validator: validateNum, trigger: "blur" },
          { validator: validateNum1, trigger: "blur" }
        ],
        num1: [
          { required: true, message: "请输入拿货折扣比例", trigger: "blur" },
          { validator: validateInteger, trigger: "blur" },
          { validator: validateScale, trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入登录账号", trigger: "blur" },
          {
            required: true,
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        address: [{ required: true, message: "请选择区域", trigger: "change" }],
        zfpass: [
          { required: true, validator: validatePassZ, trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ],
        zfcheckPass: [
          { required: true, validator: validatePassZ1, trigger: "blur" }
        ],
        about: [{ required: true, message: " ", trigger: "blur" }],
        grade: [
          {
            required: true,
            message: "请选择等级",
            trigger: "change"
          }
        ],
        productName: [
          {
            required: true,
            message: "请选择商品信息",
            trigger: "change"
          }
        ],
        buyYears: [
          { required: true, validator: validateScaleInteger, trigger: "blur" }
        ]
      }
    };
  },
  components: { Employee, Address },
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 获取商品列表
     * @param {type}
     * @return:
     * @Date: 2019-11-20 14:22:55
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
     * @author: 李沛韬（929498346@qq.com）
     * @description: 获取商品ID
     * @param {type}
     * @return:
     * @Date: 2019-11-20 14:22:44
     */
    selectChange(value) {
      let that = this;
      that.formData.productId = value;
      console.log(that.formData.productId);
      let data = {
        productId: value
      };
      getProductData(data).then(res => {
        if (res.code === 200) {
          that.formData.productName = res.data.productName;
          that.formData.buyPrice = res.data.buyPrice;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 添加员工
     * @param {type}
     * @return:
     * @Date: 2019-09-29 10:16:05
     */
    confirm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.disabled = true;
          let data = {
            employeeName: this.form.empName1
          };
          getAdminAddEmployee(data).then(res => {
            if (res.code == 200) {
              this.disabled = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.showAdd = false;
            } else {
              this.disabled = false;
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 取消添加
     * @param {type}
     * @return:
     * @Date: 2019-09-29 10:15:40
     */
    cancel() {
      this.showAdd = false;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 显示添加弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-29 10:15:49
     */
    addEmp() {
      this.showAdd = true;
      this.form.empName1 = "";
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 点击取消按钮，返回上一页面
     * @Date: 2019-09-24 16:38:01
     */
    handleGoBack() {
      this.$router.back(-1);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 验证是否打开
     * @Date: 2019-09-24 16:38:01
     */
    watchEmp() {
      this.formData.about === ""
        ? (this.showVat = true)
        : (this.showVat = false);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 打开员工选择弹窗
     * @Date: 2019-09-24 16:38:01
     */
    selectEmp() {
      this.showEmps = true;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 清空员工
     * @Date: 2019-09-24 16:38:01
     */
    deleteEmp() {
      this.showEmpList = false;
      this.formData.about = "";
      this.watchEmp();
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 提交表单
     * @param { String } formName [表单对象名字]
     * @Date: 2019-09-24 16:38:01
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.disabled = true;
          let str = this.formData.address.split("-");
          let provinceCode = str[1];
          let provinceName = str[0];
          let str1 = this.formData.city.split("-");
          let cityCode = str1[1];
          let cityName = str1[0];
          if (this.roleType == 1) {
            let data = {
              proxyUserName: this.formData.userName,
              mobilePhone: this.formData.phone,
              loginPassword: rsaJsencrypt(this.formData.pass),
              proxyCompanyName: this.formData.name,
              relatedEmployeeId: this.formData.relatedEmployeeId, //关联员工id
              provinceCode: provinceCode, //省编码
              provinceName: provinceName,
              cityCode: cityCode,
              cityName: cityName,
              proxyAddress: this.formData.adressDetail,
              payPassword: rsaJsencrypt(this.formData.zfpass),
              amount: this.formData.num * 100,
              discount: this.formData.num1
            };
            postRegisterNewProxy(data).then(res => {
              if (res.code == 200) {
                this.disabled = false;
                this.$message({
                  message: "成功",
                  type: "success"
                });
                this.$router.push("/agent");
              } else {
                this.disabled = false;
                this.$message.error(res.msg);
              }
            });
            // let params = {
            //   customerName: this.formData.userName,
            //   cardLoginUsername: this.formData.phone,
            //   cardLoginPassword: rsaJsencrypt(this.formData.pass),
            //   companyName: this.formData.name,
            //   productId: this.formData.productId,
            //   buyYears: this.formData.buyYears,
            //   relevanceEmployeeId: this.formData.relatedEmployeeId
            // };
          } else {
            let data = {
              proxyUserName: this.formData.userName,
              mobilePhone: this.formData.phone,
              loginPassword: rsaJsencrypt(this.formData.pass),
              proxyCompanyName: this.formData.name,
              relatedEmployeeId: this.formData.relatedEmployeeId, //关联员工id
              provinceCode: provinceCode, //省编码
              provinceName: provinceName,
              cityCode: cityCode,
              cityName: cityName,
              proxyAddress: this.formData.adressDetail,
              payPassword: rsaJsencrypt(this.formData.zfpass),
              discount: this.formData.num1
            };
            postRegisterNewProxy(data).then(res => {
              if (res.code == 200) {
                this.disabled = false;
                this.$message({
                  message: "成功",
                  type: "success"
                });
                this.$router.push("/agent");
              } else {
                this.disabled = false;
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 保存选择的员工
     * @param { String } data [员工值]
     * @Date: 2019-09-24 16:39:01
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
        this.formData.about = data.empName;
        this.formData.relatedEmployeeId = data.id;
        this.watchEmp();
      }
    }
  },
  created() {
    this.loadProduct();
  }
};
</script>
<style lang="less">
.yearWidth {
  .el-input {
    width: 180px !important;
  }
}
.el-textarea .el-input__count {
  bottom: 1px;
}
.el-textarea .el-textarea__inner {
  // font-family: Microsoft YaHei;
}
</style>
<style lang="less" scoped>
.demo-formData {
  padding-bottom: 20px;
}
.selectEmployee {
  display: inline-block;
  width: 90px;
  height: 40px;
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 4px;
  line-height: 40px;
  align-items: center;
  text-align: center;
  img {
    width: 14px;
    height: 14px;
  }
}
.showWarn {
  border: 1px solid #f56c6c;
  cursor: pointer;
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
  }
}
.rulesvat {
  color: #ee4040;
  font-size: 12px;
  line-height: 1;
  display: flex;
  margin-top: 2px;
}
.form-zk {
  .el-input {
    width: 360px;
  }
  span {
    width: 40px;
    text-align: center;
    font-size: 14px;
    color: #333;
    font-weight: 400;
    padding-left: 10px;
  }
}
.reletive {
  .addEmp {
    font-size: 14px;
    cursor: pointer;
    color: #4da1ff;
    margin-left: 16px;
    cursor: pointer;
  }
}
.el-dialog1 {
  .el-dialog {
    width: 560px !important;
    .el-dialog__body {
      .el-form {
        margin: 0px;
        .el-form-item {
          .el-form-item__content {
            .el-input {
              width: 360px;
            }
          }
        }
      }
      .remark {
        font-size: 14px;
        line-height: 14px;
        margin-left: 110px;
        color: #666;
      }
    }
  }
}
</style>
