<!--
 * @Description: 菜单栏设置，页面头部设置
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 16:29:07
 * @LastEditTime: 2019-11-05 09:48:35
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->

<template>
  <div class="home">
    <header>
      <div class="head_left">
        <img id="img" v-if="!imageShow" :src="'http://agencytest.oss-cn-hangzhou.aliyuncs.com/' + image" alt="">
        <img id="img" v-if="imageShow" src="../../assets/img/bjLogo.png" alt="">
        <span>{{proxyCompanyName}}</span>
      </div>
      <div class="head_right">
        <div v-if="roleType !== 3" @click="goMessage">
          <el-badge :value="total" :max="99" class="head_r_badge">
            <img src="../../assets/img/infoNum@2x.png" alt="">
          </el-badge>
        </div>
        <el-dropdown class="heder_r_dropdown" @command="handleCommand">
          <span class="el-dropdown-link">
            {{phone}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="outLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <div class="home_btm">
      <ul class="menu">
        <router-link v-for="(item, index) in navMenu" :key="index" v-show="item.isShow" v-if="item.leaf"
          :to="item.children[0].path">
          <li @click="handleToParentPage(item.children[0].path, index, item.leaf)"
            :class="item.children[0].path === activeParentMenu ? 'activeMenu1' : ''">
            <img
              :src="item.children[0].path === activeParentMenu ? item.children[0].meta.icon1 : item.children[0].meta.icon"
              alt="">
            <span>{{ item.children[0].meta.title }}</span>
          </li>
        </router-link>
        <ul v-else>
          <router-link v-show="item.isShow" :to="item.path" style="display: block;">
            <li :key="index" class="li-left" @click="handleToParentPage(item.redirect.path, index, item.leaf, item.unfold)"
              :class="item.redirect.path === activeParentMenu ? 'activeMenu1' : ''">
              <div>
                <img :src="item.redirect.path === activeParentMenu ? item.meta.icon1 : item.meta.icon" alt="">
                <span>{{ item.meta.title }}</span>
              </div>
              <p class="listAdd listJian" v-if="item.unfold"><img
                  :src="item.redirect.path === activeParentMenu ? require('../../assets/img/jian.png') : require('../../assets/img/jianNo.png') "
                  alt="" /></p>
              <p class="listAdd" v-else><img
                  :src="item.redirect.path === activeParentMenu ? require('../../assets/img/jia.png') : require('../../assets/img/jiaNo.png')"
                  alt="" /></p>
            </li>
          </router-link>
          <div v-show="item.isShow" :class="item.unfold ? 'activeBlock' : 'activeHidden'">
            <router-link v-for="(item1, index1) in item.children" class="child" :key="index1" :to="item1.path">
              <li class="child_center" :class="item1.path === activeMenu ? 'activeMenu2' : ''"
                @click="handleToPage(item1.path, index, index1)">
                {{item1.meta.title}}
              </li>
            </router-link>
          </div>

        </ul>
      </ul>
      <div ref="main" class="main">
        <ul class="breadcrumb">
          <li></li>
          <li v-for="(item, index) in menuCrumb" v-if="index === 0" :key="index">
            {{ item.meta.title }}
          </li>
          <li v-else>&nbsp;/ {{ item.meta.title }}</li>
        </ul>
        <transition name="fade" mode="out-in">
          <router-view @updataNotify="updataNotify"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
window.sessionStorage.setItem = function(k, v) {
  if (k === "info") {
    window.info();
  }
  if (k === "headerImg") {
    document
      .getElementById("img")
      .setAttribute("src", `http://agencytest.oss-cn-hangzhou.aliyuncs.com/${v}`);
    document
      .getElementById("iconHref")
      .setAttribute("href", `http://agencytest.oss-cn-hangzhou.aliyuncs.com/${v}`);
  }
};
import menuRouter from "../../router/menuRouter.js";
import { mapGetters } from "vuex";
import { stringify } from "querystring";
import { getProxyCom } from "../../api/setting.js";
import { apiGetNotify } from "../../api/message.js";
import { setTimeout } from "timers";
import { constants } from "fs";
export default {
  name: "Home",
  data() {
    return {
      leaf: "", // 是否是多菜单
      navMenu: [], //左侧菜单栏列表
      phone: "", // 手机号
      activeMenu: "", // 选中子菜单
      activeParentMenu: "", // 选中父元素
      menuCrumb: [], // 面包屑菜单列表
      proxyCompanyName: "", // 代理商名称
      image: sessionStorage.getItem("headerImg") || "", // 企业logo
      total: "", //消息通知数
      roleType: JSON.parse(localStorage.getItem("token")).roleType,
      unfold: false, // 是否展开菜单栏
      imageShow: false // 是否显示默认头像
    };
  },
  computed: {
    //监听词条
    getSearchKey() {
      return this.$store.state.searchKey;
    }
  },
  watch: {
    //监听路由变化
    $route(to, from) {
      this.$refs.main.scrollTop = 0;
      this.menuCrumb = JSON.parse(localStorage.getItem("menuCrumbItem"));
      if (to.path.split("/").length > 2) {
        // 判断路由是不是由两个字段组成
        if (this.menuCrumb.length > 1) {
          // 判断面包屑数组长度
          this.menuCrumb[2] = {
            path: to.path,
            meta: to.meta
          };
        } else {
          this.menuCrumb[1] = {
            path: to.path,
            meta: to.meta
          };
          localStorage.setItem("menuActiveIndex", to.path);
        }
      } else if (
        this.menuCrumb.length > 1 &&
        this.menuCrumb[1].path.split("/").length < 3
      ) {
        if (this.menuCrumb[1].path !== to.path) {
          // 操控二级菜单时，判断是否路由发生变化
          this.activeMenu = to.path;
          this.menuCrumb[1] = {
            path: to.path,
            meta: to.meta
          };
          localStorage.setItem("menuActiveIndex", to.path);
        }
        this.menuCrumb.splice(2, 1);
      } else {
        this.menuCrumb = [
          {
            path: to.path,
            meta: to.meta
          }
        ];
        localStorage.setItem("menuActiveIndex", to.path);
      }
      if (
        to.path === "/mangeForm" ||
        to.path === "/renew" ||
        to.path === "/rechargeForm"
      ) {
        this.menuCrumb[0].path = "/mangeForm";
        this.menuCrumb[0].meta.title = "表单管理";
        localStorage.setItem("menuActiveParent", "/mangeForm");
      }
      if (to.path === "/topUpAudit" && this.menuCrumb.length > 1) {
        this.menuCrumb = this.menuCrumb.splice(1, 1);
        localStorage.setItem("menuActiveParent", "/topUpAudit");
      }
      localStorage.setItem("menuCrumbItem", JSON.stringify(this.menuCrumb));
      this.activeMenu = localStorage.getItem("menuActiveIndex");
      this.activeParentMenu = localStorage.getItem("menuActiveParent");
    }
  },
  computed: {
    meunList() {
      // 计算菜单列表
      return JSON.parse(localStorage.getItem("meunItem"));
    }
  },
  created() {
    this.phone = JSON.parse(localStorage.getItem("token")).username;
    if (localStorage.getItem("menuCrumbItem")) {
      // 判断面包屑导航是否存在
      this.menuCrumb = JSON.parse(localStorage.getItem("menuCrumbItem"));
    } else {
      this.menuCrumb = [this.navMenu[0].children[0]];
    }
    this.activeMenu = localStorage.getItem("menuActiveIndex");
    this.activeParentMenu = localStorage.getItem("menuActiveParent");
    if (this.menuCrumb[2]) {
      this.$router.push(this.menuCrumb[2].path); // 跳转子元素路由
    } else {
      if (this.activeMenu) {
        this.$router.push(this.activeMenu); // 跳转子菜单路由
      } else {
        this.$router.push(this.activeParentMenu); // 跳转父菜单路由
      }
    }
    this.getProxy();
    this.getNotifyData();
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 消息条数更新
     * @param {type}
     * @Date: 2019-10-28 19:12:02
     */
    updataNotify() {
      this.getNotifyData();
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 点击跳转到消息通知页面
     * @param {type}
     * @Date: 2019-10-18 08:51:35
     */
    goMessage() {
      localStorage.setItem("menuActiveParent", "/info"); // 保存选中父菜单路由
      localStorage.setItem("menuActiveIndex", "/info"); // 保存选中子菜单路由
      this.activeParentMenu = "/info";
      this.$router.push({
        path: "/info",
        name: "info"
      });
      this.menuCrumb = [
        {
          path: "/info",
          meta: {
            title: "消息通知"
          }
        }
      ];
      localStorage.setItem("menuCrumbItem", JSON.stringify(this.menuCrumb));
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 获取消息通知数量
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:13:32
     */
    getNotifyData() {
      let data = {
        isRead: 0
      };
      Object.assign(data);
      apiGetNotify(data).then(res => {
        if (res.code === 200) {
          this.total = res.data.total;
          if (this.total === 0) {
            this.total = "";
          }
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取企业信息
     * @Date: 2019-10-10 11:04:00
     */
    getProxy() {
      getProxyCom().then(res => {
        if (res.code == 200) {
          this.proxyCompanyName = res.data.proxyCompanyName;
          this.image = res.data.proxyLogo;
          if (this.image) {
            this.imageShow = false;
          } else {
            this.imageShow = true;
          }
          if (this.image) {
            document
              .getElementById("iconHref")
              .setAttribute(
                "href",
                `http://agencytest.oss-cn-hangzhou.aliyuncs.com/${res.data.proxyLogo}`
              );
          }
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 退出登录，清空token
     * @param { String } command [选中菜单code]
     * @Date: 2019-09-24 15:53:39
     */
    handleCommand(command) {
      if (command === "outLogin") {
        localStorage.removeItem("token");
        localStorage.removeItem("meunItem");
        localStorage.removeItem("menuActiveIndex");
        localStorage.removeItem("menuActiveParent");
        localStorage.removeItem("menuCrumbItem");
        this.$router.push("/login");
      }
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 跳转一级页面
     * @param { String } url [选中菜单链接]
     * @param { Number } parIndex [选中菜单index]
     * @param { Boolean } leaf [选中菜单是否有二级菜单]
     * @Date: 2019-09-24 15:55:39
     */
    handleToParentPage(url, parIndex, leaf, unfold) {
      if (unfold !== undefined) {
        this.navMenu[parIndex].unfold = !unfold;
        localStorage.setItem("meunItem", JSON.stringify(this.navMenu));
      }
      this.leaf = leaf;
      if (leaf) {
        this.menuCrumb = [this.navMenu[parIndex].children[0]];
      } else {
        this.menuCrumb = [
          this.navMenu[parIndex],
          this.navMenu[parIndex].children[0]
        ];
        localStorage.setItem("menuActiveIndex", url);
        this.activeMenu = url;
      }
      this.activeParentMenu = url;
      localStorage.setItem("menuActiveParent", url); // 保存选中父菜单路由
      localStorage.setItem("menuActiveIndex", url); // 保存选中子菜单路由
      localStorage.setItem("menuCrumbItem", JSON.stringify(this.menuCrumb)); // 保存当前面包屑菜单
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 跳转子级页面
     * @param { String } url [选中菜单链接]
     * @param { Number } parIndex [选中菜单index]
     * @param { Number } childIndex [选中子菜单index]
     * @Date: 2019-09-24 16:10:39
     */
    handleToPage(url, parIndex, childIndex) {
      this.menuCrumb[0] = this.navMenu[parIndex];
      this.menuCrumb[1] = this.navMenu[parIndex].children[childIndex];
      this.menuCrumb.splice(2, 1);
      this.activeMenu = url;
      this.activeParentMenu = this.navMenu[parIndex].redirect.path;
      localStorage.setItem("menuActiveIndex", url); // 保存选中子菜单路由
      localStorage.setItem("menuActiveParent", this.activeParentMenu); // 保存选中父菜单路由
      localStorage.setItem("menuCrumbItem", JSON.stringify(this.menuCrumb)); // 保存当前面包屑菜单
    }
  },
  mounted() {
    this.navMenu = JSON.parse(localStorage.getItem("meunItem"));
    window["info"] = val => {
      this.getNotifyData();
    };
  }
};
</script>
<style lang="less">
.home {
  height: 100%;
  width: 100%;
  overflow: hidden;
  header {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 64px;
    line-height: 64px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 1px 0px 0px rgba(240, 240, 240, 1);
    .head_left {
      height: 100%;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0 10px 0 20px;
      }
      span {
        font-size: 18px;
        color: #222;
        font-weight: bold;
      }
    }
    .head_right {
      display: flex;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
      .heder_r_dropdown {
        cursor: pointer;
        margin-right: 40px;
      }
      .head_r_badge {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin: 0 40px;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .el-badge__content {
        background: #ff7b8c;
        font-size: 12px;
        font-weight: 400;
      }
      .el-badge__content.is-fixed {
        top: 0px;
      }
      .el-dropdown {
        color: #666;
        font-weight: 400;
      }
      .el-icon--right {
        font-weight: 600;
        color: #666;
      }
    }
  }
  .home_btm {
    margin-top: 65px;
    display: flex;
    justify-content: space-between;
    height: calc(100% - 65px);
    .main {
      padding: 20px;
      margin: 70px 20px 20px;
      width: calc(100% - 180px);
      height: calc(100% - 135px);
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(240, 240, 240, 1);
      box-shadow: 0px 0px 6px 0px rgba(181, 184, 191, 0.2);
      border-radius: 6px;
      overflow: auto;
    }
  }
  .menu {
    width: 200px;
    padding: 20px;
    box-shadow: 1px 0px 0px 0px rgba(240, 240, 240, 1);
    background: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    li {
      width: 140px;
      padding: 0px 20px;
      margin-top: 10px;
      line-height: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 14px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      color: #222;
      img {
        width: 20px;
        height: 20px;
      }
      span {
        margin-left: 10px;
      }
    }
    .listAdd {
      width: 10px;
      height: 10px;
      font-weight: 700;
      line-height: 10px;
      > img {
        width: 10px;
        height: 100%;
        display: block;
      }
    }
    .listJian {
      height: 2px;
    }
    .li-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        align-items: center;
      }
    }
    .child_center {
      margin-left: 30px;
    }
    .child_center:hover {
      background: none;
    }
    li:hover {
      background: #dfedfe;
    }
    .activeMenu1 {
      background: #dfedfe;
      color: #4da1ff;
    }
    .activeMenu2 {
      color: #4da1ff;
    }
    .activeBlock {
      max-height: 300px;
      transition: max-height 0.3s ease-in;
      transform-origin: 100% 0;
      animation: slide-down 0.3s ease-in;
      -webkit-animation: slide-down 0.3s ease-in;
    }
    .activeHidden {
      max-height: 0px;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }
    @keyframes slide-down {
      0% {
        transform: scale(1, 0);
      }
      100% {
        transform: scale(1, 1);
      }
    }
    @-webkit-keyframes slide-down {
      0% {
        -webkit-transform: scale(1, 0);
      }
      100% {
        -webkit-transform: scale(1, 1);
      }
    }
  }

  .menu::-webkit-scrollbar {
    width: 7px;
    height: 1px;
  }
  .menu::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background: #e6e6e6;
  }
  .menu::-webkit-scrollbar-track {
    border-radius: 7px;
    background: #fff;
  }
  .main::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .main::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 7px;
    background: #e6e6e6;
  }
  .main::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 7px;
    background: #fff;
  }
  .breadcrumb {
    position: absolute;
    top: 85px;
    left: 240px;
    li {
      float: left;
      line-height: 30px;
      font-size: 14px;
      color: #333;
      font-weight: 400;
    }
    li:first-child {
      width: 4px;
      height: 24px;
      background: #4da1ff;
      border-radius: 2px;
      margin-right: 10px;
    }
    li:nth-child(2) {
      font-size: 20px;
      color: #222;
      line-height: 24px;
    }
  }
  .child_center:hover {
    color: #4da1ff;
  }
}
</style>