/*
 * @Description: 员工接口
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-19 09:54:21
 * @LastEditors: 郭亮（849324068@qq.com）
 * @LastEditTime: 2019-10-08 20:18:44
 */
import {
  get,
  post
} from './index'

export const getEmployeeList = params => get('/list/employee/getEmployeeList', params) //获取员工列表

export const deleteEmployeeList = params => get('/list/employee/delete', params) //删除员工

export const editEmployeeList = params => post('/list/employee/addAndUpdateEmployee', params) //添加和修改员工

export const checkPhone = params => post('/list/user/checkPhone', params) //添加员工时的手机号校验

export const getAdminAddEmployee = params => get('/list/employee/adminAddEmployee', params) //超管添加员工

export const findShopByPhone = params => get('/list/shop/findShopByPhone', params) //根据手机号获取店铺信息，有就有，没有返回的数据为null

export const submitFormGetMoney = params => post('/list/shop/submitFormGetMoney', params) //提交表单时获取金额

export const submitForm = params => post('/list/shop/submitForm', params) //提交表单
