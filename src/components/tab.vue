<!--
 * @Description:
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-09-23 09:03:45
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-16 19:46:11
 -->
<template>
  <ul class="tab-list-wao">
    <li class="tab-list" v-for="(item , index) in tabItem" :key="index" :class="active === index ? 'active' : ''"
      @click="handleActive(index)">
      {{item.name}}<span v-show="showTabNum && item.num !== 0"
        :class="active === index ? 'color-blue' : 'color-red'">（{{item.num}}）</span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    tabItem: {
      type: Array
    },
    showTabNum: {
      type: Boolean,
      default: false
    },
    currentTab:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      active: this.currentTab, //当前选中的值
    };
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 当tab切换时，向父组件发送当前tab的index值
     * @param {type}
     * @return:
     * @Date: 2019-09-25 19:14:27
     */
    handleActive(index) {
      this.active = index;
      this.$emit("tabActiveIndex", index);
    }
  }
};
</script>
<style lang="less" scope>
.tab-list-wap {
  display: flex;
  justify-content: space-around;
  background: #fff;
}
.tab-list {
  margin-right: 60px;
  width: auto;
  float: left;
  font-size: 14px;
  color: #666666;
  text-align: center;
  cursor: pointer;
}
.tab-list:hover {
  color: #4da1ff;
}
.active {
  color: #4da1ff;
  border-bottom: 2px #4da1ff solid;
}
.color-blue {
  color: #4da1ff;
  margin-left: 5px;
}
.color-red {
  color: #ff7b8c;
  margin-left: 5px;
}
.color-red:hover,
.color-blue:hover {
  opacity: 0.8;
}
</style>