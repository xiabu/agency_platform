<!--
 * @Description: 列表搜索封装
 * @Author: 赵亮
 * @Date: 2019-09-11 08:42:46
 * @LastEditTime: 2019-11-13 11:38:27
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="search">
    <el-form :inline="true" :model="searchData" ref="searchData">
      <template v-for="(item, index) in searchItem">
        <el-form-item v-if="!item.type || item.type === 'input'" :label="item.label" :key="item.prop" :prop="item.prop" :label-width="item.width">
          <el-input v-model="searchData[item.prop]" maxlength="40" clearable :placeholder="item.placeholder" @keyup.enter.native="handleSearch()"></el-input>
        </el-form-item>
        <el-form-item v-if="item.type=== 'select'" :label="item.label" :key="item.prop" :prop="item.prop" :label-width="item.option_width">
          <el-select v-model="searchData[item.prop]" :placeholder="item.placeholder" :clearable="!item.isClear" @change="handleChange">
            <el-option v-for="i in item.selectList" :placeholder="i.placeholder" :label="i.label" :value="i.value" :key="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type=== 'city'" :label="item.label" :key="item.prop" :label-width="item.label_width">
          <el-select v-model="searchData[item.cityItem[0]]" clearable placeholder="请选择省" @change="handleChangeAddress(item.cityItem)">
            <el-option v-for="(item, index) in addressItem" :key="item.value" @click.native="handleClickAddress(index)" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select class="city-select" v-model="searchData[item.cityItem[1]]" clearable placeholder="请选择市" @change="handleChangeCity(item.cityItem, searchData[item.cityItem[1]])">
            <el-option v-for="item in cityItemList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type=== 'time'" :label="item.label" :key="index">
          <el-form-item :prop="item.timeList[0]">
            <el-date-picker clearable type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="searchData[item.timeList[0]]" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <span class="search-time">-</span>
          <el-form-item :prop="item.timeList[0]">
            <el-date-picker clearable type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" v-model="searchData[item.timeList[1]]" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="item.type=== 'monthrange'" :label="item.label" :key="index">
          <el-date-picker
            v-model="monthrangeDate"
            :editable="false"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="-"
            :picker-options="pickerOptions"
            @change="handleOnPick(item.prop)"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="item.type=== 'daterange'" :label="item.label" :key="index" class="daterange">
          <el-date-picker
            v-model="monthrangeDate"
            :editable="false"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            :picker-options="pickerOptions"
            @change="handleOnPick1(item.prop)"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </template>
      <el-form-item class="searchFloat">
        <el-button class="search_btn" type="primary" @click="handleSearch()">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
import addressData from "../assets/json/address.json";
import { setTimeout } from "timers";
export default {
  props: {
    searchData: {
      // 搜索数据
      type: Object,
      required: true
    },
    searchItem: {
      // 搜索框数据
      type: Array,
      required: true
    },
    pageParams: {
      // 分页数据
      type: Object
    }
  },
  data() {
    return {
      // 时间选择限制
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      addressItem: [], // 省级数据
      cityItemList: [], // 市级数据
      monthrangeDate: [] // 日期选择数据
    };
  },
  created() {
    this.addressItem = addressData;
  },
  watch: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当搜索数据发生变化时，保存数据到vuex
     * @param { Object } newData [变化的数据]
     * @Date: 2019-09-24 16:43:01
     */
    searchData(newData) {
      setTimeout(() => {
        this.searchData = newData;
      });
      this.$store.dispatch("searchData/changeSearch", newData);
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 日期时间发生变化时
     * @param { Array } prop [时间选择prop值]
     * @Date: 2019-09-24 16:43:01
     */
    handleOnPick(prop) {
      if (this.monthrangeDate) {
        this.searchData[prop[0]] = this.monthrangeDate[0];
        this.searchData[prop[1]] = this.monthrangeDate[1];
      } else {
        this.searchData[prop[0]] = "";
        this.searchData[prop[1]] = "";
      }
      this.pageParams.pageNum = 1;
      this.$emit("getDataList", this.searchData);
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 日期时间处理
     * @param {type} * @param { Array } prop [时间选择prop值]
     * @Date: 2019-11-13 11:28:34
     */
    handleOnPick1(prop) {
      if (this.monthrangeDate) {
        this.searchData[prop[0]] = this.monthrangeDate[0] + " 00:00:00";
        this.searchData[prop[1]] = this.monthrangeDate[1] + " 23:59:59";
      } else {
        this.searchData[prop[0]] = "";
        this.searchData[prop[1]] = "";
      }
      this.pageParams.pageNum = 1;
      this.$emit("getDataList", this.searchData);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 省选择框发生变化时 通过index, 获取市级内容
     * @param { Number } index [当前选择省级index值]
     * @Date: 2019-09-24 16:43:01
     */
    handleClickAddress(index) {
      this.cityItemList = this.addressItem[index].children;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 日期时间发生变化时
     * @param { String } city [市级prop值]
     * @Date: 2019-09-24 16:43:01
     */
    handleChangeAddress(city) {
      if (this.searchData[city[1]]) {
        this.searchData[city[1]] = "";
      }
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 市级选择框有值时,请求接口数据
     * @param { String } value [城市值]
     * @param { Object } city [城市对象]
     * @Date: 2019-09-24 16:43:01
     */
    handleChangeCity(city, value) {
      this.pageParams.pageNum = 1;
      this.$emit("getDataList", this.searchData);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 按钮事件
     * @param { String } fn [函数名字]
     * @param { Object } row [当前列表数据]
     * @return: 父组件调用函数
     * @Date: 2019-09-24 16:43:01
     */
    handleClick(row, fn) {
      return this.$parent[fn](row);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 搜索按钮
     * @Date: 2019-09-24 16:43:01
     */
    handleSearch() {
      this.pageParams.pageNum = 1;
      this.$emit("getDataList", this.searchData);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 下拉框修改
     * @Date: 2019-09-24 16:43:01
     */
    handleChange() {
      this.pageParams.pageNum = 1;
      this.$emit("getDataList", this.searchData);
    }
  }
};
</script>
<style lang="less">
.search {
  background: rgba(247, 248, 250, 1);
  border-radius: 4px;
  padding: 25px 0px 5px;
  margin-bottom: 20px;
  .searchFloat {
    display: block !important;
  }
  .daterange {
    .el-input__inner {
      width: 240px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #e5e5e5;
    }
  }
  .search_btn {
    margin-left: 40px;
    color: #fff;
    font-size: 14px;
  }
  .el-form--inline .el-form-item {
    margin: 0 50px 20px;
  }
  .el-form-item__label {
    color: #222222;
    font-weight: 400;
    font-size: 14px;
  }
  .el-input__inner {
    width: 200px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e5e5e5;
  }
  .el-input {
    width: 200px;
  }
  .el-select {
    width: 200px;
  }
  .city-select {
    margin-left: 20px;
  }
  .search-time {
    width: 30px;
    text-align: center;
    display: inherit;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    font-size: 14px;
  }
}
</style>

