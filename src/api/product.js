/*
 * @Description: 商品請求接口
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-19 10:43:36
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-10-14 13:42:26
 */
import { get, post } from './index'

export const findProductList = params => get('/list/product/findProductList', params)

export const editProduct = params => post('/list/product/addAndUpdateProduct',params)//添加或修改商品的接口

export const getProductData = params => get('/list/product/findProduct',params) //获取商品详情

export const getPHPData = params => get('/list/product/findPHPProduct',params) //获取php商品列表版本

export const apiBacthDelete = params => get('/list/product/batchDelete',params) //批量删除商品