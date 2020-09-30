<!--
 * @Description: 
 * @Author: 李丽琼（1581868603@qq.com）
 * @Date: 2019-09-23 15:04:17
 * @LastEditors: 李丽琼（1581868603@qq.com）
 * @LastEditTime: 2019-10-25 16:36:23
 -->
<template>
  <div class="info-detail">
    <div class="capital-info">
      <div class="left">
        <div class="title info">我的业绩</div>
        <div class="content" v-if="isShowAmount">
          <div class="content-left">
            <div class="capital">
              <span class="symbal">￥</span>
              <span class="account">{{performanceData.cTranscationAmount}}</span>
            </div>
            <div class="desc">成交金额</div>
          </div>
          <div class="content-right">
            <div class="account">{{performanceData.cTranscationNum}}</div>
            <div class="desc">成交单数</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title customer">客户信息</div>
        <div class="content">
          <div>
            <div class="num">{{performanceData.cActivateCount}}</div>
            <div class="desc">开通系统数</div>
          </div>
          <div>
            <div class="num">{{performanceData.cRenewActive}}</div>
            <div class="desc">续费系统数</div>
          </div>
          <div v-if="isShowProxy">
            <div class="num">{{performanceData.cSubProxyCount}}</div>
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
    isShowProxy: {
      //是否显示发展代理商
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      proxyId: JSON.parse(localStorage.getItem("token")).proxyId, //代理商id
      empId: JSON.parse(localStorage.getItem("token")).empId, //员工id
      infoDataList: {}, //资金信息和客户信息
      balance: "", //账户余额
      transcationAmount: "", //成交金额
      rechargeAmount: "", //充值金额
      activateCount: "", //开通系统数
      renewActive: "", //续费系统数
      subProxyCount: "", // 下级代理商数量
      isShow: "" // 是否是管理员，展示
    };
  },
  computed: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 处理成交金额,成交单数,开通系统数,续费系统数,发展代理商数据
     * @return: 成交金额,成交单数,开通系统数,续费系统数,发展代理商
     * @Date: 2019-10-22 19:48:36
     */
    performanceData() {
      let tempCt = (this.infoDataList.transcationAmount / 100).toFixed(2);
      let tempCn =
        this.infoDataList.activateCount + this.infoDataList.renewActive;
      let tempCa = this.infoDataList.activateCount;
      let tempCr = this.infoDataList.renewActive;
      let tempCs = this.infoDataList.subProxyCount;
      return {
        cTranscationAmount: isNaN(tempCt) ? "0.00" : tempCt,
        cTranscationNum: isNaN(tempCn) ? "0" : tempCn,
        cActivateCount: isNaN(tempCa) ? "0" : tempCa,
        cRenewActive: isNaN(tempCr) ? "0" : tempCr,
        cSubProxyCount: isNaN(tempCs) ? "0" : tempCs
      };
    }
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
      this.$emit("clickChange");
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
      this.$emit("clickAgentData");
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
        proxyId: this.proxyId,
        empId: this.empId
      };
      getInfoDetail(data).then(res => {
        if (res.code == 200) {
          this.infoDataList = res.data;
        }
      });
    }
  },
  created() {
    this.getInfoData();
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
    border: 1px solid rgba(240, 240, 240, 1);
    box-shadow: 0px 0px 6px 0px rgba(181, 184, 191, 0.2);
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
    .name {
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
        }
        .content-right {
          .account {
            margin-bottom: 14px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            font-size: 24px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            >span {
              font-size: 14px;
            } 
          }
          .desc {
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
          margin-bottom: 14px;
          text-align: center;
          height: 18px;
          line-height: 18px;
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
        .desc {
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