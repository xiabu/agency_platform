<!--
 * @Description: 管理中心审核通过组件
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-10-08 10:59:21
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-30 17:43:24
 -->
<template>
  <div class="pass-review">
    <el-dialog title="审核通过" :visible.sync="dialogForm" :close-on-click-modal="false" @close="close">
      <el-form :model="passReview" :rules="rulesPassReview" ref="passReview">
        <span><i class="el-icon-warning icon"></i> <span class="superBr">确定要通过审核？</span> <br>
        </span>
        <el-form>
          <div class="br" v-if="roleType != 1">预计扣除账户余额￥ {{(paymentAmount1 / 100).toFixed(2)}}</div>
        </el-form>
        <el-form-item label="支付密码" prop="password" style="margin-left:-12px;">
          <el-input maxlength="16" autoComplete="new-password" type="password" v-model="passReview.password"
            placeholder="请输入支付密码">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="handleDialogConfirm('passReview')"
          style="margin-left:14px;">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { apiAuditOrder } from "../api/mangeCenter.js";
export default {
  props: {
    showPassReview: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    paymentAmount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      roleType: JSON.parse(localStorage.getItem("token")).roleType, //代理商id
      dialogForm: true, // 是否显示审核通过弹框
      paymentAmount1: 0,
      passReview: {
        password: "" // 支付密码
      },
      rulesPassReview: {
        password: [
          { required: true, message: "请输入支付密码", trigger: "blur" },
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
     * @description: 监听showPassReview的值的变化
     * @param {type}
     * @return:
     * @Date: 2019-10-08 17:27:00
     */
    showPassReview: {
      immediate: true,
      handler(showPassReview) {
        this.dialogForm = showPassReview;
      }
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 监听paymentAmount的值的变化
     * @param {type}
     * @return:
     * @Date: 2019-10-08 17:27:00
     */
    paymentAmount: {
      immediate: true,
      handler(paymentAmount) {
        this.paymentAmount1 = paymentAmount;
      }
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 关闭审核通过弹框
     * @param {type}
     * @return:
     * @Date: 2019-10-08 11:11:19
     */
    close() {
      this.$refs.passReview.resetFields();
      this.$emit("closeDialogReview");
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 审核确认
     * @param {type}
     * @return:
     * @Date: 2019-10-08 11:32:20
     */
    handleDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("passSubmit", this.passReview);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.pass-review {
  .pwsd {
    // margin-left: -12px;
  }
  .icon {
    margin-bottom: 15px;
  }
  .superBr {
    font-size: 14px !important;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .br {
    position: relative;
    left: 20px;
    margin-bottom: 40px;
    font-size: 14px !important;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
}
</style>
<style lang="less">
.pass-review {
  .el-icon-warning:before {
    color: #ff7b8c;
    margin-right: 5px;
  }
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog .el-dialog__header {
    padding: 15px 0;
  }
}
</style>