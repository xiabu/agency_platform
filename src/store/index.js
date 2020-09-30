/*
 * @Description: 
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-27 09:04:07
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-09-29 11:36:25
 */
import Vue from 'vue';
import Vuex from 'vuex';
import meun from './modules/meun';
import searchData from './modules/searchData';
import tableData from './modules/tableData';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    meun,
    searchData,
    tableData
  }
});