<!--
 * @Description: 全局样式设置
 * @Author: 赵亮
 * @Date: 2019-09-10 16:29:07
 * @LastEditTime: 2019-11-18 17:43:51
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
}
#app {
  background: #f7f8fa;
  height: 100%;
  width: 100%;
}
/* 火狐去除input为number类型的箭头 */
.el-pagination__editor {
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
body,
html {
  height: 100%;
  width: 100%;
}
.btm-btn {
  margin-bottom: 20px !important;
}
.form {
  // overflow: auto;
  // height: 100%;
  .el-form {
    margin: 20px 0 60px 0;
  }
  .el-form-item__content {
    .el-input {
      width: 400px;
    }
    .el-textarea {
      width: 400px;
    }
  }
}
.footer-btn {
  height: 80px;
  line-height: 80px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0px;
  width: calc(100% - 264px);
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(240, 240, 240, 1);
  box-shadow: 0px 0px 6px 0px rgba(181, 184, 191, 0.2);
  border-radius: 6px 6px 0px 0px;
  margin-left: -20px;
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
.el-dialog__body {
  border-top: 1px solid #e6e6e6;
  padding: 35px 0 !important;
  .el-input {
    width: 360px;
  }
  .el-textarea {
    width: 360px;
  }
  .el-form-item__label {
    width: 110px;
  }
}
.el-dialog {
  width: 540px !important;
  padding: 0 20px 20px;
  border-radius: 6px !important;
  .el-dialog__header {
    padding: 19px 0;
    .el-dialog__title {
      color: #333;
      font-weight: 400;
      font-size: 18px;
    }
  }
  .el-form-item__error {
    left: 110px;
  }
  .el-dialog__footer {
    padding: 0;
  }
}
.el-textarea__inner {
  padding: 10px 15px !important;
  font-family: Microsoft YaHei;
}
.serveError {
  .errorInfor {
    text-align: center;
    img {
      margin-bottom: 20px;
      margin-top: 78px;
    }
    div {
      color: #333;
      font-size: 24px;
      line-height: 24px;
      margin-bottom: 50px;
    }
    .back {
      width: 120px;
      height: 50px;
    }
  }
}
input:hover {
  border-color: #4da1ff !important;
}
.el-input__inner:hover {
  border-color: #4da1ff !important;
}
</style>
