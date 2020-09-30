<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-11-20 15:23:35
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 -->
<template>
  <div class="shop">
    <Search :searchData="searchData" :searchItem="searchItem" :pageParams="pageParams" @getDataList="getDataList">
    </Search>
    <el-button class="openAccount" type="primary" v-if="isShowBtn" @click="$router.push('/shop/addShopAndOpenAccunt')">
      开通账号</el-button>
    <Table :tableData="tableData" :tableItem="tableItem" @handleEdit="handleEdit" @handleMark="handleMark"
      @handleRenewal="handleRenewal" @getSelecData="getSelecData" @getDataList="getDataList" @exportExcel="exportExcel"
      :exportUrl="exportUrl" :tableBtnItem="tableBtnItem" :pageParams="pageParams">
    </Table>
    <el-dialog title="备注记录" :visible.sync="noteInfor" width="800px" :close-on-click-modal="false">
      <div class="table1 table2">
        <el-table :data="note" style="width: 100%">
          <el-table-column label="备注信息">
            <template slot-scope="scope">
              <el-tooltip popper-class='atooltip' v-if="scope.row.remarkContent != ''" class="item" effect="dark"
                :content="scope.row.remarkContent" placement="top">
                <span>{{scope.row.remarkContent}}</span>
              </el-tooltip>
              <div v-if="scope.row.remarkContent == ''" class="yanzheng2">
                <el-input v-model="infor" placeholder="请输入备注信息" maxlength="200" show-word-limit></el-input>
                <p v-if="yanzheng">请输入备注信息</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="employeeName" label="备注人">
          </el-table-column>
          <el-table-column prop="createTime" label="备注时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span v-if="scope.row.remarkContent != ''" class="delete"
                @click="handleDelete(scope.$index, scope.row)">删除</span>
              <span v-if="scope.row.remarkContent == ''" class="saveNote"
                @click="saveNote(scope.$index, scope.row)">保存</span>
              <span v-if="scope.row.remarkContent == ''" class="cancel"
                @click="cancel(scope.$index, scope.row)">取消</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div :class="add ? 'cde' : 'bcd'">
        <el-button type="primary" v-if="add" @click="addNote" class="addNote">添加</el-button>
        <div :class="yanzheng && add == false ? 'block1' : 'block'" v-show="note.length != 0">
          <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage1"
            :page-size.sync="pageSize" layout="total, prev, pager, next" :total="total1">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import uploadImg from "../../components/uploadImg";
import mixinTable from "../../components/mixinTable";
import {
  getZixunList,
  getShopList,
  getShopRemark,
  postShopRemark,
  deleteShopRemark
} from "../../api/agent.js";
export default {
  mixins: [mixinTable],
  components: {
    uploadImg
  },
  data() {
    return {
      flag: false, //备注防重提交
      dialogVisible: false, //续费弹窗
      employeeName: "", //备注人
      shopId: 0, //店铺id
      total1: 0, //备注总条数
      pageNum1: 1, //第几页
      add: true, //添加显示
      currentPage1: 1, //当前页面
      pageSize: 5, //每页显示信息数
      show: false, //添加备注信息
      infor: "", //输入备注信息
      noteInfor: false, //备注信息弹窗显示
      yanzheng: false, //输入框验证
      note: [], //备注信息列表
      exportPartUrl: "/list/export/exportShopExcel", // 部分导出链接
      isShowBtn: JSON.parse(localStorage.getItem("token")).roleType !== 1 // 判断是否隐藏开通按钮
    };
  },
  created() {
    this.tableItem = [
      { type: "selection", width: "55" },
      { prop: "companyName", label: "企业名称" },
      { prop: "customerPhone", label: "手机号" },
      { prop: "productName", label: "购买商品版本" },
      { prop: "access", label: "已使用/开通名片数" },
      { prop: "renewNum", label: "续费次数" },
      { prop: "relevanceEmployeeName", label: "关联员工" },
      { prop: "validityTime", label: "有效期", type: "Mtext" },
      { prop: "createTime", label: "创建时间" },
      { label: "操作", type: "btn", width: "100", fixed: "right" }
    ];
    this.tableBtnItem = [
      { name: "修改", type: "text", fnName: "handleEdit" },
      { name: "备注", type: "text", fnName: "handleMark" }
    ];
    this.searchItem = [
      {
        type: "input",
        label: "企业名称",
        prop: "companyName",
        placeholder: "请输入企业名称"
      },
      {
        type: "input",
        label: "手机号",
        prop: "customerPhone",
        placeholder: "请输入手机号"
      }
    ];
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 区分角色 对列表页面 部分数据进行改动
     * @param {type} 
     * @return: 
     * @Date: 2019-11-20 15:20:51
     */
    if (JSON.parse(localStorage.getItem("token")).roleType == 1) {
      this.searchItem.push({
        type: "input",
        label: "绑定代理商",
        prop: "companyName",
        placeholder: "请输入绑定代理商"
      });
      this.tableItem.splice(3, 0, { prop: "companyName", label: "绑定代理商" });
    } else {
      this.tableBtnItem.splice(1, 0, {
        name: "续费",
        type: "text",
        fnName: "handleRenewal"
      });
    }
    this.exportUrl = "/list/export/exportShopExcel";
  },
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 删除备注记录
     * @param {type}
     * @return:
     * @Date: 2019-09-19 19:46:01
     */
    handleDelete(index, row) {
      let that = this;
      this.$confirm("确定删除此条备注吗？", "删除备注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            shopRemarkId: row.id
          };
          deleteShopRemark(data).then(res => {
            if (res.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.add = true;
              that.getShopRemarkList();
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 分页跳转
     * @param {type}
     * @return:
     * @Date: 2019-09-19 19:46:24
     */
    handleCurrentChange(val) {
      this.currentPage1 = val;
      this.getShopRemarkList();
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 取消添加
     * @param {type}
     * @return:
     * @Date: 2019-09-19 19:46:49
     */
    cancel(index, row) {
      this.note.splice(index, 1);
      this.show = false;
      this.add = true;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 保存
     * @param {type}
     * @return:
     * @Date: 2019-09-19 19:47:08
     */
    saveNote(index, row) {
      if (this.infor == "") {
        this.yanzheng = true;
      } else {
        if (this.flag == true) {
          return false;
        }
        this.flag = true;
        var data = {
          shopId: this.shopId,
          remarkContent: this.infor
        };
        postShopRemark(data).then(res => {
          if (res.code == 200) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.note.splice(index, 1);
            this.flag = false;
            this.show = false;
            this.add = true;
            this.currentPage1 = 1;
            setTimeout(this.getShopRemarkList(), 1000);
          } else {
            this.flag = false;
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
      }
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 添加按钮
     * @param {type}
     * @return:
     * @Date: 2019-09-19 19:47:54
     */
    addNote() {
      this.yanzheng = false;
      this.show = true;
      this.add = false;
      this.infor = "";
      this.note.push({
        remarkContent: "",
        employeeName: this.employeeName,
        createTime: "-"
      });
    },
    // 勾选按钮
    getSelecData(val) {
      this.checkArr = { shopList: val, filename: "店铺列表" };
    },
    // 编辑按钮
    handleEdit(row) {
      this.$router.push({ name: "shopedit", params: { shopId: row.id } });
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 续费按钮 触发事件
     * @param {type} 
     * @return: 
     * @Date: 2019-11-20 15:23:18
     */
    handleRenewal(row) {
      this.dialogVisible = true;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 备注
     * @param {type}
     * @return:
     * @Date: 2019-09-25 11:02:14
     */
    handleMark(row) {
      this.noteInfor = true;
      this.add = true;
      this.shopId = row.id;
      this.employeeName = JSON.parse(localStorage.getItem("token")).username;
      this.getShopRemarkList();
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 获取备注列表信息
     * @param {type}
     * @return:
     * @Date: 2019-09-25 11:02:38
     */
    getShopRemarkList() {
      var data = {
        shopId: this.shopId,
        pageNum: this.currentPage1,
        pageSize: this.pageSize
      };
      getShopRemark(data).then(res => {
        if (res.code == 200) {
          this.note = res.data.list;
          this.total1 = res.data.total;
        }
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 获取列表信息
     * @param {type}
     * @return:
     * @Date: 2019-09-25 11:02:52
     */
    getDataList() {
      let data = {
        filename: "店铺列表"
      };
      Object.assign(this.searchData, this.pageParams, data);
      this.$store.dispatch("searchData/changeSearch", this.searchData);
      getShopList(this.searchData).then(res => {
        if (res.code == 200) {
          let list = res.data.list;
          list.forEach(e => {
            e.access = e.cardUseNum + "/" + e.cardNum;
            e.validityTime = [e.beginTime, "至", e.endTime];
          });
          this.tableData = list;
          this.pageParams.total = res.data.total;
        }
      });
    }
  }
};
</script>

<style lang="less">
.shop {
  .openAccount {
    margin-bottom: 20px;
  }
  .el-dialog {
    width: 800px !important;
    border-radius: 6px;
    min-height: 400px;
    .el-dialog__header {
      .el-dialog__title {
        color: #333;
        font-size: 18px;
      }
    }
    .el-dialog__body {
      padding: 30px 0 0 0 !important;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 296px;
      .table2 {
        .el-table {
          .el-table__header-wrapper {
            .el-table__header {
              .has-gutter {
                tr {
                  th {
                    text-align: center;
                  }
                }
              }
            }
          }
          .el-table__body-wrapper {
            .el-table__body {
              tbody {
                tr {
                  td {
                    text-align: center;
                    .cell {
                      .yanzheng2 {
                        text-align: left;
                        .el-input {
                          width: 180px;
                          input {
                            padding-right: 60px;
                            padding-left: 10px;
                          }
                          .el-input__suffix {
                            right: 1px !important;
                          }
                          input::-webkit-input-placeholder {
                            color: #ccc;
                            font-size: 14px;
                          }
                        }
                        p {
                          color: #ff7b8c;
                          font-size: 12px;
                          text-align: left;
                        }
                      }
                      .delete {
                        color: #ff7b8c;
                        font-size: 14px;
                        cursor: pointer;
                      }
                      .saveNote {
                        color: #4da1ff;
                        margin-right: 16px;
                        cursor: pointer;
                      }
                      .cancel {
                        cursor: pointer;
                      }
                      .item {
                        overflow: hidden;
                        display: block;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        cursor: pointer;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // table {
      //   width: 100%;
      //   line-height: 50px;
      //   border-collapse: collapse;
      //   color: #666;
      //   font-size: 14px;
      //   border-radius: 4px;
      //   thead {
      //     background: #e5e5e5;
      //     height: 50px;
      //     border: 1px solid #e5e5e5;
      //     tr {
      //       th {
      //         min-width: 124px;
      //       }
      //     }
      //   }
      //   tbody {
      //     tr {
      //       line-height: 60px;
      //       min-height: 60px;
      //       border: 1px solid #e5e5e5;
      //       .abc {
      //         p {
      //           font-size: 12px;
      //           color: #ff7b8c;
      //           line-height: 12px;
      //           margin-bottom: 9px;
      //           text-align: left;
      //           margin-left: 19px;
      //           margin-top: -5px;
      //         }
      //         .el-input {
      //           .el-input__suffix {
      //             .el-input__suffix-inner {
      //               .el-input__count {
      //                 line-height: 12px;
      //                 margin-right: 16px;
      //               }
      //             }
      //           }
      //         }
      //       }
      //       td {
      //         min-height: 60px;
      //         text-align: center;
      //         color: #666;
      //         min-width: 124px;
      //         .delete {
      //           color: #ff7b8c;
      //         }
      //         input {
      //           width: 280px;
      //           height: 40px;
      //           font-size: 14px;
      //           color: #666;
      //           border: 1px solid #e5e5e5;
      //           padding: 0 60px 0 10px;
      //         }
      //         input::-webkit-input-placeholder {
      //           color: #ccc;
      //           font-size: 14px;
      //         }
      //       }
      //       .saveNote {
      //         color: #4da1ff;
      //         margin-right: 16px;
      //       }
      //       .noteInfor {
      //         span {
      //           overflow: hidden;
      //           display: block;
      //           text-overflow: ellipsis;
      //           white-space: nowrap;
      //           cursor: pointer;
      //           max-width: 248px;
      //           margin: auto;
      //         }
      //       }
      //       .noData {
      //         color: #999;
      //       }
      //     }
      //   }
      // }
      .bcd {
        margin-left: auto;
        .block {
          margin-top: 32px;
          .el-pagination {
            margin-top: 10px;
            padding: 2px 0 0 5px;
            .el-pagination__total {
              margin-right: 15px;
              color: #333;
              font-size: 14px;
              .el-pager {
                li {
                  color: #333;
                }
                li.active {
                  background-color: #4da1ff;
                }
              }
            }
            .btn-next {
              margin-right: 0px;
            }
          }
        }
        .block1 {
          margin-top: 16px;
          .el-pagination {
            margin-top: 10px;
            padding: 2px 0 0 5px;
            .el-pagination__total {
              margin-right: 15px;
              color: #333;
              font-size: 14px;
              .el-pager {
                li {
                  color: #333;
                }
                li.active {
                  background-color: #4da1ff;
                }
              }
            }
            .btn-next {
              margin-right: 0px;
            }
          }
        }
      }
      .cde {
        margin-top: 29px;
        display: flex;
        justify-content: space-between;
        .block {
          .el-pagination {
            margin-top: 10px;
            padding: 2px 0 0 5px;
            .el-pagination__total {
              margin-right: 15px;
              color: #333;
              font-size: 14px;
              .el-pager {
                li {
                  color: #333;
                }
                li.active {
                  background-color: #4da1ff;
                }
              }
            }
            .btn-next {
              margin-right: 0px;
            }
          }
        }
        .addNote {
          width: 74px;
          height: 40px;
          border: none;
        }
      }
    }
  }
}
.el-message-box {
  width: 560px;
  height: 220px;
  position: relative;
  .el-message-box__header {
    padding: 0;
    color: #333;
    margin: 0 20px;
    border-bottom: 1px solid #e6e6e6;
    .el-message-box__title {
      font-size: 16px;
      line-height: 54px;
    }
    .el-message-box__headerbtn {
      right: 0px;
    }
  }
  .el-message-box__content {
    margin-top: 30px;
    .el-message-box__status {
      color: #ff7b8c;
      font-size: 14px !important;
    }
    .el-message-box__message {
      padding-left: 21px;
      p {
        font-size: 14px;
        color: #333;
      }
    }
  }
  .el-message-box__btns {
    position: absolute;
    right: 5px;
    bottom: 20px;
    .el-button {
      width: 74px;
      height: 40px;
      margin-left: 14px;
    }
  }
}
.atooltip {
  width: 180px;
  background: #000 !important;
  color: #fff;
  font-size: 12px;
  line-height: 22px;
}
.atooltip[x-placement^="top"] .popper__arrow:after {
  border-top-color: #000 !important;
}
</style>
<style lang="less">
.shop {
  .search .search_btn {
    margin-left: 68px;
  }
}
</style>