﻿<!--
 * @Description: 封装table组件
 * @Author: 赵亮
 * @Date: 2019-09-11 08:42:29
 * @LastEditTime: 2019-11-05 09:47:36
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
/**
*  tableData: table列表的值
*  tableItem: 表格信息配置（prop：绑定参数，label：表头名称，width：单元格宽度，type：单元格类型[img, btn, selection], fixed: 固定列）
*  tableBtnItem: 表格操作按钮（type：按钮类型，icon：按钮图标，size：按钮大小[默认mini]，name：按钮名字，fnName: 按钮事件名称[一定要在父组件绑定该事件]）
*  getSelecData: 固定写法，为了在父组件中，获取勾选的数组。（有用到的时候，父组件必须绑定该方法）
*  pageParams: pageNum：当前页码，pageSize：每页条数，total：总共多少条
*  exportUrl: 导出链接以及信息
*  isShowDelete: 是否显示批量删除按钮
*/
<template>
  <div class="table1">
    <el-table :data="tableData" :header-cell-style="headerCell" :cell-style="cellCss"
      @selection-change="handleSelectionChange" @sort-change="handleChangeSort" style="width: 100%">
      <template v-for="(item, index) in tableItem">
        <el-table-column :key="index" v-if="!item.type" :prop="item.prop" :sortable="item.isSort" :label="item.label"
          :width="item.width">
          <template slot-scope="scope">
            <span v-if="scope.row[item.prop]">{{scope.row[item.prop]}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'formatter'" :prop="item.prop" :sortable="item.isSort"
          :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <span v-if="item.prop==='rechargeType'">{{scope.row[item.prop]===0 ? '申请充值' : '上级手动充值'}}</span>
            <span v-else-if="item.prop==='needNote'">{{scope.row[item.prop]===0 ? '否' : '是'}}</span>
            <span v-else-if="item.prop==='orderStatus'">
              <span v-if="scope.row[item.prop]===0" style="color:#4DA1FF">待审核</span>
              <span v-if="scope.row[item.prop]===1">已通过</span>
              <span v-if="scope.row[item.prop]===2">已拒绝</span>
            </span>
            <span v-else-if="item.prop==='billDetail'">
              <span v-if="scope.row[item.prop]===0">账户充值 ¥
                {{Number(scope.row['amount']/100).toFixed(2)}}</span>
              <span v-if="scope.row[item.prop]===1">新购系统</span>
              <span v-if="scope.row[item.prop]===2">续费系统</span>
              <span v-if="scope.row[item.prop]===3">给下级代理商充值 ¥
                {{Number(scope.row['amount']/100).toFixed(2)}}</span>
              <span v-if="scope.row[item.prop]===4">降低下级拿货折扣比例</span>
              <span v-if="scope.row[item.prop]===5">上调下级拿货折扣比例</span>
              <span v-if="scope.row[item.prop]===6">系统版本变更</span>
              <span v-if="scope.row[item.prop]===7">版本结算</span>
            </span>
            <span v-if="item.prop==='billType'">{{scope.row[item.prop]===0 ? '支出' : '收入'}}</span>
            <span v-if="item.prop==='amount'">
              <span v-if="scope.row['billType'] === 1" style="color:#83D587">+ ¥
                {{Number(scope.row[item.prop]/100).toFixed(2)}}</span>
              <span v-else-if="scope.row['billType'] === 0" style="color:#FF7B8C">- ¥
                {{Number(scope.row[item.prop]/100).toFixed(2)}}</span>
            </span>
            <span v-if="item.prop==='balance'">¥ {{Number(scope.row[item.prop]/100).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column type="selection" v-if="item.type === 'selection'" :key="index" :sortable="item.isSort"
          :width="item.width">
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'textColor'" :prop="item.prop" :sortable="item.isSort"
          :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <p v-html="formatterTextColor(scope.row[item.prop])"></p>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'tooltip'" :prop="item.prop" :sortable="item.isSort"
          :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <el-tooltip effect="dark" class="item" popper-class='atooltip' v-if="scope.row[item.prop]" :content="scope.row[item.prop]" placement="top">
              <p class="tooltip-dark">{{scope.row[item.prop]}}</p>
            </el-tooltip>
            <p class="tooltip-dark1" v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'Mtext'" :prop="item.prop" :label="item.label"
          :sortable="item.isSort" :width="item.width">
          <template slot-scope="scope">
            <p v-html="formatterMtext(scope.row[item.prop])"></p>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'MtextBlue'" :prop="item.prop" :label="item.label"
          :sortable="item.isSort" :width="item.width">
          <template slot-scope="scope">
            <p>{{scope.row[item.prop][0]}}</p>
            <p>{{scope.row[item.prop][1]}}</p>
            <p class="bluePage" @click="handleToPageDetail(scope.row)">{{scope.row[item.prop][2]}}</p>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'money'" :prop="item.prop" :label="item.label"
          :sortable="item.isSort" :width="item.width">
          <template slot-scope="scope">
            <p v-html="formatterMoney(scope.row[item.prop])"></p>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'img'" :prop="item.prop" :sortable="item.isSort"
          :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <p @click="handleSwipeImg(scope.row[item.prop])" v-html="formatterImg(scope.row[item.prop])"></p>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'btn'" :label="item.label" :width="item.width"
          :fixed="item.fixed">
          <template slot-scope="scope">
            <template v-if="isShowBtn">
              <div v-show="scope.row.btnShow[index]" class="item-btn" v-for="(item, index) in tableBtnItem" :key="index">
                <el-button  :class="item.className"
                  :key="index" :type="item.type" :icon="item.icon" :size="item.size || 'mini'"
                  @click="handleFn(item.fnName, scope.$index, scope.row)">
                  {{item.name}}
                </el-button>
              </div>
            </template>
            <template v-else>
              <el-button v-for="(item, index) in tableBtnItem" :class="item.className" :key="index" :type="item.type"
                :icon="item.icon" :size="item.size || 'mini'" @click="handleFn(item.fnName, scope.$index, scope.row)">
                {{item.name}}
              </el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-if="item.type === 'ground'" :prop="item.prop" :sortable="item.isSort" :label="item.label"
          :width="item.width">
          <template slot-scope="scope">
            <span v-if="scope.row[item.prop]" :class="scope.row[item.prop] == '否'?'red':''">{{scope.row[item.prop]}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="table-btn" v-if="tableItem[0].type === 'selection' && !isShowDelete">
      <el-button :disabled="disable" @click="handleExport">批量导出</el-button>
      <el-button type="primary" :disabled="tableData.length < 1" @click="handleExportAll">全部导出</el-button>
    </div>
    <div class="table-btn" v-if="isShowDelete">
      <el-button :disabled="disable" @click="handleDeleteBatch">批量删除</el-button>
    </div>
    <el-pagination class="pagination" background :hide-on-single-page="pageParams.total < 1"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageParams.pageNum"
      :page-size="pageParams.pageSize" layout="total, prev, pager, next" :total="pageParams.total">
    </el-pagination>
    <el-dialog title="查看图片" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <el-carousel :autoplay="false">
        <el-carousel-item v-for="(item, index) in itemUrl" :key="index">
          <img :src="'http://agencytest.oss-cn-hangzhou.aliyuncs.com/' + item" alt="" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios"; // 引入axios
import Vue from "vue";
export default {
  props: {
    tableData: {
      type: Array
    },
    tableItem: {
      type: Array
    },
    tableBtnItem: {
      type: Array
    },
    pageParams: {
      type: Object
    },
    exportUrl: {
      type: String
    },
    isShowBtn: {
      type: Boolean
    },
    isShowDelete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cdn_url: "http://agencytest.oss-cn-hangzhou.aliyuncs.com/",
      itemUrl: [], // 轮播图片
      dialogTableVisible: false, // 弹出框状态
      activeData: [], // 勾选内容
      disable: true // 是否可以导出
    };
  },
  watch: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当有勾选数据时，批量按钮可以点击
     * @Date: 2019-09-24 16:43:01
     */
    activeData(newValue) {
      if (this.activeData.length <= 0) {
        this.disable = true;
      } else {
        this.disable = false;
      }
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 批量删除
     * @param { Object } column [当前列表数据]
     * @Date: 2019-09-24 16:43:01
     */
    handleDeleteBatch() {
      this.$emit("handleDeleteBatch");
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 排序发生变化时
     * @param { Object } column [当前列表数据]
     * @Date: 2019-09-24 16:43:01
     */
    handleChangeSort(column) {
      this.$emit("handleSort", [column.order, column.prop]);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 是否显示操作按钮
     * @param { Object } row [当前列表index值]
     * @param { Object } btn [操作按钮]
     * @Date: 2019-09-24 16:43:01
     */
    handleShowBtn(btn, row) {
      row.btnShow.forEach(item => {
        if (item === btn.name) {
          return true;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 多行文本
     * @param { Object } row [当前列表数据]
     * @Date: 2019-09-24 16:43:01
     */
    formatterMtext(row) {
      let str = "";
      if (row) {
        row.forEach(item => {
          if (
            item[0] !== "blue" &&
            item[0] !== "redTxt" &&
            item[0] !== "green"
          ) {
            str += `<p class="mText">${item}</p>`;
          } else {
            str += `<p class=${item[0]}>${item[1]}</p>`;
          }
        });
        return str;
      } else {
        return "-";
      }
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 列表数据跳代理商详情
     * @param { Object } row [当前列表数据]
     * @return: 格式化文本标签
     * @Date: 2019-09-24 16:43:01
     */
    handleToPageDetail(row) {
      localStorage.setItem("menuActiveParent", "/agent"); // 保存选中父菜单路由
      localStorage.setItem("menuActiveIndex", "/agent"); // 保存选中子菜单路由
      let menuCrumb = [
        {path: "/agent", meta: {title: "代理商管理"}},
        {path: "/agent", meta: {title: "代理商管理"}}
      ];
      localStorage.setItem("menuCrumbItem", JSON.stringify(menuCrumb)); // 保存当前面包屑菜单
      this.$router.push({
        name: "agentDetail",
        params: {
          proxyId: row.proxyId,
          name: row.proxyCompanyName
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 金额的字段，添加￥，并除以100保留两位小数
     * @param { Object } row [当前列表数据]
     * @return: 格式化文本标签
     * @Date: 2019-09-24 16:43:01
     */
    formatterMoney(row) {
      let str;
      if (row === 0 || row) {
        let num = Number(row / 100).toFixed(2);
        str = `<span>￥${num}</span>`;
        return str;
      } else {
        str = `<span>-</span>`;
        return str;
      }
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 单元格格式化文本颜色
     * @param { Object } row [当前列表数据]
     * @return: 格式化文本标签
     * @Date: 2019-09-24 16:43:01
     */
    formatterTextColor(row) {
      let str;
      if (row) {
        str = `<span class=${row[0]}>${row[1]}</span>`;
        return str;
      } else {
        return "-";
      }
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 单元格格式化图片
     * @param { Object } row [当前列表数据]
     * @return: 格式化文本标签
     * @Date: 2019-09-24 16:43:01
     */
    formatterImg(row) {
      try {
        row = JSON.parse(row);
      } catch (error) {}
      let str;
      let rowArr = row;
      if (row) {
        let urlImg = `http://agencytest.oss-cn-hangzhou.aliyuncs.com/${rowArr[0]}`;
        if (rowArr.length === 1) {
          str = `<img class="table1-img" src=${urlImg} alt=""/>`;
          return str;
        } else if (rowArr.length < 1) {
          str = "-";
          return str;
        } else {
          str = `<img class="table1-img" src=${urlImg} alt=""/><p>${
            rowArr.length
          }张</p>`;
          return str;
        }
      } else {
        str = "-";
        return str;
      }
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 图片轮播
     * @param { Array } row [图片数组]
     * @Date: 2019-09-24 16:43:01
     */
    handleSwipeImg(row) {
      this.itemUrl = [];
      this.$nextTick(() => {
        this.itemUrl = eval(row);
        if (this.itemUrl.length > 0) {
          this.dialogTableVisible = true;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 全部导出按钮
     * @Date: 2019-09-24 16:43:01
     */
    handleExportAll() {
      let tableAllData = this.$store.state.tableData.tableSaveData;
      let searchObj = this.$store.state.searchData.searchSaveData;
      let userToken = JSON.parse(localStorage.getItem("token")).userToken;
      axios.defaults.headers = {
        // 请求头设置userToken
        userToken: userToken
      };
      delete searchObj["pageNum"]; // 删除pageNum字段
      delete searchObj["total"]; // 删除total字段
      delete searchObj["pageSize"]; // 删除pageSize字段
      let keyArr = Object.keys(searchObj); // 搜索对象的key
      let valueArr = Object.values(searchObj); // 搜索对象的value值
      let downUrl = ""; // 拼接所需参数
      keyArr.forEach((item, index) => {
        downUrl += `&${item}=${valueArr[index]}`;
      });
      location.href = `${this.exportUrl}?userToken=${userToken}${downUrl}`;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 批量导出按钮
     * @Date: 2019-09-24 16:43:01
     */
    handleExport() {
      this.$emit("exportExcel");
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当每页条数发生变化时
     * @param { Number } val [当前页码条数值]
     * @Date: 2019-09-24 16:43:01
     */
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.$emit("getDataList");
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 列表操作按钮函数
     * @param { Number } val [当前页码]
     * @Date: 2019-09-24 16:43:01
     */
    // 当前页码发生改变
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.$emit("getDataList");
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 列表勾选
     * @param { Array } selection [选中列表数据]
     * @Date: 2019-09-24 16:43:01
     */
    handleSelectionChange(selection) {
      this.activeData = selection;
      this.$emit("getSelecData", selection);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 列表操作按钮函数
     * @param { String } fn [函数名字]
     * @param { Number } index [当前列表index值]
     * @param { Object } row [当前列表数据]
     * @Date: 2019-09-24 16:43:01
     */
    handleFn(fn, index, row) {
      this.$emit(fn, row);
    },
    // 表头样式
    headerCell({ row, rowIndex }) {
      return "text-align:center";
    },
    // 单元格样式
    cellCss({ row, rowIndex }) {
      return "text-align:center";
    }
  }
};
</script>
<style lang="less">
.table1 {
  border: 1px solid rgba(229, 229, 229, 1);
  border-radius: 4px;
  border-bottom: none;
  background: #e5e5e5;
  th {
    font-size: 14px;
    font-weight: bold;
    color: rgba(102, 102, 102, 1);
    background: rgba(247, 248, 250, 1);
  }
  td {
    color: #666666;
    font-size: 14px;
    font-weight: 400;
  }
  .pagination {
    float: right;
    margin-top: 20px;
  }
  .el-pagination__total {
    color: #333;
    font-size: 14px;
    font-weight: 400;
  }
  .table-btn {
    margin-top: 20px;
    float: left;
    background: #fff;
  }
  .red {
    color: #ff7b8c;
  }
  .blue {
    color: #4da1ff;
  }
  .bluePage {
    color: #4da1ff;
    cursor: pointer;
  }
  .redTxt {
    color: #ff7b8c;
    font-size: 12px;
    font-weight: 400;
  }
  .green {
    color: #83d587;
    font-size: 12px;
    font-weight: 400;
  }
  .el-dialog {
    width: 800px !important;
  }
  .el-carousel__container {
    height: 400px;
    background: #f5f5f5;
  }
}
.atooltip {
  min-width: 100px;
  max-width: 300px;
  background: #000 !important;
  color: #fff;
  font-size: 12px;
  line-height: 22px;
}
.tooltip-dark {
  width: 100px;
  height: 50px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.tooltip-dark1 {
  height: 40px;
  line-height: 40px;
}
.table1-img {
  width: 50px;
  height: 50px;
  background: rgba(204, 204, 204, 1);
  border-radius: 4px;
  cursor: pointer;
}
.btnRed {
  color: #ff8d9c;
  text-align: right;
}
.el-pagination {
  float: left;
}
.el-carousel__item {
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
