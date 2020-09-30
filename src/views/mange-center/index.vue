<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-28 08:43:39
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="mange-center-index">
    <div class="info-detail">
      <div class="card_top">
        <div class="card_top_left">
          <div class="card_top_left_title info">资金信息</div>
          <div class="content">
            <div class="content-left">
              <div class="capital-info">
                <span class="symbal">￥</span>
                <span class="account">{{cBalance}}</span>
              </div>
              <div class="desc">账户余额</div>
            </div>
            <div class="content-right">
              <div class="capital-info">
                <span class="symbal">￥</span>
                <span class="account">{{cRechargeAmount}}</span>
              </div>
              <div class="desc">充值金额<el-tooltip class="item" effect="dark" content="上级代理商给本公司成功充值的累计金额" placement="top">
                  <i class="el-icon-question icon"></i></el-tooltip>
              </div>
            </div>
          </div>
          <div class="btn-box">
            <div class="btn color-red" @click="$router.push('/mangeCenter/recharge')">申请充值</div>
            <div class="btn color-purple" @click="$router.push('/mangeCenter/rechargeRecord')">充值记录</div>
            <div class="btn color-green" @click="$router.push('/mangeCenter/particulars')">收支明细</div>
            <div class="btn color-blue" @click="$router.push('/mangeCenter/mangeForm')">提交表单</div>
          </div>
        </div>
        <div class="right">
          <div class="title customer">客户信息</div>
          <div class="content">
            <div class="customer-info">
              <div class="num">{{topData.cActivateCount}}</div>
              <div class="desc">开通系统数</div>
            </div>
            <div class="customer-info">
              <div class="num">{{topData.cRenewActive}}</div>
              <div class="desc">续费系统数</div>
            </div>
            <div class="customer-info">
              <div class="num">{{topData.cSubProxyCount}}</div>
              <div class="desc">下级代理商（家）</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tab">
      <tab :tabItem="tabList" @tabActiveIndex="tabActive" :showTabNum="true" :currentTab="active"></tab>
    </div>
    <div class="marge-tab">
      <ul class="mange-tab-wap">
        <li style="cursor:pointer;" v-for="(item, index) in tabItem" :class="activeIndex === index ? 'active' : ''"
          @click="handleActive(index)" :key="index">{{item.name}}<span v-if="item.num">（{{item.num}}）</span></li>
      </ul>
    </div>
    <div ref="currentView" :is="currentView" @changeStatus="changeStatus"></div>
  </div>
</template>
<script>
import tab from "../../components/tab";
import recharge from "./recharge1";
import newForm from "./newForm";
import reNew from "./renew";
import {
  getInfoDetail,
  apiGetOrderList,
  rechargeRecord,
  apiOperateCount
} from "../../api/mangeCenter.js";
export default {
  components: {
    tab,
    newForm,
    recharge,
    reNew
  },
  data() {
    return {
      active: 0, // 当前tab选中值
      activeIndex: 0, // 当前tab选中值
      proxyId: JSON.parse(localStorage.getItem("token")).proxyId, //代理商id
      infoDataList: [], //资金信息和客户信息
      OperateCount: [], //订单没有处理的数量
      balance: "", //账户余额
      rechargeAmount: "", //充值金额
      activateCount: "", //开通系统数
      renewActive: "", //续费系统数
      subProxyCount: "", // 下级代理商数量
      tabItem: [
        // 当前tab列表值
        { name: "全部" },
        { name: "待审核", num: "" },
        { name: "已通过" },
        { name: "已拒绝" }
      ],
      tabList: [
        // tab列表数据
        { name: "新购单", num: "", child: "newForm" },
        { name: "续费单", num: "", child: "reNew" },
        { name: "充值单", num: "", child: "recharge" }
      ],
      currentView: "newForm" // 当前组件名称
    };
  },
  computed: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 处理账户余额
     * @return: 账户余额
     * @Date: 2019-10-22 19:48:36
     */
    cBalance() {
      let temp = (this.infoDataList.balance / 100).toFixed(2);
      return isNaN(temp) ? "0.00" : temp;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 处理充值金额
     * @return: 充值金额
     * @Date: 2019-10-22 19:52:56
     */
    cRechargeAmount() {
      let temp = (this.infoDataList.rechargeAmount / 100).toFixed(2);
      return isNaN(temp) ? "0.00" : temp;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 处理开通系统数，续费系统数，下级代理商（家）数据
     * @return: 开通系统数，续费系统数，下级代理商（家）
     * @Date: 2019-10-22 20:04:00
     */
    topData() {
      let tempCa = this.infoDataList.activateCount;
      let tempCw = this.infoDataList.renewActive;
      let tempCs = this.infoDataList.subProxyCount;
      return {
        cActivateCount: isNaN(tempCa) ? "0" : tempCa,
        cRenewActive: isNaN(tempCw) ? "0" : tempCw,
        cSubProxyCount: isNaN(tempCs) ? "0" : tempCs
      };
    }
  },
  created() {
    this.getNewFormTotal();
    this.getReNewTotal();
    this.getRechargeTotal();
    this.getInfoData();
    if (this.$route.query.activestatus) {
      this.tabActive(this.$route.query.activestatus);
    } else {
      this.tabActive(0);
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 审核提交表单后页面刷新
     * @param {type}
     * @return:
     * @Date: 2019-10-12 15:03:05
     */
    changeStatus() {
      switch (this.active) {
        case 0: {
          this.getNewFormTotal(true);
          break;
        }
        case 1: {
          this.getReNewTotal(true);
          break;
        }
        case 2: {
          this.getRechargeTotal(true);
          break;
        }
        default:
      }
      this.getInfoData();
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 获取资金信息和客户信息
     * @param {type}
     * @return:
     * @Date: 2019-09-26 16:23:53
     */
    getInfoData() {
      getInfoDetail().then(res => {
        if (res.code == 200) {
          this.infoDataList = res.data;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 新购单条数
     * @Date: 2019-10-08 08:46:05
     */
    getNewFormTotal(isChangeTab) {
      let parmse = { orderType: 0 };
      if (isChangeTab) {
        Object.assign(parmse, { orderState: 0 });
      }
      Object.assign(parmse, this.searchData);
      apiOperateCount(parmse).then(res => {
        if (res.code === 200) {
          if (isChangeTab) {
            this.tabItem[1].num = res.data.newBuyCount;
            this.tabList[0].num = res.data.newBuyCount;
          } else {
            this.tabList[0].num = res.data.newBuyCount;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 续费单条数
     * @Date: 2019-10-08 08:46:05
     */
    getReNewTotal(isChangeTab) {
      let parmse = { orderType: 1 };
      if (isChangeTab) {
        Object.assign(parmse, { orderState: 0 });
      }
      Object.assign(parmse, this.searchData);
      apiOperateCount(parmse).then(res => {
        if (res.code === 200) {
          if (isChangeTab) {
            this.tabItem[1].num = res.data.renewCount;
            this.tabList[1].num = res.data.renewCount;
          } else {
            this.tabList[1].num = res.data.renewCount;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 充值单条数
     * @Date: 2019-10-08 08:46:05
     */
    getRechargeTotal(isChangeTab) {
      let parmse = { recordType: 1 };
      if (isChangeTab) {
        Object.assign(parmse, { orderStatus: 0 });
      }
      Object.assign(parmse, this.searchData);
      apiOperateCount(parmse).then(res => {
        if (res.code === 200) {
          if (isChangeTab) {
            this.tabItem[1].num = res.data.recharge;
            this.tabList[2].num = res.data.recharge;
          } else {
            this.tabList[2].num = res.data.recharge;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 当tab切换时，向父组件发送当前tab的index值
     * @param { Number } index [当前tab的index值]
     * @Date: 2019-09-25 17:24:39
     */
    handleActive(index) {
      this.activeIndex = index;
      this.$refs.currentView.getActiveIndex(index);
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 切换tab更改当前选中index
     * @param {type}
     * @return:
     * @Date: 2019-09-25 18:04:29
     */
    tabActive(index) {
      this.activeIndex = 0;
      this.currentView = this.tabList[index].child;
      if (index === 0) {
        this.getNewFormTotal(true);
      }
      if (index === 1) {
        this.getReNewTotal(true);
      }
      if (index === 2) {
        this.getRechargeTotal(true);
      }
      this.active = index;
    }
  }
};
</script>
<style lang="less" scoped>
.mange-center-index {
  .mange-tab-wap {
    margin: 20px 0;
    border-radius: 4px;
    overflow: hidden;
    li {
      text-align: center;
      color: #666;
      font-size: 14px;
      font-weight: 400;
      min-width: 60px;
      padding: 14px 20px;
      float: left;
      border: 1px solid rgba(229, 229, 229, 1);
      border-right: none;
      span {
        color: #ff7b8c;
      }
    }
    li:last-child {
      border-right: 1px solid rgba(229, 229, 229, 1);
      border-radius: 0 4px 4px 0;
    }
    li:first-child {
      border-radius: 4px 0 0 4px;
    }
    li:hover {
      background: #4da1ff;
      color: #fff;
      span {
        color: #fff;
      }
    }
    .active {
      background: #4da1ff;
      color: #fff;
      span {
        color: #fff;
      }
    }
  }
  .tab {
    width: calc(100% + 40px);
    height: 46px;
    line-height: 46px;
    margin: -10px 0 20px -20px;
    background: #fff;
    .tab-list-wao {
      margin-left: 20px;
      height: 100%;
      border-bottom: 1px solid #e5e5e5;
      width: calc(100% - 40px);
    }
  }
  .info-detail {
    width: calc(100% + 40px);
    background: #f7f8fa;
    padding-bottom: 20px;
    margin-left: -20px;
    margin-top: -20px;
    .card_top {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .info {
        margin: 20px 0 0 20px;
      }
      .customer {
        margin: 20px 0 0 20px;
      }
      .card_top_left {
        background: #fff;
        width: calc(50% - 5px);
        margin-right: 10px;
        height: 200px;
        .card_top_left_title {
          margin-bottom: 45px;
          height: 12px;
          line-height: 12px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
        .btn-box {
          display: flex;
          margin-bottom: 20px;
          .btn {
            width: 72px;
            height: 28px;
            line-height: 28px;
            border-radius: 4px;
            color: #ffffff;
            font-size: 12px;
            text-align: center;
            cursor: pointer;
          }
          .color-red {
            margin-left: 20px;
            background: #ff7b8c;
          }
          .color-red:hover,
          .color-purple:hover,
          .color-green:hover,
          .color-blue:hover {
            opacity: 0.8;
          }
          .color-purple {
            margin-left: 20px;
            background: #9587f1;
          }
          .color-green {
            margin-left: 20px;
            background: #83d587;
          }
          .color-blue {
            margin-left: 20px;
            background: rgba(77, 161, 255, 1);
          }
        }
        .content {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 32px;
          .content-left {
            .capital-info {
              margin-bottom: 12px;
              .account {
                height: 18px;
                text-align: center;
                line-height: 18px;
                font-size: 24px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
              .symbal {
                color: rgba(51, 51, 51, 1);
                font-size: 12px;
              }
            }
            .desc {
              line-height: 11px;
              height: 11px;
              font-size: 12px;
              text-align: center;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
            }
          }
          .content-right {
            .capital-info {
              margin-bottom: 10px;
              .account {
                height: 18px;
                text-align: center;
                line-height: 18px;
                font-size: 24px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
              }
              .symbal {
                color: rgba(51, 51, 51, 1);
                font-size: 12px;
              }
            }
            .desc {
              line-height: 11px;
              height: 11px;
              font-size: 12px;
              text-align: center;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
            }
            .icon {
              margin-left: 5px;
              font-size: 14px;
              height: 14px;
              width: 14px;
            }
            .icon:hover {
              color: #4da1ff;
            }
          }
        }
      }
      .right {
        background: #fff;
        width: calc(50% - 5px);
        height: 200px;
        .title {
          margin-bottom: 45px;
          height: 12px;
          line-height: 12px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }
        .content {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .num {
            height: 18px;
            text-align: center;
            line-height: 18px;
            font-size: 24px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }
          .desc {
            margin-top: 14px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.mange-center-index {
  .search {
    .search_btn {
      margin-left: 82px;
    }
  }
}
</style>