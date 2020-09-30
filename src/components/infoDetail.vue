<!--
 * @Description: 
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-09-23 15:04:17
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-25 16:20:31
 -->
<template>
  <div class="info-detail">
    <div class="agent-name" v-if="isShowNav">
      <span class="agentName">{{infoDataList.proxyUsername}}</span>
      <span class="up-agent" v-if="isShow">上级代理商 :<span :class="infoDataList.proxyLevel === 1 ? 'grey' : 'blue' "
          @click="goAgentDetail">
          {{infoDataList.upUsername}}</span></span>
      <span class="up-agent" v-if="isShow">层级 :<span class="grey"> {{infoDataList.proxyLevel}}级</span></span>
    </div>

    <div class="capital-info">
      <div class="left">
        <div class="title info" v-if="isShowCapital">资金信息</div>
        <div class="title info" v-if="isShowAchievements">我的业绩</div>
        <div class="content" v-if="isShowBalance">
          <div class="content-left">
            <div class="capital">
              <span class="symbal">￥</span>
              <span class="account">{{topData.cBalance}}</span>
            </div>
            <div class="desc">账户余额</div>
          </div>
          <div class="content-right">
            <div class="capital">
              <span class="symbal">￥</span>
              <span class="account">{{topData.cRechargeAmount}}</span>
            </div>
            <div class="desc">充值金额</div>
          </div>
        </div>
        <div class="content" v-if="isShowAmount">
          <div class="content-left">
            <div class="account"><span>￥</span>{{topData.cTranscationAmount}}</div>
            <div class="desc">成交金额</div>
          </div>
          <div class="content-right">
            <div class="account">{{infoDataList.activateCount + infoDataList.renewActive}}</div>
            <div class="desc">成交单数</div>
          </div>
        </div>
        <div class="btn-box">
          <div class="btn color-red" @click="clickRecharge" v-if="isShowRecharge">充值</div>
          <div class="btn color-blue" @click="clickAgentData" v-if="isShowBtn">代理商数据</div>
        </div>
      </div>
      <div class="right">
        <div class="title customer">客户信息</div>
        <div class="content">
          <div>
            <div class="num">{{topData.cActivateCount}}</div>
            <div class="desc">开通系统数</div>
          </div>
          <div>
            <div class="num">{{topData.cRenewActive}}</div>
            <div class="desc">续费系统数</div>
          </div>
          <div v-if="isShowSupProxy">
            <div class="num">{{topData.cSubProxyCount}}</div>
            <div class="desc">下级代理商（家）</div>
          </div>
          <div v-if="isShowProxy">
            <div class="num">{{topData.cSubProxyCount}}</div>
            <div class="desc">发展代理商</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getInfoDetail } from "../api/mangeCenter.js";
export default {
  props: {
    isShowNav: {
      // 是否显示头部代理商名称
      type: Boolean,
      default: true
    },
    isShowBtn: {
      // 是否显示操作按钮
      type: Boolean,
      default: true
    },
    isShowAmount: {
      //是否显示成交金额、成交单数
      type: Boolean,
      default: false
    },
    isShowBalance: {
      //是否显示账户余额、充值金额
      type: Boolean,
      default: false
    },
    isShowSupProxy: {
      //是否显示下级代理商
      type: Boolean,
      default: false
    },
    isShowProxy: {
      //是否显示发展代理商
      type: Boolean,
      default: false
    },
    isShowCapital: {
      //是否显示资金信息字段
      type: Boolean,
      default: false
    },
    isShowAchievements: {
      //是否显示我的业绩字段
      type: Boolean,
      default: false
    },
    isShowRecharge: {
      //是否显示充值按钮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      proxyId: "", //代理商id
      infoDataList: {}, //资金信息和客户信息
      balance: "", //账户余额
      rechargeAmount: "", //充值金额
      activateCount: "", //开通系统数
      renewActive: "", //续费系统数
      subProxyCount: "", // 下级代理商数量
      isShow: "" // 是否是管理员，展示
    };
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 上级代理商
     * @param {type}
     * @return:
     * @Date: 2019-10-12 17:14:19
     */
    goAgentDetail() {
      if (this.infoDataList.proxyLevel !== 1) {
        this.$emit("clickChange", this.infoDataList.upProxyId);
      }
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 充值
     * @param {type}
     * @return:
     * @Date: 2019-09-24 08:22:42
     */
    clickRecharge() {
      this.$emit("clickRecharge");
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 代理商数据
     * @param {type}
     * @return:
     * @Date: 2019-09-24 08:23:46
     */
    clickAgentData() {
      this.$emit("clickAgentData", this.infoDataList.proxyUsername);
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 获取资金信息和客户信息
     * @param {type}
     * @return:
     * @Date: 2019-09-26 16:23:53
     */
    getInfoData() {
      let data = {
        proxyId: sessionStorage.getItem("proxyId")
      };
      getInfoDetail(data).then(res => {
        if (res.code == 200) {
          this.infoDataList = res.data;
        }
      });
    }
  },
  computed: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 处理账户余额，充值金额，成交金额，开通系统数，续费系统数，下级代理商（家）数据
     * @return: 账户余额，充值金额，成交金额，开通系统数，续费系统数，下级代理商（家）
     * @Date: 2019-10-22 20:04:00
     */
    topData() {
      let tempCb = (this.infoDataList.balance / 100).toFixed(2);
      let tempCr = (this.infoDataList.rechargeAmount / 100).toFixed(2);
      let tempCt = (this.infoDataList.transcationAmount / 100).toFixed(2);
      let tempCa = this.infoDataList.activateCount;
      let tempCw = this.infoDataList.renewActive;
      let tempCs = this.infoDataList.subProxyCount;
      return {
        cBalance: isNaN(tempCb) ? "0.00" : tempCb,
        cRechargeAmount: isNaN(tempCr) ? "0.00" : tempCr,
        cTranscationAmount: isNaN(tempCt) ? "0.00" : tempCt,
        cActivateCount: isNaN(tempCa) ? "0" : tempCa,
        cRenewActive: isNaN(tempCw) ? "0" : tempCw,
        cSubProxyCount: isNaN(tempCs) ? "0" : tempCs
      };
    }
  },
  watch: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 监听路由跳转
     * @param {type}
     * @return:
     * @Date: 2019-10-22 20:19:07
     */
    $route(to, from) {
      this.getInfoData();
      if (JSON.parse(localStorage.getItem("token")).roleType == 1) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    }
  },
  created() {
    this.getInfoData();
    if (JSON.parse(localStorage.getItem("token")).roleType == 1) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
};
</script>
<style lang="less" scoped>
.info-detail {
  .agent-name {
    background: #ffffff;
    padding-left: 20px;
    margin-bottom: 10px;
    height: 60px;
    line-height: 60px;
    border-radius: 6px 6px 0 0;
    .agentName {
      height: 60px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #666666;
    }
    .up-agent {
      display: inline-block;
      margin-left: 100px;
      height: 12px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
    .grey {
      color: #666666;
    }
    .blue {
      color: #4da1ff;
      cursor: pointer;
    }
  }
  .capital-info {
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
    .left {
      background: #fff;
      width: calc(50% - 5px);
      margin-right: 10px;
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
          background: rgba(255, 123, 140, 1);
        }
        .color-blue {
          margin-left: 20px;
          background: rgba(77, 161, 255, 1);
        }
        .color-red:hover,
        .color-blue:hover {
          opacity: 0.8;
        }
      }
      .content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 32px;
        .content-left {
          .capital {
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
            margin-top: 14px;
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
          .capital {
            margin-bottom: 14px;
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
            height: 11px;
            line-height: 11px;
            font-size: 12px;
            text-align: center;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
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
</style>