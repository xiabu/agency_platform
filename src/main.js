/*
 * @Description: 
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-09-09 09:09:55
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-10-16 17:43:35
 */
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import VueCropper from 'vue-cropper';
import axios from 'axios'; // 引入axios
import store from './store'; //引入store
import menuRouter from './router/menuRouter'; // 引入菜单数组

Vue.config.productionTip = false;

Vue.use(VueCropper);

localStorage.setItem("allMenuData", JSON.stringify(menuRouter)); // 将所有的菜单栏路由保存

if (localStorage.getItem('token')) { // 判断是否存在token，存在则设置请求头内容
  axios.defaults.headers = {
    'userToken': '' || JSON.parse(localStorage.getItem('token')).userToken
  }
}

// 全局路由守卫
router.beforeEach((to, from, next) => {
  //获取用户登录成功后储存的登录标志
  let userToken = JSON.parse(localStorage.getItem('token'));
  if (userToken) {
    let menuArr = [];
    if (localStorage.getItem('menuCrumbItem')) {
      menuArr = JSON.parse(localStorage.getItem('menuCrumbItem'));
    } else if (userToken.roleType === 1) {
      menuArr = [{
        path: "/agent",
        meta: {
          title: '代理商管理'
        }
      }, {
        path: "/agent",
        meta: {
          title: '代理商管理'
        }
      }];
      localStorage.setItem('menuActiveParent', '/agent');
      localStorage.setItem('menuActiveIndex', '/agent');
    } else if (userToken.roleType === 2) {
      menuArr = [{
        path: "/mangeCenter",
        meta: {
          title: '管理中心'
        }
      }];
      localStorage.setItem('menuActiveParent', '/mangeCenter');
      localStorage.setItem('menuActiveIndex', '/mangeCenter');
    } else {
      menuArr = [{
        meta: {
          title: '首页'
        }
      }];
      localStorage.setItem('menuActiveParent', '/index');
      localStorage.setItem('menuActiveIndex', '/index');
    }
    localStorage.setItem('menuCrumbItem', JSON.stringify(menuArr));
    next();
  } else {
    if (to.name === 'login') {
      next();
    } else {
      next('/login');
    }
  }
})

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')