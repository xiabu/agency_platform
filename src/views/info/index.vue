<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:54:26
 * @LastEditTime: 2019-10-28 19:38:07
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="info">
    <div>
      <Search :searchData="searchData" :pageParams="pageParams" :searchItem="searchItem" @getDataList="getDataList">
      </Search>
    </div>
    <div class="msContent" v-if="msgData.length > 0">
      <div class="msgItem" v-for="(item,index) in msgData" :key="index" @click="clickIsRead(index,item.id)">
        <div class="left">
          <div class="icon" v-show="item.isRead === 0"></div>
          <div class="desc">
            <div class="message-tip" :class="item.isRead === 0 ? 'color-black' : 'color-isRead'">{{item.notifyTypeName}}
            </div>
            <span class="tip" :class="item.isRead === 0 ? 'color-light-black' : 'color-isRead'">{{item.content}}</span>
            <span class="detail" @click="viewDetail(item.notifyType, index, item.id )"
              :class="item.isRead === 0 ? 'color-blue' : 'color-review'">查看详情>></span>
          </div>
        </div>
        <div class="right">{{item.createTime}}</div>
      </div>
    </div>
    <p class="msContent-no" v-else>暂无数据</p>
    <div class="btn" @click="allRead" v-if="msgData.length > 0">全部已读</div>
    <el-pagination background class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
    </el-pagination>

  </div>
</template>
<script>
import search from "../../components/search";
import mixinTable from "../../components/mixinTable";
import {
  apiGetNotify,
  apiAllIsRead,
  apiDateIsRead
} from "../../api/message.js";
export default {
  mixins: [mixinTable],
  components: {
    search
  },
  data() {
    return {
      currentPage: 1, //显示的当前页
      pageSize: 10, //每页显示10条数据
      msgData: [], //消息数据
      total: 0, //总的页数
      activestatus: "", //路由跳转消息通知类型参数
      proxyId: sessionStorage.getItem("proxyId") //代理id
    };
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 获取列表数据
     * @param { Array } sortArr [排序信息]
     * @Date: 2019-09-27 17:06:29
     */
    getDataList() {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      Object.assign(data, this.searchData);
      apiGetNotify(data).then(res => {
        if (res.code === 200) {
          this.msgData = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 页面条数
     * @Date: 2019-09-27 17:06:29
     */
    handleSizeChange(total) {
      this.pageSize = total;
      this.getDataList();
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当前页发生变化
     * @Date: 2019-09-27 17:06:29
     */
    handleCurrentChange(total) {
      this.pageNum = total;
      this.getDataList();
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 查看详情
     * @param { String } notifyType [查看类型]
     * @param { Number } index [当前点击index]
     * @param { String } id [消息id]
     * @Date: 2019-09-27 17:06:29
     */
    viewDetail(notifyType, index, id) {
      let parentUrl = ""; // 选中父菜单
      let childUrl = ""; // 选中子菜单
      let meunArr = []; // 面包屑导航
      if (JSON.parse(localStorage.getItem("token")).roleType == 2) {
        if (notifyType === "1" || notifyType === "2" || notifyType === "3") {
          this.$router.push({
            path: "/mangeCenter",
            query: {
              activestatus: notifyType - 1
            }
          });
          parentUrl = "/mangeCenter";
          childUrl = "/mangeCenter";
          meunArr = [{ path: "/mangeCenter", meta: { title: "管理中心" } }];
        } else if (notifyType === "4") {
          this.$router.push({
            path: "/mangeCenter/particulars"
          });
          parentUrl = "/mangeCenter";
          childUrl = "/mangeCenter/particulars";
          meunArr = [{ path: "/mangeCenter", meta: { title: "管理中心" } }];
        }
      } else if (JSON.parse(localStorage.getItem("token")).roleType == 1) {
        if (notifyType === "1") {
          this.$router.push({
            path: "/mangeForm"
          });
          parentUrl = "/mangeForm";
          childUrl = "/mangeForm";
          meunArr = [
            { path: "/mangeForm", meta: { title: "表单管理" } },
            { path: "/mangeForm", meta: { title: "新购单管理" } }
          ];
        } else if (notifyType === "2") {
          this.$router.push({
            path: "/renew"
          });
          parentUrl = "/mangeForm";
          childUrl = "/renew";
          meunArr = [
            { path: "/mangeForm", meta: { title: "表单管理" } },
            { path: "/renew", meta: { title: "续费单管理" } }
          ];
        } else if (notifyType === "3") {
          if (JSON.parse(localStorage.getItem("token")).roleType === 1) {
            this.$router.push({
              path: "/topUpAudit"
            });
            parentUrl = "/topUpAudit";
            childUrl = "/topUpAudit";
            meunArr = [
              { path: "/topUpAudit", meta: { title: "充值审核" } }
            ];
          } else {
            this.$router.push({
              path: "/rechargeForm"
            });
            parentUrl = "/mangeForm";
            childUrl = "/rechargeForm";
            meunArr = [
              { path: "/mangeForm", meta: { title: "表单管理" } },
              { path: "/rechargeForm", meta: { title: "充值单管理" } }
            ];
          }
        } else if (notifyType === "4") {
          this.$router.push({
            path: "/agent/detail/",
            name: "agentDetail",
            params: {
              proxyId: this.proxyId,
              activestatus: notifyType - 3
            }
          });
          parentUrl = "/agent";
          childUrl = "/agent";
          meunArr = [
            { path: "/agent", meta: { title: "代理商管理" } },
            { path: "/agent", meta: { title: "代理商管理" } }
          ];
        }
      }
      localStorage.setItem("menuActiveIndex", childUrl); // 保存选中子菜单路由
      localStorage.setItem("menuActiveParent", parentUrl); // 保存选中父菜单路由
      localStorage.setItem("menuCrumbItem", JSON.stringify(meunArr)); // 保存当前面包屑菜单
      let data = {
        notifyId: id
      };
      apiDateIsRead(data).then(res => {
        if (res.code === 200) {
          this.msgData[index].isRead = 1;
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description:  全部已读
     * @Date: 2019-10-16 14:03:26
     */
    allRead() {
      apiAllIsRead().then(res => {
        if (res.code === 200) {
          this.getDataList();
          sessionStorage.setItem("info", 2)
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 点击显示为已读
     * @Date: 2019-10-16 15:46:14
     */
    clickIsRead(index, id) {
      let data = {
        notifyId: id
      };
      apiDateIsRead(data).then(res => {
        if (res.code === 200) {
          this.msgData[index].isRead = 1;
          sessionStorage.setItem("info", 1)
        }
      });
    }
  },
  created() {
    this.searchItem = [
      {
        type: "select",
        label: "是否已读",
        prop: "isRead",
        selectList: [{ label: "是", value: "1" }, { label: "否", value: "0" }]
      },
      { type: "daterange", label: "通知时间", prop: ["startTime", "endTime"] }
    ];
  }
};
</script>
<style lang="less" scoped>
.info {
  .msContent {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(229, 229, 229, 1);
    border-radius: 4px 4px 0px 0px;
    .msgItem {
      height: 80px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(229, 229, 229, 1);
      .left {
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 8px;
          height: 8px;
          background: rgba(255, 123, 140, 1);
          border-radius: 50%;
          display: inline-block;
          margin-right: 20px;
        }
        .desc {
          display: inline-block;
          .message-tip {
            margin-bottom: 11px;
            height: 16px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
          }
        }
        .tip {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          margin-right: 10px;
        }
        .detail {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
        }
      }
      .right {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666;
      }
    }
    .msgItem:last-child {
      border-bottom: none;
    }
  }
  .msContent-no {
    text-align: center;
    padding: 32px 0;
    border: 1px solid rgba(229, 229, 229, 1);
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
  .btn {
    width: 80px;
    height: 40px;
    display: inline-block;
    background: rgba(77, 161, 255, 1);
    border-radius: 4px;
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 40px;
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
  .pagination {
    float: right;
    margin-top: 20px;
  }
  .detail {
    cursor: pointer;
  }
  .color-black {
    color: #333;
  }
  .color-light-black {
    color: #666;
  }
  .color-blue {
    color: #4da1ff;
  }
  .color-isRead {
    color: #999;
    margin-left: 28px;
  }
  .color-review {
    color: #999;
  }
}
</style>
<style lang="less">
.info {
  .search .search_btn {
    margin-left: 68px;
  }
}
</style>