/*
 * @Description: 创建接口
 * @Author: 赵亮
 * @Date: 2019-09-11 11:21:15
 * @LastEditTime: 2019-11-12 16:32:58
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-09-29 08:56:11
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-09-27 13:59:29
 * @LastEditors: 李沛韬（929498346@qq.com）
 */
import { post, get } from './index' 
const url = '/list'
// 请求接口

export const postRegisterNewProxy = params => post(url + '/proxyCompany/registerNewProxy', params) //开通代理商
export const getUpyun = params => get(url + '/upyun/auth', params) //又拍云
export const getShopList = params => get(url + '/shop/getShopList', params) //店铺列表
export const getShopRemark = params => get(url + '/shopRemark/getList', params) //备注列表
export const postShopRemark = params => post(url + '/shopRemark/add', params) //添加备注
export const deleteShopRemark = params => get(url + '/shopRemark/delete', params) //删除备注

export const manageProxies = params => get(url + '/proxyCompany/manageProxies', params) //代理商管理首页表格数据

export const recharge = params => post(url + '/proxyCompany/recharge', params) //代理商管理首页充值

export const rechargeInfo = params => get(url + '/proxyCompany/rechargeInfo', params) //代理商管理首页充值

export const apiGetProxyData = params => get(url + '/proxyData/getData', params) //代理商数据-总览

export const apiGetProxyList = params => get(url + '/proxyData/getProxyList', params) //代理商数据-数据

export const setDiscount = params => post(url + '/proxyCompany/setDiscount',params)  //代理商管理-调整折扣

export const discountInfo = params => get(url + '/proxyCompany/discountInfo',params) //代理商管理-调整折扣预扣款

export const getAliyun = params => get(url + '/alioss/auth', params) //阿里云