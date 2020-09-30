/*
 * @Description: 配置路由
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-09 09:39:54
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-09-27 08:49:26
 */
import Vue from 'vue'
import Router from 'vue-router'
import menuRouter from './menuRouter'
import pageRouter from './pageRouter'

Vue.use(Router);

// 解决路由重复点击报错问题
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

const globleRouter = [ // 全局路由
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
    name: 'login'
  }
]
var routerItem = new Set([...menuRouter, ...globleRouter, ...pageRouter]) // 合并路由

export default new Router({
  mode: 'hash',
  routes: routerItem
})