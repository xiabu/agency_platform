<!--
 * @Description: 省市区封装
 * @Author: 赵亮
 * @Date: 2019-09-17 15:09:52
 * @LastEditTime: 2019-10-21 15:00:09
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-09-20 14:54:32
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
<template>
  <div class="address">
    <el-select v-model="addresValue" placeholder="请选择省" @change="handleChange">
      <el-option v-for="(item, index) in addressItem" :key="item.value" :label="item.label"
        :value="item.label + '-' + item.value + '-' + index"></el-option>
    </el-select>
    <el-select v-model="cityValue" placeholder="请选择市">
      <el-option v-for="item in cityItem" :key="item.value" :label="item.label" :value="item.label + '-' + item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import addressData from "../assets/json/address.json";
export default {
  props: {
    addressObj: {
      // 省市对象
      type: Object
    },
    cityVal: {
      // 城市值
      type: String,
      default: ""
    },
    addresVal: {
      // 省级值
      type: String,
      default: ""
    }
  },
  data() {
    return {
      cityValue: this.cityVal, // 城市值
      addresValue: this.addresVal, // 省级值
      addressItem: [], // 省级数据
      cityItem: [] // 市级数据
    };
  },
  watch: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 监听市值变化
     * @param {type}
     * @return:
     * @Date: 2019-10-21 14:58:43
     */
    cityValue(newValue) {
      this.addressObj.city = newValue;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 监听省值变化
     * @param {type}
     * @return:
     * @Date: 2019-10-21 14:59:10
     */
    addresValue(newValue) {
      this.addressObj.address = newValue;
    }
  },
  created() {
    this.addressItem = addressData;
    if (this.addresValue !== "" && this.cityValue !== "") {
      this.handleChange1();
    }
  },
  methods: {
    // 当省级发生变化时，置空市级，然后赋市级新值
    handleChange() {
      let addressArr = this.addresValue.split("-");
      this.cityValue = "";
      this.cityItem = this.addressItem[parseInt(addressArr[2])].children;
    },
    //不置空
    handleChange1() {
      let addressArr = this.addresValue.split("-");
      this.cityItem = this.addressItem[parseInt(addressArr[2])].children;
    }
  }
};
</script>
<style lang="less">
.address {
  .el-select {
    .el-input {
      width: 190px;
      margin-right: 20px;
    }
  }
}
</style>

