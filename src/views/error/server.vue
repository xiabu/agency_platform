<!--
 * @Description: 
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-23 09:54:04
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-10-09 09:35:47
 -->
<template>
  <div class="serveError">
    <div class="errorInfor">
      <img width="42.17%" height="37.8%" src="../../assets/img/500.png" alt="">
      <div>抱歉，服务器出错了</div>
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
     * @Date: 2019-09-27 14:56:37
     */
    backIndex() {
      let menuArr = [
        {
          meta: {
            title: "首页"
          }
        }
      ];
      localStorage.setItem("menuActiveParent", "/index");
      localStorage.setItem("menuActiveIndex", "/index");
      localStorage.setItem("menuCrumbItem", JSON.stringify(menuArr));
      this.$router.push("/index");
    }
  }
};
</script>
