/*
 * @Description: 设置接口
 * @Author: 李沛韬（929498346@qq.com）
 * @Date: 2019-10-10 10:52:41
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-10-11 10:14:30
 */
import {
  get,
  post
} from './index'

export const updateProxyCom = params => post('/list/proxyCompany/updateProxyCom', params) //修改代理商信息
export const getProxyCom = params => get('/list/proxyCompany/getProxyCom', params) //获取代理商信息
export const updatePayPassword = params => get('/list/proxyCompany/updatePayPassword', params) //获取代理商信息