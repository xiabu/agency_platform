/*
 * @Description: 店铺管理接口
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-24 16:57:54
 * @LastEditors: 郭亮（849324068@qq.com）
 * @LastEditTime: 2019-10-12 14:39:19
 */
import {
  get,
  post
} from './index'

export const getMoney = params => post('/list/shop/getMoney', params) //添加店铺的点击保存接口，会返回扣款金额

export const addShopAndOpenAccunt = params => post('/list/shop/addShopAndOpenAccunt', params) //添加店铺的弹窗击确定接口

export const shopFindOne = params => get('/list/shop/findOne', params) //点击修改店铺的回显接口

export const updateShop = params => post('/list/shop/updateShop', params) //修改店铺的弹窗击确定接口

export const checkPhone = params => get('/list/shop/checkPhone', params) //校验店铺的登录账号（开通账号和修改都可调用）

export const checkRenewal = params => get('/list/shop/checkRenewal', params) //校验续费时手机号（1-通过，自家代理商开通了这个店铺；2-该手机号未开通店铺，不能续费；3-该手机号绑定了其他店铺）