<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-11-20 17:14:46
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="staff">
    <Search :searchData="searchData" :searchItem="searchItem" :pageParams="pageParams" @getDataList="getDataList">
    </Search>
    <!-- 添加员工 -->
    <div class="btn" @click="addStaff">添加员工</div>
    <el-dialog title="添加员工" :close-on-click-modal="false" :visible.sync="isAddStaff" @close="addCancel">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="员工姓名" prop="name">
          <el-input maxlength="8" show-word-limit v-model="ruleForm.name" placeholder="员工姓名长度不得小于2位"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="account">
          <el-input autoComplete="new-password" maxlength="11" show-word-limit v-model="ruleForm.account"
            placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input autoComplete="new-password" maxlength="16" type="password" v-model="ruleForm.password"
            placeholder="请输入8-16位的密码长度"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCancel()">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="addConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑员工 -->
    <el-dialog title="编辑员工" :close-on-click-modal="false" :visible.sync="isHandleEdit" @close="editCancel">
      <el-form :model="editForm" :rules="editRules" ref="editForm" class="demo-ruleForm">
        <el-form-item label="员工姓名" prop="empName">
          <el-input v-model="editForm.empName" :disabled="true" placeholder="员工姓名长度不得小于2位"></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="loginUsername">
          <el-input v-model="editForm.loginUsername" :disabled="true" maxlength="11" placeholder="请输入登录账号"></el-input>
        </el-form-item>
        <el-form-item label="修改密码" prop="loginPassword">
          <el-input autoComplete="new-password" type="password" maxlength="16" v-model="editForm.loginPassword"
            placeholder="请输入新密码，密码长度为8-16位">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editCancel()">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="editConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除员工 -->
    <el-dialog title="提示" :close-on-click-modal="false" :visible.sync="isDeleteStaff">
      <span><i class="el-icon-warning">删除该员工后，对应的账号将不能登录代理商系统，是否继续操作？</i></span>
      <div slot="footer" @click="isDeleteStaff = false">
        <el-button @click="deleteCancel">取 消</el-button>
        <el-button type="primary" :disabled="disabled" @click="deleteConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <Table :tableData="changeData" :isShowBtn="true" :tableItem="tableItem" @handleEdit="handleEdit"
      @handleDelete="handleDelete" @handleDetail="handleDetail" @getDataList="getDataList" :tableBtnItem="tableBtnItem"
      :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import {
  getZixunList,
  getEmployeeList,
  deleteEmployeeList,
  editEmployeeList,
  checkPhone
} from "../../api/employee.js";
import { log } from "util";
export default {
  mixins: [mixinTable],
  data() {
    //员工姓名验证
    let employeeName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入员工姓名"));
      } else if (value.length < 2) {
        callback(new Error("员工姓名长度不得小于2位"));
      } else {
        callback();
      }
    };
    //手机号验证
    let checkPhone1 = (rule, value, callback) => {
      let reg = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
      if (value === "") {
        callback(new Error("请输入登录账号"));
      } else if (!reg.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else if (value != "" && reg.test(value)) {
        let params = {
          phone: value
        };
        checkPhone(params).then(res => {
          if (res.code === 200) {
            if (res.data === 1) {
              callback();
            } else {
              callback(new Error("该账号已开通代理商，请重新输入"));
            }
          }
        });
      } else {
        callback();
      }
    };
    return {
      disabled: false,
      isAddStaff: false, //默认不显示添加员工弹窗
      isHandleEdit: false, //默认不显示编辑员工弹窗
      isDeleteStaff: false, //默认不显示删除员工弹窗
      username: JSON.parse(localStorage.getItem("token")).username, //客户姓名
      currentPage: 1, //当前页面
      pageNum: 1, //当前页
      // pageSize: 5, //每页显示5条员工信息
      ruleForm: {
        name: "", //添加员工姓名
        account: "", //添加登录账号
        password: "" //添加登录密码
      },
      rules: {
        name: [
          { required: true, message: "请输入员工姓名", trigger: "blur" },
          { validator: employeeName, trigger: "blur" }
        ],
        account: [
          { validator: checkPhone1, trigger: "blur" },
          { required: true, max: 11, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      },
      editForm: {
        empName: "", //编辑员工员工姓名
        loginUsername: "", //编辑员工员工账号
        loginPassword: "" //编辑员工员工登录密码
      },
      editRules: {
        empName: [{ required: true }],
        loginUsername: [{ required: true }],
        loginPassword: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.tableItem = [
      { prop: "empName", label: "姓名" },
      { prop: "mobilePhone", label: "手机号" },
      { prop: "transactionAmount", label: "成交金额", type: "money" },
      { prop: "createTime", label: "创建时间" },
      { label: "操作", type: "btn", width: "180", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "编辑", type: "text", fnName: "handleEdit" },
      { name: "删除", type: "text", fnName: "handleDelete", className: "red" },
      { name: "员工详情", type: "text", fnName: "handleDetail" }
    ];
    this.searchItem = [
      {
        type: "input",
        label: "姓名",
        prop: "empName",
        placeholder: "请输入姓名"
      },
      {
        type: "input",
        label: "手机号",
        prop: "mobilePhone",
        placeholder: "请输入手机号"
      }
    ];
    // this.getDataList();
  },
  computed: {
    changeData() {
      this.tableData.forEach(item => {
        if (item.empName == this.username) {
          item.btnShow = [true, false, true];
        } else {
          item.btnShow = [true, true, true];
        }
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 查看员工详情
     * @param {type}
     * @Date: 2019-11-20 11:28:51
     */
    handleDetail(row) {
      this.$router.push({
        path: "/performance",
        // name: "performance",
        query: {
          employeeId: row.id
        }
      });
      this.menuCrumb = [
        {
          path: "/staff",
          meta: {
            title: "员工管理"
          }
        }
      ];
      // localStorage.setItem("menuCrumbItem", JSON.stringify(this.menuCrumb));
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 添加员工
     * @param {type}
     * @return:
     * @Date: 2019-09-16 14:47:52
     */
    addStaff() {
      this.isAddStaff = true;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 取消添加员工
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:51:29
     */
    addCancel() {
      this.isAddStaff = false;
      this.$refs.ruleForm.resetFields();
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 确认添加员工表单
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:51:41
     */
    addConfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let data = {
            empName: this.ruleForm.name,
            loginUsername: this.ruleForm.account,
            loginPassword: rsaJsencrypt(this.ruleForm.password)
          };
          editEmployeeList(data).then(res => {
            if (res.code == 200) {
              this.isAddStaff = false;
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.pageParams.currentPage = 1;
              // this.pageNum = 1;
              this.getDataList();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 取消编辑员工表单
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:51:53
     */
    editCancel() {
      this.isHandleEdit = false;
      this.$refs.editForm.resetFields();
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 确认编辑员工表单
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:52:07
     */
    editConfirm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let data = {
            empName: this.editForm.empName,
            loginUsername: this.editForm.loginUsername,
            loginPassword: rsaJsencrypt(this.editForm.loginPassword),
            userId: this.userId
          };
          this.disabled = true;
          editEmployeeList(data).then(res => {
            if (res.code == 200) {
              this.disabled = false;
              this.isHandleEdit = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
            } else {
              this.disabled = false;
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 取消删除员工
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:52:19
     */
    deleteCancel() {
      this.$message({
        type: "info",
        message: "已取消删除"
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 确认删除员工
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:52:31
     */
    deleteConfirm() {
      let data = {
        employeeId: this.employeeId
      };
      this.disabled = true;
      deleteEmployeeList(data).then(res => {
        if (res.code == 200) {
          this.disabled = false;
          this.$message({
            type: "success",
            message: "删除成功"
          });
        } else {
          this.disabled = false;
          this.$message.error(res.msg);
        }
        this.getDataList();
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 编辑按钮
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:52:50
     */
    handleEdit(row) {
      this.editForm.empName = row.empName;
      this.editForm.loginUsername = row.mobilePhone;
      this.userId = row.userId;
      this.isHandleEdit = true;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 删除按钮
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:53:01
     */
    handleDelete(row) {
      this.isDeleteStaff = true;
      this.employeeId = row.id;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 获取列表信息
     * @param {type}
     * @return:
     * @Date: 2019-09-19 09:53:12
     */
    getDataList() {
      Object.assign(this.pageParams, this.searchData);
      getEmployeeList(this.pageParams).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
          this.pageParams.currentPage = res.data.pageNum;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.staff {
  .btn {
    margin: 20px 0;
    width: 94px;
    height: 40px;
    background: #4da1ff;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    line-height: 40px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }
  .search .search_btn {
    margin-left: 40px;
  }
}
</style>
<style lang="less">
.staff {
  .el-icon-warning:before {
    color: #ff7b8c;
    margin-right: 7px;
  }
  .item-btn:first-child {
    display: inline;
    // margin-right: 10px;
  }
  .item-btn:nth-child(2) {
    display: inline;
    margin-left: 10px;
  }
  .staff .el-button--text {
    text-align: center;
  }
}
</style>
