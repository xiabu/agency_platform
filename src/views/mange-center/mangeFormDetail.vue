<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-08 16:20:59
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 -->
<template>
  <div class="formDetail">
    <div class="form">
      <div class="form-name">表单信息</div>
      <div class="form-span">
        <div class="span2" v-if="orderStatus == 0">审核状态：已拒绝</div>
        <div class="span2" v-if="orderStatus == 2">审核状态：已通过 <span v-if="orderType == 1"
            :style="account ? 'color: #4da1ff' : 'color: #FF7B8C'">{{account ? '（账号已开通）' : '（账号未开通）'}} </span></div>
        <div class="span2" v-if="orderStatus == 1">审核状态：待审核</div>
      </div>
      <div class="form-body">
        <div :class="astyle ? 'infor' : 'infor1'">
          <div class="infor-name">提交人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>提交人姓名：</div><span>{{orderData.customerName}}</span>
            </div>
            <div class="inforindex">
              <div>手机号：</div><span>{{orderData.customerPhone}}</span>
            </div>
            <div class="inforindex">
              <div>企业名称：</div><span>{{orderData.customerCompanyName}}</span>
            </div>
            <div class="inforindex">
              <div>关联员工：</div><span>{{orderData.employeeName}}</span>
            </div>
            <div class="inforindex">
              <div>提价时间：</div><span>{{orderData.updateTime}}</span>
            </div>
          </div>
        </div>
        <div v-if="Purchaser" :class="astyle ? 'infor' : 'infor1'">
          <div class="infor-name">购买人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>购买人姓名：</div><span>{{orderData.proxyUsername}}</span>
            </div>
            <div class="inforindex">
              <div>购买人手机号：</div><span>{{orderData.proxyMobilePhone}}</span>
            </div>
            <div class="inforindex">
              <div>购买人公司：</div><span>{{orderData.proxyCompanyName}}</span>
            </div>
            <div class="inforindex">
              <div>付款凭据：</div><span class="blue" @click="handleLookView(orderData.createTime)">查看凭据</span>
            </div>
          </div>
        </div>
        <div :class="astyle ? 'infor' : 'infor1'">
          <div class="infor-name">表单内容：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>商品信息：</div><span>{{orderData.createTime}}</span>
            </div>
            <div class="inforindex">
              <div>价格：</div><span>{{orderData.createTime}}</span>
            </div>
            <div class="inforindex">
              <div>可开通名片数：</div><span>{{orderData.createTime}}</span>
            </div>
            <div class="inforindex">
              <div>购买时长：</div><span>{{orderData.createTime}}</span>
            </div>
            <div class="inforindex">
              <div>扣款信息：</div><span>{{orderData.createTime}}</span>
            </div>
            <div class="inforindex">
              <div>备注：</div><span>{{orderData.createTime}}</span>
            </div>
          </div>
        </div>
        <div v-if="Operator" :class="astyle ? 'infor' : 'infor1'">
          <div class="infor-name">操作人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>操作人：</div><span>{{orderData.createTime}}</span>
            </div>
            <div class="inforindex">
              <div>审核时间：</div><span>{{orderData.createTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form">
      <div class="form-name">发票信息</div>
      <div class="form-span">
        <div class="span1">发票类型：普通发票-电子普通发票</div>
      </div>
      <div class="form-body">
        <div class="infor0">
          <div class="infor-name">发票信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>发票抬头：</div><span>{{noteData.head || ""}}</span>
            </div>
            <div class="inforindex">
              <div>发票内容：</div><span>{{noteData.head || ""}}</span>
            </div>
            <div class="inforindex">
              <div>发票金额：</div><span>{{noteData.head || ""}}</span>
            </div>
          </div>
        </div>
        <div class="infor0">
          <div class="infor-name">收票人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>收票人姓名：</div><span>{{noteData.head || ""}}</span>
            </div>
            <div class="inforindex">
              <div>收票人手机：</div><span>{{noteData.head || ""}}</span>
            </div>
            <div class="inforindex">
              <div>收票人邮箱：</div><span>{{noteData.head || ""}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-btn" v-if="bcontrol == 1">
      <el-button @click="cancel">拒绝</el-button>
      <el-button type="primary" @click="save('ruleForm')">通过</el-button>
    </div>
    <div class="footer-btn" v-if="bcontrol == 2">
      <el-button type="primary" @click="save('ruleForm')">开通账号</el-button>
    </div>
    <el-button class="goback" type="primary" @click="$router.go(-1)">返回</el-button>
  </div>
</template>
<script>
import formDetail from "../../components/formDetail";
import { getOrderDetail } from "../../api/mangeCenter.js";
export default {
  components: {
    formDetail
  },
  data() {
    return {
      orderData: {},
      noteData: {},
      formTypes: false, //是否显示表单类型
      Operator: true, //操作人信息
      Purchaser: true, //购买人信息
      astyle: true, //样式控制
      bcontrol: 0, //按钮控制 0-无按钮 1-通过拒绝 2-开通账号
      account: true, //是否通过
      orderType: 1, //表单类型
      orderStatus: 2 //表单状态
    };
  },
  methods: {
    cancel() {},
    save() {}
  },
  created() {
    let data = {
      orderId: this.$route.params.id
    };
    getOrderDetail(data).then(res => {
      if (res.code === 200) {
        this.orderData = res.data.order;
        this.orderData.buyerInfo = this.orderData.buyerInfo.split("\n");
        this.orderData.proxyInfo = this.orderData.proxyInfo.split("\n");
        // this.noteData = res.data.note
      } else {
        this.$message.error(res.data.msg);
      }
      console.log(this.orderData, this.noteData);
    });
  }
};
</script>
<style lang="less" scoped>
.formDetail {
  width: 100%;
  .form {
    margin-bottom: 38px;
    .form-name {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #333;
      background: #f7f8fa;
      border: 1px solid #e5e5e5;
      padding-left: 20px;
      font-weight: bold;
    }
    .form-span {
      height: 50px;
      line-height: 50px;
      display: flex;
      color: #333;
      font-size: 14px;
      border: 1px solid #e5e5e5;
      padding-left: 19px;
      font-weight: bold;
      .span1 {
        margin-right: 291px;
      }
    }
    .form-body {
      font-size: 14px;
      display: flex;
      .infor {
        height: 270px;
        border: 1px solid #e5e5e5;
        width: 100%/4;
        padding-left: 20px;
        padding-top: 31px;
        display: flex;
        color: #333;
        .infor-name {
          font-weight: bold;
          line-height: 24px;
          margin-right: 10px;
          white-space: nowrap;
        }
        .infor-body {
          .inforindex {
            line-height: 24px;
            margin-bottom: 20px;
            display: flex;
            div {
              min-width: 98px;
              color: #999;
              margin-right: 12px;
              text-align: right;
            }
            .blue {
              color: #4da1ff;
            }
          }
          .inforindex:last-child {
            margin-bottom: 0px;
          }
        }
      }
      .infor0 {
        height: 220px;
        border: 1px solid #e5e5e5;
        width: 100%/2;
        padding-left: 20px;
        padding-top: 31px;
        display: flex;
        color: #333;
        .infor-name {
          font-weight: bold;
          line-height: 24px;
          margin-right: 10px;
          white-space: nowrap;
        }
        .infor-body {
          .inforindex {
            line-height: 24px;
            margin-bottom: 20px;
            display: flex;
            div {
              min-width: 98px;
              color: #999;
              margin-right: 12px;
              text-align: right;
            }
            .blue {
              color: #4da1ff;
            }
          }
          .inforindex:last-child {
            margin-bottom: 0px;
          }
        }
      }
      .infor1 {
        height: 220px;
        border: 1px solid #e5e5e5;
        width: 100%/3;
        padding-left: 20px;
        padding-top: 31px;
        display: flex;
        color: #333;
        .infor-name {
          font-weight: bold;
          line-height: 24px;
          margin-right: 10px;
          white-space: nowrap;
        }
        .infor-body {
          .inforindex {
            line-height: 24px;
            margin-bottom: 20px;
            display: flex;
            div {
              min-width: 98px;
              color: #999;
              margin-right: 12px;
              text-align: right;
            }
            .blue {
              color: #4da1ff;
            }
          }
          .inforindex:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }
  }
  .goback {
    position: fixed;
    top: 79px;
    width: 80px;
    right: 20px;
    border-radius: 4px;
  }
}
</style>