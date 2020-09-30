/*
 * @Description: 封装get，post请求, 请求拦截, 响应拦截
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-19 11:03:14
 * @LastEditTime: 2019-10-09 09:30:32
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 */

import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据 

/**
 * @author: 赵亮（cxpzl.mq@gmail.com）
 * @description: 请求发送拦截
 * @Date: 2019-09-24 16:58:01
 */
axios.interceptors.request.use(request => {
  if (localStorage.getItem('token')) { // 判断是否存在token，没有跳转login页面
    //设置默认请求头
    axios.defaults.headers = {
      'userToken': JSON.parse(localStorage.getItem('token')).userToken
    }
  }
  return request;
}, function (error) {
  return Promise.reject(error);
});

/**
 * @author: 赵亮（cxpzl.mq@gmail.com）
 * @description: 响应拦截
 * @Date: 2019-09-24 16:59:01
 */
axios.interceptors.response.use(response => {
  if (response.data.code === 40000) {
    localStorage.removeItem("token");
    localStorage.removeItem("meunItem");
    localStorage.removeItem("menuActiveIndex");
    localStorage.removeItem("menuActiveParent");
    localStorage.removeItem("menuCrumbItem");
    router.replace({
      path: '/login'
    })
    return false;
  }
  return response;
}, error => {
  return Promise.resolve(error.response);
})

/**
 * @author: 赵亮（cxpzl.mq@gmail.com）
 * @description: get请求
 * @param { String } url [接口]
 * @param { Object } params [接口请求传参]
 * @Date: 2019-09-24 17:00:01
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data)
    })
  }).catch((err) => {
    console.log(err)
  })
}

/**
 * @author: 赵亮（cxpzl.mq@gmail.com）
 * @description: getBlod请求
 * @param { String } url [接口]
 * @param { Object } params [接口请求传参]
 * @Date: 2019-09-24 17:00:01
 */
export function getBlod(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      responseType: 'blob'
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err.data);
    })
  }).catch((err) => {
    console.log(err)
  })
}

/**
 * @author: 赵亮（cxpzl.mq@gmail.com）
 * @description: post请求
 * @param { String } url [接口]
 * @param { Object } params [接口请求传参]
 * @Date: 2019-09-24 17:00:01
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  }).catch((res) => {
    console.log(res)
  })
}

/**
 * @author: 赵亮（cxpzl.mq@gmail.com）
 * @description: postImg请求
 * @param { String } url [接口]
 * @param { Object } params [接口请求传参]
 * @Date: 2019-09-24 17:00:01
 */
export function postImg(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  }).catch((res) => {
    console.log(res)
  })
}