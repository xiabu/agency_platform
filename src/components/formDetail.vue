<!--
 * @Description: 
 * @Author: 李沛韬（929498346@qq.com）
 * @Date: 2019-09-26 10:23:10
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-10-21 15:01:19
 -->
<template>
  <div class="formDetail">
    <div class="form">
      <div class="form-name">表单信息</div>
      <div class="form-span">
        <div class="span1" v-if="c1">表单类型：新购单</div>
        <div class="span2" v-if="b == 0">审核状态：已拒绝</div>
        <div class="span2" v-if="b == 2">审核状态：已通过 <span style="color: #FF7B8C">（账号未开通）</span></div>
        <div class="span2" v-if="b == 1">审核状态：待审核</div>
      </div>
      <div class="form-body">
        <div :class="a ? 'infor' : 'infor1'">
          <div class="infor-name">提交人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>提交人姓名：</div><span>关鹏飞</span>
            </div>
            <div class="inforindex">
              <div>手机号：</div><span>12345678901</span>
            </div>
            <div class="inforindex">
              <div>企业名称：</div><span>自由人网络代理商</span>
            </div>
            <div class="inforindex">
              <div>关联员工：</div><span>关鹏飞</span>
            </div>
            <div class="inforindex">
              <div>提价时间：</div><span>2019-03-21 12:23:51</span>
            </div>
          </div>
        </div>
        <div v-if="a2" :class="a ? 'infor' : 'infor1'">
          <div class="infor-name">购买人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>购买人姓名：</div><span>秦羽</span>
            </div>
            <div class="inforindex">
              <div>购买人手机号：</div><span>12345678901</span>
            </div>
            <div class="inforindex">
              <div>购买人公司：</div><span>鹏飞网络科技有限公司</span>
            </div>
            <div class="inforindex">
              <div>付款凭据：</div>
              <span style="cursor: pointer;" class="blue">查看凭据</span>
              <span>-</span>
            </div>
          </div>
        </div>
        <div :class="a ? 'infor' : 'infor1'">
          <div class="infor-name">表单内容：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>商品信息：</div><span>50人 (标准版) ¥19800.00</span>
            </div>
            <div class="inforindex">
              <div>价格：</div><span> ¥109800.00</span>
            </div>
            <div class="inforindex">
              <div>可开通名片数：</div><span>50</span>
            </div>
            <div class="inforindex">
              <div>购买时长：</div><span>20</span>
            </div>
            <div class="inforindex">
              <div>扣款信息：</div><span>扣除账户0元</span>
            </div>
          </div>
        </div>
        <div v-if="a1" :class="a ? 'infor' : 'infor1'">
          <div class="infor-name">操作人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>操作人：</div><span>-</span>
            </div>
            <div class="inforindex">
              <div>审核时间：</div><span>-</span>
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
              <div>发票抬头：</div><span>个人</span>
            </div>
            <div class="inforindex">
              <div>发票内容：</div><span>50人 (标准版) ¥19800.00，20年，¥109800.00</span>
            </div>
            <div class="inforindex">
              <div>发票金额：</div><span>¥109800.00</span>
            </div>
          </div>
        </div>
        <div class="infor0">
          <div class="infor-name">收票人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>收票人姓名：</div><span>5秦羽</span>
            </div>
            <div class="inforindex">
              <div>收票人手机：</div><span>15000000006</span>
            </div>
            <div class="inforindex">
              <div>收票人邮箱：</div><span>109800@qq.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-btn" v-if="b == 1">
      <el-button @click="cancel">拒绝</el-button>
      <el-button type="primary" @click="save('ruleForm')">通过</el-button>
    </div>
    <div class="footer-btn" v-if="b == 2">
      <el-button type="primary" @click="save('ruleForm')">开通账号</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // a1: {
    //   //操作人信息
    //   type: Boolean,
    //   default: false
    // },
    // a2: {
    //   //购买人信息
    //   type: Boolean,
    //   default: true
    // },
    // b1: {
    //   //按钮控制 0-无按钮 1-通过拒绝 2-开通账号
    //   type: Number,
    //   default: 0
    // },
    // c1: {
    //   //是否显示表单类型
    //   type: Boolean,
    //   default: true
    // }
  },
  data() {
    return {
      a1: false, //操作人信息
      a2: true, //购买人信息
      a: this.a1 && this.a2 ? true : false, //样式控制
      b: 2, //按钮控制 0-无按钮 1-通过拒绝 2-开通账号
      c1: false //是否显示表单类型
    };
  },
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 拒绝
     * @param {type}
     * @return:
     * @Date: 2019-10-21 15:01:03
     */
    cancel() {},
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 通过
     * @param {type}
     * @return:
     * @Date: 2019-10-21 15:01:12
     */
    save() {}
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
      height: 252px;
      display: flex;
      .infor {
        border: 1px solid #e5e5e5;
        min-width: 380px;
        max-width: 100%/4;
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
        border-left: 1px solid #e5e5e5;
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
        border-left: 1px solid #e5e5e5;
        max-width: 100%/3;
        min-width: 380px;
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
}
</style>