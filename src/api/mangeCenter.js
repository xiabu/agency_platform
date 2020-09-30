/*
 * @Description: 管理中心接口
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-26 11:28:42
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-15 17:41:40
 */

import {
  get,
  post
} from './index'

const url = '/list'

export const apiGetOrderList = params => get(url + '/order/list', params) // 管理中心列表接口

export const getInfoDetail = params => get(url + '/bill/fundsCustInfo', params) //资金信息和客户信息

export const applyRecharge = params => post(url + '/order/applyRecharge', params) //申请代理商充值

export const rechargeRecord = params => get(url + '/order/rechargeRecord', params) //所有的充值列表接口的展示

export const apiGetBillList = params => get(url + '/bill/list', params) //收支明细列表展示

export const getOrderDetail = params => get(url + '/order/detail', params) //获取订单详情

export const apiGetListByAdmin = params => get(url + '/order/listByAdmin', params) // 超级管理表单列表

export const apiAccountData = params => post(url + '/order/activeAccount', params) //开通账户

export const apiAuditOrder = params => post(url + '/order/auditOrder', params) //审核订单接口

export const apiOperateCount = params => get(url + '/order/allNoOperateCount',params) //获取订单没有处理的数量