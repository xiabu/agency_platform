/*
 * @Description: 保存搜索数据
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-27 09:12:36
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-09-29 14:05:57
 */

const state = {
  tableSaveData: [], // 初始化一个列表数组
};
const getters = {
  changeData(state) { // 菜单数组发生变化
    return state.tableSaveData;
  }
};
const mutations = {
  changeTableData(state, items) { //tableSaveData,插入items
    state.tableSaveData = items
  }
};
const actions = {
  changeTable(context, item) { //触发mutations里面的changeSearchData ,传入数据形参item 对应到item
    context.commit('changeTableData', item);
  }
};
export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}