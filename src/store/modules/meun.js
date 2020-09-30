/*
 * @Description: 创建meun列表
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-27 09:12:36
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 * @LastEditTime: 2019-10-10 17:33:00
 */

const state = {
  meunList: [] // 初始化一个菜单数组
};
const getters = {
  changeMenu(state) { // 菜单数组发生变化
    return state.meunList;
  }
};
const mutations = {
  changeMenuList(state, items) { //meunList,插入items
    let menuRouterArr = JSON.parse(localStorage.getItem("allMenuData"));
    menuRouterArr.forEach(item => {
      if (item.isShow.indexOf(items) !== -1) {
        item.isShow = true;
      } else {
        item.isShow = false;
      }
    })
    state.meunList = menuRouterArr;
    localStorage.setItem('meunItem', JSON.stringify(menuRouterArr));
  }
};
const actions = {
  changeMenuType(context, item) { //触发mutations里面的changeMenuList ,传入数据形参index 对应到index
    context.commit('changeMenuList', item);
  }
};
export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  getters,
  mutations,
  actions
}