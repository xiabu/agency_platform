/*
 * @Description: 
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-09-20 13:54:41
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-09-27 19:41:05
 */
import { get,post } from './index'

export const userLogin = params => post('/list/user/login', params) //获取用户登录接口