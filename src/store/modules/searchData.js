/*
 * @Description: 保存搜索数据
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-27 09:12:36
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-09-29 11:33:43
 */

const state = {
  searchSaveData: {}, // 初始化一个搜索对象
};
const getters = {
  changeData(state) { // 菜单数组发生变化
    return state.searchSaveData;
  }
};
const mutations = {
  changeSearchData(state, items) { //searchSaveData,插入items
    state.searchSaveData = items
  }
};
const actions = {
  changeSearch(context, item) { //触发mutations里面的changeSearchData ,传入数据形参item 对应到item
    context.commit('changeSearchData', item);
  }
};
export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}