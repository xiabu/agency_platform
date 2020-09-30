<!--
 * @Description: 关联员工列表弹窗页面
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-16 08:46:15
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-11-18 10:45:32
 -->
<template>
  <div class="select_emp">
    <el-dialog title="选择员工" :visible.sync="visible" width="800px !important" @close="close"
      :close-on-click-modal="false">
      <div style="padding-bottom:45px">
        <div class="select_search">
          <el-input v-model="search_name" placeholder="姓名" class="search-input" maxlength="40" clearable>
          </el-input>
          <el-button type="primary" @click='searchBtn'>查询</el-button>
        </div>
        <div class="select_table">
          <el-table :data="changeDataList" :header-cell-style="{
          'background-color': 'rgba(247,248,250,1)',
          'font-size':'14px',
          'font-family':'Microsoft YaHei',
          'font-weight':'bold',
          'color':'rgba(102,102,102,1)',
          }" border>
            <el-table-column width="54px">
              <template slot-scope="scope">
                <el-radio class="radio" v-model="radio" :label="scope.row.id" @change="getData(scope.row)">&nbsp;
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="empName" label="姓名" width="320px" align="center">
            </el-table-column>
            <el-table-column prop="mobilePhone1" label="手机号" align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="block">
          <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage"
            :page-size="pageSize" layout="total, prev, pager, next" :total="totalCount">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click='close'>取 消</el-button>
        <el-button type="primary" @click='determine()'>确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getEmployeeList } from "../api/employee.js";
export default {
  name: "employee",
  props: {
    show: { type: Boolean, default: false } //控制是否显示
  },
  data() {
    return {
      currentPage: 1, //当前页
      pageSize: 5, //每页显示条数
      search_name: "", //查询姓名
      totalCount: 0, //员工信息条数
      //列表内容
      tableData: [],
      //员工名字
      empName: "",
      //单选控制
      radio: "",
      visible: this.show //控制dialog显示
    };
  },
  created() {
    this.loadData();
  },
  watch: {
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 监控弹窗是否关闭
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:16:53
     */
    show: {
      immediate: true,
      handler(show) {
        this.visible = show;
        if (show) {
          this.loadData();
        }
      }
    }
  },
  computed: {
    changeDataList() {
      this.tableData.forEach(item => {
        item.mobilePhone1 = item.mobilePhone !== "" ? item.mobilePhone : "-";
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 关闭弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:32:32
     */
    close() {
      this.$emit("update:show", false); // 子组件更新弹框隐藏
      this.radio = "";
      this.search_name = "";
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 查询按钮事件
     * @param {type}
     * @return:
     * @Date: 2019-09-17 11:02:20
     */
    searchBtn() {
      this.loadData();
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 关闭弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-17 11:00:38
     */

    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 获取已选择员工信息
     * @param {type}
     * @return:
     * @Date: 2019-09-17 11:00:48
     */
    getData(data) {
      this.radio = data.id;
      this.empName = data;
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 确认按钮事件
     * @param {type}
     * @return:
     * @Date: 2019-09-17 11:01:09
     */
    determine() {
      this.$emit("empName", this.empName);
      this.radio = "";
      this.search_name = "";
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 页码跳转
     * @param {type}
     * @return:
     * @Date: 2019-09-17 11:01:47
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.tableData.length > 0) {
        this.loadData();
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 加载员工列表数据
     * @param {type}
     * @return:
     * @Date: 2019-09-25 21:02:36
     */
    loadData() {
      let _this = this;
      var params = {
        pageSize: _this.pageSize,
        pageNum: _this.currentPage,
        empName: _this.search_name
      };
      getEmployeeList(params).then(res => {
        if (res.code === 200) {
          _this.tableData = res.data.list;
          _this.totalCount = res.data.total;
        } else {
          _this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.select_emp {
  .select_search {
    padding-bottom: 20px;
    .el-input {
      width: 200px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      margin-right: 20px;
    }
  }
  .block {
    margin-top: 18px;
    float: right;
    clear: both;
    position: relative;
    right: -10px;
  }
  .select_button {
    float: right;
    clear: both;
    margin-top: 32px;
  }
  .el-table--border td,
  .el-table--border th {
    border-right: 0 !important;
  }
}
</style>