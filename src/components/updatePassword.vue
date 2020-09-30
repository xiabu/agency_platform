<!--
 * @Description: 修改登录密码弹窗
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-16 21:03:51
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-10-29 17:55:13
 -->
<template>
  <div class="size-mini">
    <el-dialog title="修改密码" :visible.sync="visible" @close="close" :close-on-click-modal="false"
      width="560px !important">
      <el-form :model="formData" :rules="rules" ref="formData" class="fromPass" label-position="right"
        label-width="130px">
        <el-form-item label="登录密码" prop="password">
          <el-input maxlength="16" type="password" v-model="formData.password" placeholder="请输入8-16位的密码长度"></el-input>
        </el-form-item>
        <el-form-item label="确认登录密码" prop="checkPassword">
          <el-input maxlength="16" type="password" v-model="formData.checkPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="checkPass('formData')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    show1: { type: Boolean, default: false }
  },
  data() {
    //验证密码是否填写
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入登录密码"));
      } else if (value.length < 8 || value.length > 16) {
        callback(new Error("请输入8-16位的密码长度"));
      } else {
        if (this.formData.checkPassword !== "") {
          this.$refs.formData.validateField("checkPass");
        }
        callback();
      }
    };
    //验证密码是否填写与初次对应
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入登录密码"));
      } else if (value !== this.formData.password) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        password: "", //登录密码
        checkPassword: "" //确认密码
      },
      // 验证规则
      rules: {
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ],
        checkPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      },
      visible: this.show1 //控制dialog显示
    };
  },
  /**
   * @author: 郭亮（849324068@qq.com）
   * @description: 监听show1,visible随之变化而变化
   * @param {type}
   * @return:
   * @Date: 2019-09-17 10:58:35
   */
  watch: {
    show1: {
      immediate: true,
      handler(show1) {
        this.visible = show1;
      }
    }
  },
  methods: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 重置表单
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:58:51
     */
    OnReset() {
      this.$refs.formData.resetFields();
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 提交表单
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:38:35
     */
    checkPass(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.$emit("updatedPaw", this.formData.password);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 关闭弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:32:32
     */
    close() {
      this.$emit("update:show1", false); // 子组件更新弹框隐藏
      this.OnReset();
    }
  }
};
</script>
<style lang="less">
.size-mini {
  .el-dialog .el-form-item__error {
    left: 0;
  }
}
</style>