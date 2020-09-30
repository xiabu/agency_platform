<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-11-05 09:57:35
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
<template>
  <div class="formDetail">
    <div class="form">
      <div class="form-name" v-if="order.orderType != 2">表单信息</div>
      <div class="form-name" v-if="order.orderType == 2">充值单信息</div>
      <div class="form-span">
        <div class="span2" v-if="order.orderStatus == 2">审核状态：已拒绝</div>
        <div class="span2" v-if="order.orderStatus == 1">审核状态：已通过<span v-if="order.orderType == 0"
            :style="order.activeAccount == 2 ? 'color: #4da1ff' : 'color: #FF7B8C'">{{order.activeAccount == 2 ? '（账号已开通）' : '（账号未开通）'}}
          </span></div>
        <div class="span2" v-if="order.orderStatus == 0">审核状态：待审核</div>
      </div>
      <div class="form-body">
        <div :class="Purchaser ? 'infor' : 'infor1'">
          <div class="infor-name">提交人信息：</div>
          <div class="infor-body" v-if="Purchaser">
            <div class="inforindex">
              <div>提交人姓名：</div><span>{{order.proxyUsername || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>手机号：</div><span>{{order.proxyMobilePhone || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>企业名称：</div><span>{{order.proxyCompanyName || '-'}}</span>
            </div>
            <div v-if="Purchaser" class="inforindex">
              <div>关联员工：</div><span>{{order.employeeName || '-'}}</span>
            </div>
            <div v-else class="inforindex">
              <div>联系电话：</div><span>{{order.contactPhone || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>提交时间：</div><span>{{order.createTime || '-'}}</span>
            </div>
          </div>
          <div class="infor-body" v-else>
            <div class="inforindex">
              <div>提交人姓名：</div><span>{{order.customerName || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>手机号：</div><span>{{order.customerPhone || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>企业名称：</div><span>{{order.customerCompanyName || '-'}}</span>
            </div>
            <div v-if="Purchaser" class="inforindex">
              <div>关联员工：</div><span>{{order.employeeName || '-'}}</span>
            </div>
            <div v-else class="inforindex">
              <div>联系电话：</div><span>{{order.contactPhone || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>提交时间：</div><span>{{order.createTime || '-'}}</span>
            </div>
          </div>
        </div>
        <div v-if="Purchaser" :class="Purchaser ? 'infor' : 'infor1'">
          <div class="infor-name">购买人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>购买人姓名：</div><span>{{order.customerName || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>购买人手机号：</div><span>{{order.customerPhone || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>购买人公司：</div><span>{{order.customerCompanyName || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>付款凭据：</div>
              <span v-if="itemUrl.length > 0" class="blue" style="cursor: pointer;" @click="lookEvidence">查看凭据</span>
              <span v-else>-</span>
            </div>
            <div class="inforindex">
              <div>备注：</div><span class="remark">
                <el-tooltip v-if="order.remark" popper-class='atooltip' class="item" effect="dark"
                  :content="order.remark" placement="top">
                  <span>{{order.remark}}</span>
                </el-tooltip>
                <span v-else>-</span>
              </span>
            </div>
          </div>
        </div>
        <div :class="Purchaser ? 'infor' : 'infor1'">
          <div class="infor-name">表单内容：</div>
          <div v-if="Purchaser" class="infor-body">
            <div class="inforindex">
              <div>商品信息：</div><span>{{order.productName || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>价格：</div><span>¥{{Number(order.buyPrice/100).toFixed(2) || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>可开通名片数：</div><span>{{order.cardNum || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>购买时长：</div><span>{{order.buyYear || '-'}}年</span>
            </div>
            <div class="inforindex">
              <div>扣款信息：</div><span>扣除账户¥{{Number(order.paymentAmount/100).toFixed(2) || '-'}}</span>
            </div>
          </div>
          <div v-else class="infor-body">
            <div class="inforindex">
              <div>申请金额：</div><span>¥{{Number(order.amount/100).toFixed(2) || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>账户余额：</div><span>¥{{Number(order.balance/100).toFixed(2) || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>付款凭据：</div>
              <span v-if="itemUrl.length > 0" class="blue" style="cursor: pointer;" @click="lookEvidence">查看凭据</span>
              <span v-else>-</span>
            </div>
            <div class="inforindex">
              <div>备注：</div><span class="remark">
                <el-tooltip v-if="order.remark" popper-class='atooltip' class="item" effect="dark"
                  :content="order.remark" placement="top">
                  <span>{{order.remark}}</span>
                </el-tooltip>
                <span v-else>-</span>
              </span>
            </div>
          </div>
        </div>
        <div :class="Purchaser ? 'infor' : 'infor1'">
          <div class="infor-name">操作人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>操作人：</div><span>{{order.operateName || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>审核时间：</div><span>{{order.updateTime || '-'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form">
      <div class="form-name">发票信息</div>
      <div v-if="!note" class="noNote">未申请开票</div>
      <div v-if="note" class="form-span">
        <div class="span1" v-if="note.noteType == 1">发票类型：普通发票-电子普通发票</div>
        <div class="span1" v-if="note.noteType == 2">发票类型：增值税专用发票-电子专用发票</div>
      </div>
      <div v-if="note" class="form-body">
        <div class="infor0">
          <div class="infor-name">发票信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>发票抬头：</div><span v-if="note.head == 1">单位</span><span v-if="note.head == 2">个人</span>
            </div>
            <div class="inforindex" v-if="note.head == 1">
              <div>单位名称：</div><span>{{note.headName || '-'}}</span>
            </div>
            <div class="inforindex" v-if="note.head == 1">
              <div>税号：</div><span>{{note.taxFileNumber || '-'}}</span>
            </div>
            <div class="inforindex" v-if="note.noteType == 2">
              <div>开户银行：</div><span>{{note.bankName || '-'}}</span>
            </div>
            <div class="inforindex" v-if="note.noteType == 2">
              <div>银行账号：</div><span>{{note.bankAccount || '-'}}</span>
            </div>
            <div class="inforindex" v-if="note.noteType == 2">
              <div>单位地址：</div><span>{{note.address || '-'}}</span>
            </div>
            <div class="inforindex" v-if="note.noteType == 2">
              <div>单位电话：</div><span>{{note.telephone || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>发票内容：</div><span>{{note.content || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>发票金额：</div><span>¥{{Number(note.amount/100).toFixed(2) || '-'}}</span>
            </div>
          </div>
        </div>
        <div class="infor0">
          <div class="infor-name">收票人信息：</div>
          <div class="infor-body">
            <div class="inforindex">
              <div>收票人姓名：</div><span>{{note.receiverName || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>收票人手机：</div><span>{{note.receiverPhone || '-'}}</span>
            </div>
            <div class="inforindex">
              <div>收票人邮箱：</div><span>{{note.receiverEmail || '-'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-btn" v-if="order.orderStatus == 0">
      <el-button @click="refuse">拒绝</el-button>
      <el-button type="primary" @click="submit">通过</el-button>
    </div>
    <div class="footer-btn" v-if="order.orderStatus == 1 && order.activeAccount == 1 && order.orderType == 0">
      <el-button type="primary" @click="account">开通账号</el-button>
    </div>
    <open-account @dialogSubmit="dialogSubmit" @closeDialog="closeDialog" :isShow="isShow" :loginAccount="loginAccount">
    </open-account>
    <pass-review @passSubmit="passSubmit" :paymentAmount="amountCount" :showPassReview="showPassReview"
      @closeDialogReview="closeDialogReview">
    </pass-review>
    <refuse-review @refuseSubmit="refuseSubmit" :showReview="showReview" @closeReview="closeReview"></refuse-review>
    <el-dialog width="800px !important" title="查看图片" v-if="itemUrl.length > 0" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
      <el-carousel :autoplay="false">
        <el-carousel-item v-for="(item, index) in itemUrl" :key="index">
          <img :src="cdnUrl + item" alt="" />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <el-button class="goback" type="primary" @click="$router.go(-1)">返回</el-button>
  </div>
</template>
<script>
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import formDetail from "../../components/formDetail";
import {
  getOrderDetail,
  apiAuditOrder,
  apiAccountData
} from "../../api/mangeCenter.js";
import openAccount from "../../components/openAccount";
import passReview from "../../components/passReview";
import refuseReview from "../../components/refuseReview";
export default {
  components: {
    formDetail,
    openAccount,
    passReview,
    refuseReview
  },
  data() {
    return {
      // itemUrl1: [
      //   "http://img2.imgtn.bdimg.com/it/u=1696441894,223923610&fm=26&gp=0.jpg",
      //   "http://img1.imgtn.bdimg.com/it/u=4090707406,1925774851&fm=26&gp=0.jpg"
      // ],
      loginAccount: "", // 登录账号
      cdnUrl: "http://agencytest.oss-cn-hangzhou.aliyuncs.com/", //图片cdn
      itemUrl: [], //付款凭据
      dialogTableVisible: false, //查看凭据弹窗的显示
      proxxyId: JSON.parse(localStorage.getItem("token")).proxyId, //代理商id
      isShow: false, //是否显示弹框
      showReview: false, //是否显示审核拒绝弹框
      showPassReview: false, // 是否显示审核通过弹框
      note: {}, //发票信息
      order: {}, //表单信息
      Purchaser: true, //购买人信息
      amountCount: 0, //扣款金额
      loginAccount: "" // 登录账号
    };
  },
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 查看凭据
     * @param {type}
     * @return:
     * @Date: 2019-10-10 14:53:27
     */
    lookEvidence() {
      this.dialogTableVisible = true;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 开通账号
     * @param {type}
     * @return:
     * @Date: 2019-10-10 10:01:15
     */
    account() {
      this.isShow = true;
      this.loginAccount = this.order.customerPhone;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 关闭开通
     * @param {type}
     * @return:
     * @Date: 2019-10-10 10:01:00
     */
    closeDialog() {
      this.isShow = false;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 开通账号
     * @param {type}
     * @return:
     * @Date: 2019-10-10 10:00:48
     */
    dialogSubmit(dialogForm) {
      let data = {
        orderId: this.$route.params.id,
        username: dialogForm.login,
        password: rsaJsencrypt(dialogForm.password)
      };
      apiAccountData(data).then(res => {
        if (res.code == 200) {
          this.isShow = false;
          this.$message.success(res.msg);
          this.getDetail();
        } else {
          // this.isShow = false;
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 关闭拒绝
     * @param {type}
     * @return:
     * @Date: 2019-10-10 10:00:38
     */
    closeReview() {
      this.showReview = false;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 拒绝
     * @param {type}
     * @return:
     * @Date: 2019-10-10 10:00:29
     */
    refuseSubmit() {
      let data = {
        orderId: this.$route.params.id,
        // password: passReview.password,
        proxyId: this.proxyId,
        orderStatus: 2
      };
      apiAuditOrder(data).then(res => {
        if (res.code === 200) {
          this.showReview = false;
          this.$message.success(res.msg);
          this.getDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 审核通过
     * @param {type}
     * @return:
     * @Date: 2019-10-10 09:27:58
     */
    passSubmit(passReview) {
      let data = {
        orderId: this.$route.params.id,
        password: rsaJsencrypt(passReview.password),
        proxyId: localStorage.proxyId,
        orderStatus: 1
      };
      apiAuditOrder(data).then(res => {
        if (res.code === 200) {
          this.showPassReview = false;
          this.$message.success(res.msg);
          this.getDetail();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 关闭审核通过弹窗
     * @param {type}
     * @return:
     * @Date: 2019-10-10 09:23:55
     */
    closeDialogReview() {
      this.showPassReview = false;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 拒绝
     * @param {type}
     * @return:
     * @Date: 2019-10-09 10:16:02
     */
    refuse() {
      this.showReview = true;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 通过
     * @param {type}
     * @return:
     * @Date: 2019-10-09 10:16:11
     */
    submit() {
      this.showPassReview = true;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 获取详情
     * @param {type}
     * @return:
     * @Date: 2019-10-09 15:33:22
     */
    getDetail() {
      let data = {
        orderId: this.$route.params.id
      };
      getOrderDetail(data).then(res => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.itemUrl = eval(res.data.order.evidence);
          });
          this.note = res.data.note;
          this.order = res.data.order;
          if (this.order.orderType == 2) {
            this.Purchaser = false;
          }
          this.amountCount = res.data.order.paymentAmount;
        }
      });
    }
  },
  created() {
    this.getDetail();
  }
};
</script>
<style lang="less" scoped>
.formDetail {
  width: 100%;
  .form {
    margin-bottom: 38px;
    .noNote {
      border-top: none !important;
      border: 1px solid #e5e5e5;
      height: 301px;
      text-align: center;
      line-height: 301px;
      font-size: 14px;
      color: #999;
    }
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
      border-top: none !important;
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
      overflow: hidden;
      font-size: 14px;
      display: flex;
      border: 1px solid #e5e5e5;
      border-top: none;
      .infor {
        padding-bottom: 30px;
        border-left: 1px solid #e5e5e5;
        max-width: 100%/3;
        min-width: 380px;
        padding-left: 20px;
        padding-right: 20px;
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
            .remark {
              height: 28px;
              cursor: pointer;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .blue {
              color: #4da1ff;
            }
            span {
              word-break: break-all;
            }
          }
          .inforindex:last-child {
            margin-bottom: 0px;
          }
        }
      }
      .infor:last-child {
        border-right: none;
      }
      .infor:first-child {
        border-left: none;
      }
      .infor0 {
        padding-bottom: 30px;
        border: 1px solid #e5e5e5;
        border-bottom: none;
        border-top: none;
        border-right: none;
        width: 100%/2;
        padding-left: 20px;
        padding-top: 31px;
        padding-right: 20px;
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
            .remark {
              height: 28px;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .blue {
              color: #4da1ff;
            }
            span {
              word-break: break-all;
            }
          }
          .inforindex:last-child {
            margin-bottom: 0px;
          }
        }
      }
      .infor0:last-child {
        border-right: none;
      }
      .infor0:first-child {
        border-left: none;
      }
      .infor1 {
        padding-bottom: 30px;
        border-left: 1px solid #e5e5e5;
        max-width: 100%/3;
        min-width: 380px;
        padding-right: 20px;
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
            .remark {
              height: 28px;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .blue {
              color: #4da1ff;
            }
            span {
              word-break: break-all;
            }
          }
          .inforindex:last-child {
            margin-bottom: 0px;
          }
        }
      }
      .infor1:first-child {
        border-left: none;
      }
      .infor1:last-child {
        border-right: none;
      }
    }
    .form-body:hover {
      overflow-y: hidden;
      overflow-x: auto;
    }
    .form-body::-webkit-scrollbar {
      height: 7px;
      border-bottom: 1px solid #e5e5e5;
    }
    .form-body::-webkit-scrollbar-thumb {
      border-radius: 7px;
      background: #e6e6e6;
    }
    .form-body::-webkit-scrollbar-track {
      border-radius: 7px;
      background: #fff;
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
<style lang="less">
.el-carousel__container {
  height: 400px;
  background: #f5f5f5;
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