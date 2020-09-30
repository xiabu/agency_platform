<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-11 13:06:10
 * @LastEditTime: 2019-11-20 15:01:42
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
<template>
  <div class="set-pay">
    <div @click="update(1)">登录密码修改</div>
    <div @click="update(2)">支付密码修改</div>
    <el-dialog class="el-dialog1" title="修改密码" :visible.sync="propAdd" :close-on-click-modal="false" @close="addCancel">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input autoComplete="new-password" maxlength="16" type="password" v-model="ruleForm.oldPassword"
            placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input autoComplete="new-password" maxlength="16" type="password" v-model="ruleForm.newPassword"
            placeholder="密码长度不得小于8位"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="reNewPassword">
          <el-input autoComplete="new-password" maxlength="16" type="password" v-model="ruleForm.reNewPassword"
            placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="save('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import { updatePayPassword } from "../../api/setting.js";
export default {
  data() {
    // 原密码验证
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else if (value.length < 8) {
        callback(new Error("请输入8-16位的密码长度"));
      } else {
        callback();
      }
    };
    // 新密码验证
    const validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length < 8) {
        callback(new Error("请输入8-16位的密码长度"));
      } else {
        callback();
      }
    };
    // 确认新密码验证
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      index: 1, //判断修改密码种类 1-登录密码 2-支付密码
      propAdd: false, // 弹窗显示
      disabled: false,
      ruleForm: {
        oldPassword: "", //原密码
        newPassword: "", //新密码
        reNewPassword: "" //确认新密码
      },
      // 验证规则
      rules: {
        oldPassword: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            validator: validatePass1,
            trigger: "blur"
          }
        ],
        reNewPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 取消
     * @param {type}
     * @return:
     * @Date: 2019-11-20 14:42:39
     */
    addCancel() {
      this.propAdd = false;
      this.$refs.ruleForm.resetFields();
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 显示修改密码弹窗
     * @param {type}
     * @return:
     * @Date: 2019-11-20 14:42:14
     */
    update(index) {
      this.ruleForm.oldPassword = "";
      this.ruleForm.newPassword = "";
      this.ruleForm.reNewPassword = "";
      console.log(index);
      this.index = index;
      this.propAdd = true;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 提交表单
     * @param {type}
     * @return:
     * @Date: 2019-09-19 19:58:18
     */
    save(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.index == 2) {
            let data = {
              oldPayPassword: rsaJsencrypt(this.ruleForm.oldPassword),
              payPassword: rsaJsencrypt(this.ruleForm.newPassword)
            };
            this.disabled = true;
            updatePayPassword(data).then(res => {
              if (res.code == 200) {
                this.disabled = false;
                this.$message({
                  type: "success",
                  message: res.msg
                });
                this.propAdd = false;
                this.ruleForm.oldPassword = "";
                this.ruleForm.newPassword = "";
                this.ruleForm.reNewPassword = "";
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
          console.log("error submit!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.set-pay {
  padding-top: 20px;
  .el-dialog .el-form-item__error {
    left: 0px;
  }
  // .el-form {
  //   .el-form-item {
  //     .el-form-item__label {
  //       width: 245px !important;
  //     }
  //     .el-form-item__content {
  //       margin-left: 245px !important;
  //       .el-input {
  //         width: 400px;
  //       }
  //     }
  //   }
  // }
}
</style>