<!--
 * @Description: 
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-09-09 15:11:04
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-10-18 14:09:15
 -->
<template>
  <div class="index">
    <img style="max-height: 90%;max-width: 90%;" src="../../assets/img/index.png" alt="">
    <div class="abc">
      <div class="fa">欢迎登陆</div>
      <div class="fc">代理商后台</div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.index {
  background: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  text-align: right;
  img {
    margin-right: 3.1%;
  }
  .abc {
    position: absolute;
    top: 80%;
    left: 5%;
    .fa {
      float: left;
      text-align: left;
      font-size: 60px;
      color: #4da1ff;
      line-height: 60px;
      margin-bottom: 40px;
    }
    .fc {
      float: left;
      text-align: left;
      // position: absolute;
      font-size: 42px;
      color: #666;
      // top: 77.7%;
      // left: 4.94%;
      line-height: 42px;
      margin: 15px 0 0 40px;
    }
  }
}
</style>