<!--
 * @Description: 
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-23 09:54:04
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-09-24 11:20:22
 -->
<template>
  <div class="serveError">
    <div class="errorInfor">
      <img width="42.17%" height="37.8%" src="../../assets/img/404error1.png" alt="">
      <div>抱歉，您访问的页面不存在</div>
      <el-button class="back" type="primary" @click="backIndex">返回首页</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 返回首页
     * @param {type}
     * @return:
     * @Date: 2019-09-27 14:56:30
     */
    backIndex() {
      this.$router.push("/index");
    }
  }
};
</script>
