<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-30 10:55:06
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="commodity">
    <el-button v-if="isShow" type="primary" class="btm-btn" @click="$router.push('/commodity/addOrEdit')">添加商品
    </el-button>
    <Table :tableData="changeData" :tableItem="tableItem" @handleEdit="handleEdit" @getDataList="getDataList"
      @handleDeleteBatch="handleDeleteBatch" @handleSubmitForm="handleSubmitForm" @handleDelete="handleDelete"
      @getSelecData="getSelecData" :tableBtnItem="tableBtnItem" :pageParams="pageParams">
    </Table>
  </div>
</template>
<script>
import mixinTable from "../../components/mixinTable";
import {
  findProductList,
  editProduct,
  apiBacthDelete
} from "../../api/product.js";
import { type } from "os";
export default {
  mixins: [mixinTable],
  data() {
    return {
      currentPage: 1, //当前页面
      pageNum: 1, //当前页
      isShow: false //是否显示添加商品按钮
    };
  },
  created() {
    this.tableItem = [
      { prop: "productName", label: "商品名称" },
      { prop: "productPicUrl", label: "商品图片", type: "img" },
      { prop: "cardNum", label: "开通名片数" },
      { prop: "buyPrice", label: "购买价格", type: "money" },
      { prop: "renewalPrice", label: "续费价格", type: "money" },
      { prop: "createTime", label: "添加时间" },
      { prop: "productStatus1", label: "是否上架", type:"ground" },
      { label: "操作", type: "btn", width: "100", fixed: "right" }
    ];
    if (JSON.parse(localStorage.getItem("token")).roleType === 1) {
      this.tableBtnItem = [
        { name: "修改", type: "text", fnName: "handleEdit", className: "blue" }
        // { name: "删除", type: "text", fnName: "handleDelete", className: "red" }
      ];
      this.isShow = true;
    } else {
      // this.tableItem.splice(4, 1);
      this.tableItem.splice(6, 1);
      this.tableItem.splice(5, 1);
      this.isShowDelete = false;
      this.tableBtnItem = [
        { name: "提交表单", type: "text", fnName: "handleSubmitForm" }
      ];
    }
    this.searchItem = [
      {
        type: "input",
        label: "关键词",
        prop: "age",
        placeholder: "用户名/手机号/企业名称"
      }
    ];
  },
  computed: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 列表数据处理
     * @param {type} 
     * @return: 
     * @Date: 2019-10-30 10:13:48
     */
    changeData() {
      this.tableData.forEach(item => {
        if (item.productStatus == 1) {
          item.productStatus1 = "是";
        } else if (item.productStatus == 2) {
          item.productStatus1 = "否";
        }
      });
      return this.tableData;
    }
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 勾选变化
     * @param { Array } val [勾选内容]
     * @Date: 2019-09-24 16:21:39
     */
    getSelecData(val) {
      this.checkArr = val;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 获取商品列表数据
     * @param {type}
     * @return:
     * @Date: 2019-09-27 11:48:04
     */
    getDataList() {
      this.pageParams.pageSize = 10;
      let data = {
        pageNum: this.pageParams.currentPage,
        pageSize: this.pageParams.pageSize
      };
      Object.assign(data, this.pageParams);
      findProductList(data).then(res => {
        if (res.code == 200) {
          this.tableData = res.data.list;
          this.pageParams.total = res.data.total;
          this.pageParams.currentPage = res.data.pageNum;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 提交表单按钮
     * @Date: 2019-09-24 16:50:01
     */
    handleSubmitForm(val) {
      this.$router.push({
        path: "/mangeCenter/mangeForm",
        query: {
          productName: val.productName,
          productId: val.id
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 编辑按钮
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:51:01
     */
    handleEdit(row) {
      this.$router.push({ name: "addOrEdit1", params: { id: row.id } });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 批量删除
     * @Date: 2019-09-24 16:50:01
     */
    handleDeleteBatch() {
      let id = "";
      this.checkArr.forEach(item => {
        id += item.id + ",";
      });
      this.apiDetele({ productIds: id.substr(0, id.length - 1) });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 删除按钮
     * @param { Object } row [当前单元格内容]
     * @Date: 2019-09-24 16:52:01
     */
    handleDelete(row) {
      this.apiDetele({ id: row.id }, true);
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 删除请求接口
     * @param { Object } obj [列表id]
     * @param { Boolean } type [删除类型]
     * @Date: 2019-09-24 16:52:01
     */
    apiDetele(obj, type) {
      let data = {
        productStatus: 2
      };
      Object.assign(data, obj);
      this.$confirm("确定删除商品列表？", "删除商品", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type) {
            editProduct(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
              } else {
                this.$message.error(res.msg);
              }
              this.getDataList();
            });
          } else {
            apiBacthDelete(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
              } else {
                this.$message.error(res.msg);
              }
              this.getDataList();
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="less">
.el-icon-warning:before {
  color: #ff7b8c;
}
</style>