<!--
 * @Description: 管理中心审核拒绝组件
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-10-08 11:36:00
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-10-29 17:57:12
 -->
<template>
  <div class="refuse-review">
    <el-dialog title="审核拒绝" :visible.sync="dialogForm" :close-on-click-modal="false" @close="close">
      <el-form>
        <span><i class="el-icon-warning icon"></i> 确定要拒绝审核？</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="handleDialogConfirm" style="margin-left:14px">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    showReview: {
      type: Boolean,
      default: false
    },
    disabled: {
      // 是否可提交
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogForm: true // 是否显示审核拒绝弹框
    };
  },
  watch: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 监听showReview的值的变化
     * @param {type}
     * @return:
     * @Date: 2019-10-08 17:28:02
     */
    showReview: {
      immediate: true,
      handler(showReview) {
        this.dialogForm = showReview;
      }
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 关闭审核拒绝弹框
     * @param {type}
     * @return:
     * @Date: 2019-10-08 11:11:19
     */
    close() {
      this.$emit("closeReview");
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 确认审核拒绝
     * @param {type}
     * @return:
     * @Date: 2019-10-08 11:51:34
     */
    handleDialogConfirm() {
      this.$emit("refuseSubmit");
    }
  }
};
</script>
<style lang="less" scoped>
.review {
  .icon {
    margin-bottom: 15px;
  }
}
</style>
<style lang="less">
.refuse-review {
  .el-icon-warning:before {
    color: #ff7b8c;
  }
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog .el-dialog__header {
    padding: 15px 0;
  }
}
</style>