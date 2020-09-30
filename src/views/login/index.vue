<!--
 * @Description: 登录页面
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-09-11 17:03:31
 * @description: 存储登录接口返回信息，格式转换
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-29 20:08:42
 -->
<template>
  <div class="login">
    <div class="bcg">
      <div class="login-box">
        <div class="title">代理商后台</div>
        <div style="height:70px;">
          <div class="input account" :class="account == '' &&  !rules.isAccount? 'border-gray' : rules.isAccount ? 'border-red' : 'border-blue'">
            <img src="../../assets/img/account@2x.png" alt="">
            <input autoComplete="new-password" maxlength="11" type="text" placeholder="账号" @blur="blur(1)"
              v-model="account" class="desc">
          </div>
          <div v-show="rules.isAccount" class="error">请输入账号</div>
        </div>
        <div style="height:70px;">
          <div class="input psd" :class="password == '' && !rules.isPassword ? 'border-gray' : rules.isPassword || isShow ? 'border-red' : 'border-blue'">
            <img src="../../assets/img/password@2x.png" alt="">
            <input autoComplete="new-password" type="password" placeholder="密码" @blur="blur(2)"
              v-on:keyup.enter="clickLogin" v-model="password" class="desc">
          </div>
          <div v-show="rules.isPassword" class="error">请输入密码</div>
          <div class="error" v-show="isShow">账户名或者密码错误</div>
        </div>
        <div class="btn" @click="clickLogin">登录</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import { userLogin } from "../../api/login.js";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      borderColor:{
        account:'border-gray',
        password:'border-gray'
      },
      account: "", //账号
      password: "", //密码
      isShow: false, //是否显示密码错误
      rules: {
        isAccount: false, //判断账号是否为空
        isPassword: false //判断密码是否为空
      }
    };
  },
  mounted() {},
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 判断输入框是否有值
     * @param {type}
     * @return:
     * @Date: 2019-09-20 16:58:31
     */
    blur(index) {
      if (index == 1) {
        this.rules.isAccount = this.account == "" ? true : false;
        if (this.rules.isAccount) {
          this.borderColor.account = "border-red"
        }
      } else if (index == 2) {
        this.rules.isPassword = this.password == "" ? true : false;
         if (this.rules.isPassword) {
          this.borderColor.password = "border-red"
        }
        this.isShow = false;
      }
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 登录
     * @param {type}
     * @return:
     * @Date: 2019-09-20 16:57:59
     */
    clickLogin() {
      if (this.account == "") {
        this.rules.isAccount = true;
      }
      if (this.password == "") {
        this.rules.isPassword = true;
      }
      let data = {
        username: this.account,
        password: rsaJsencrypt(this.password)
      };
      if (this.account !== "" && this.password !== "") {
        userLogin(data).then(res => {
          if (res.code == 200) {
            let token = res.data;
            localStorage.setItem("token", JSON.stringify(token));
            this.$store.dispatch("meun/changeMenuType", token.roleType);
            axios.defaults.headers = {
              userToken: JSON.parse(localStorage.getItem("token")).userToken
            };
            this.$router.push({
              path: "/"
            });
          } else {
            this.isShow = true;
          }
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;
  .bcg {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../../assets/img/bcg.png") no-repeat;
    .login-box {
      padding: 0 40px;
      width: 420px;
      height: 370px;
      background: #ffffff;
      box-shadow: 0px 0px 10px 0px rgba(178, 183, 191, 0.2);
      border-radius: 10px;
      .title {
        padding-top: 40px;
        text-align: center;
        height: 24px;
        line-height: 24px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(102, 102, 102, 1);
      }
      .input {
        height: 50px;
        text-align: left;
        // border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        img {
          width: 16px;
          height: 16px;
        }
        .desc {
          margin-left: 20px;
          width: 384px;
          border: none;
          outline: none;
          line-height: 12px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333;
        }
      }
      .error {
        margin-top: 10px;
        text-align: left;
        height: 11px;
        line-height: 11px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 123, 140, 1);
      }
      .border-gray {
        border-bottom: 1px solid #e5e5e5;
      }
      .border-blue {
        border-bottom: 2px solid #4da1ff;
      }
      .border-red {
        border-bottom: 2px solid rgba(255, 123, 140, 1);
      }
      .account {
        height: 50px;
        margin-top: 30px;
      }
      .psd {
        height: 50px;
        margin-top: 10px;
      }
      .btn {
        margin-top: 45px;
        text-align: center;
        height: 50px;
        background: #4da1ff;
        border-radius: 6px;
        line-height: 50px;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>
<style lang="less">
.login {
  .el-input--suffix .el-input__inner {
    border: none;
  }
  input::-webkit-input-placeholder {
    color: #cccccc;
  }
  .login .login-box .btn[data-v-37dfd6fc] {
    text-align: center;
  }
}
</style>