/*
 * @Description: 
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-10-16 14:07:52
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-16 16:07:24
 */
import { post, get } from './index' 
const url = '/list'
// 请求接口

export const apiGetNotify = params => get(url + '/notify/getNotify', params) //获取消息通知列表数据

export const apiAllIsRead = params => get(url + '/notify/updateAllIsRead', params) //修改所有消息为已读

export const apiDateIsRead = params => get(url + '/notify/updateIsRead', params) //消息通知已读