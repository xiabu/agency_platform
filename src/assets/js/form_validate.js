/*
 * @Description: 全局表单校验规则
 * @Author: 赵亮
 * @Date: 2019-09-16 20:50:40
 * @LastEditTime: 2019-09-26 14:39:47
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-09-26 20:14:18
 * @LastEditors: 郭亮（849324068@qq.com）
 */

// 小数校验
export const validateNum = (rule, value, callback) => {
  let reg = /^\d+(?=\.{0,1}\d+$|$)/;
  let dot = String(value).indexOf(".");
  if (dot != -1) {
    let dotCnt = value.substring(dot + 1, value.length);
    if (dotCnt.length > 2) {
      callback(new Error("小数点后不得超过两位"))
      return false;
    }
  }
  if (value != "") {
    if (!reg.test(value)) {
      callback(new Error("请输入正确的数字"));
      return false;
    }
  }
  callback();
};

// 正整数校验
export const validateInteger = (rule, value, callback) => {
  let reg = /(^[1-9]\d*$)/;
  if (value != "") {
    if (!reg.test(value)) {
      callback(new Error("请输入正整数"));
      return false;
    }
  }
  callback();
};
// 正整数校验
export const validateScaleInteger = (rule, value, callback) => {
  let reg = /(^[1-9]\d*$)/;
  if (value != "") {
    if (!reg.test(value)) {
      callback(new Error("请输入1-100的正整数"));
      return false;
    }
  }
  callback();
};
// 链接类校验
export const validateHttp = (rule, value, callback) => {
  let reg = /^(http:\/\/|^https:\/\/|^\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  if (value != "") {
    if (!reg.test(value)) {
      callback(new Error("请输入正确的链接"));
      return false;
    }
  }
  callback();
};

// 数值大小校验
export const validateScale = (rule, value, callback) => {
  let reg = /^[0-9]+.?[0-9]*$/;
  if (value != "") {
    if (!reg.test(value)) {
      callback(new Error("请输入数字值"));
      return false;
    } else {
      if (value > 100) {
        callback(new Error("请输入1-100的整数"));
        return false;
      } else {
        callback();
      }
    }
  }
  callback();
};