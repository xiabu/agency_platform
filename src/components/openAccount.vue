<!--
 * @Description: 管理中心开通账号组件
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-10-08 09:12:42
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-10-30 15:24:33
 -->
<template>
  <div class="open-account">
    <el-dialog title="开通账号" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="close">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-form-item label="登录账号" prop="login">
          <el-input autoComplete="new-password" maxlength="11" v-model="loginAccount" placeholder="请输入登录账号" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input autoComplete="new-password" maxlength="16" type="password" v-model="dialogForm.password"
            placeholder="请输入8-16位的密码长度"></el-input>
          <span>&nbsp;</span>
        </el-form-item>
        <el-form-item label="确认登录密码" prop="rePassword">
          <el-input autoComplete="new-password" maxlength="16" type="password" v-model="dialogForm.rePassword"
            placeholder="请再次输入密码"></el-input>
          <span>&nbsp;</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="handleDialogSubmit('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    //是否显示弹框
    isShow: {
      type: Boolean,
      default: false
    },
    disabled: {
      // 是否可提交
      type: Boolean,
      default: false
    },
    //登录账号
    loginAccount: {
      type: String,
      default: ""
    }
  },
  data() {
    //验证密码是否填写
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入登录密码"));
      } else if (value.length < 8 && value.length > 16) {
        callback(new Error("请输入8-16位的密码长度"));
      } else {
        if (this.dialogForm.rePassword !== "") {
          this.$refs.dialogForm.validateField("rePassword");
        }
        callback();
      }
    };
    //验证密码是否填写与初次对应
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入登录密码"));
      } else if (value !== this.dialogForm.password) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: true, // 开通账号弹窗状态
      dialogForm: {
        login: "", // 登录账号
        password: "", // 登录密码
        rePassword: "" // 确认登录密码
      },
      rules: {
        login: [{ required: true, trigger: "blur" }],
        password: [
          { required: true, validator: validatePass, trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ],
        rePassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 监听isShow的值的改变
     * @param {type}
     * @return:
     * @Date: 2019-10-08 17:21:50
     */
    isShow: {
      immediate: true,
      handler(isShow) {
        this.dialogFormVisible = isShow;
      }
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 关闭开通账号弹框清空
     * @param {type}
     * @return:
     * @Date: 2019-09-30 14:48:35
     */
    close() {
      this.$refs.dialogForm.resetFields();
      this.$emit("closeDialog");
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 确认开通账号
     * @param {type}
     * @return:
     * @Date: 2019-10-21 13:46:39
     */
    handleDialogSubmit(formName) {
      this.dialogForm.login = this.loginAccount;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("dialogSubmit", this.dialogForm);
        }
      });
    }
  }
};
</script>
<style lang="less">
.open-account {
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog .el-dialog__header {
    padding: 15px 0;
  }
}
</style>