<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-30 14:46:15
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
<template>
  <div class="agentData">
    <div class="agent-detail">
      <info-detail @clickRecharge="clickRecharge" @clickChange="clickChange" @clickAgentData="clickAgentData"
        :isShowCapital="true" :isShowSupProxy="true" :isShowBalance="true" :isShowRecharge="isShowRecharge">
      </info-detail>
    </div>
    <div class="tab">
      <tab :tabItem="tabList" @tabActiveIndex="tabActiveIndex" :currentTab="active"></tab>
    </div>
    <keep-alive>
      <div :is="currentView"></div>
    </keep-alive>
    <el-button class="goback" type="primary" @click="$router.go(-1)">返回</el-button>
    <!-- 充值弹窗 -->
    <el-dialog title="充值" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="cancelRecharge">
      <el-form :model="dialogForm" :rules="rules" ref="dialogForm">
        <el-form-item label="充值金额" prop="amount">
          <el-input maxlength="9" autoComplete="new-password" @input="oninput" v-model="dialogForm.amount"
            placeholder="请输入充值金额（元）">
          </el-input>
        </el-form-item>
        <el-form-item label="支付密码" prop="payPassword">
          <el-input maxlength="16" autoComplete="new-password" type="password" v-model="dialogForm.payPassword"
            placeholder="请输入支付密码">
          </el-input>
          <span>&nbsp;</span>
        </el-form-item>
        <el-form-item label="付款凭据">
          <upload-img class="uploadImg" @checkImg="checkImg" :imgs='dialogForm.detailImg'></upload-img>
          <p class="tip">大小不超过2M,最多上传3张</p>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" maxlength="200" show-word-limit v-model="dialogForm.remark" placeholder="请输入备注"
            :rows="4">
          </el-input>
        </el-form-item>
        <span style="padding-left: 92px;" v-if="roleType !== 1"><i class="el-icon-warning"></i>
          预计扣除账户余额￥{{Number(amountPay/100).toFixed(2)}}</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogSubmit('dialogForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tab from "../../components/tab";
import { rsaJsencrypt } from "../../assets/js/rsa.js";
import infoDetail from "../../components/infoDetail";
import uploadImg from "../../components/uploadImg";
import {
  validateNum,
  validateScale,
  validateInteger
} from "../../assets/js/form_validate.js";
import { getZixunList, recharge, rechargeInfo } from "../../api/agent.js";
import agentForm from "./agent-form";
import agentIncome from "./agent-income";
import agentRecharge from "./agent-recharge";
import agentStaff from "./agent-staff";
import agentClient from "./agent-client";
import agentSubordinate from "./agent-subordinate";
export default {
  components: {
    tab,
    agentForm,
    agentIncome,
    agentRecharge,
    agentStaff,
    agentClient,
    agentSubordinate,
    infoDetail,
    uploadImg
  },
  data() {
    return {
      isShowRecharge: true,
      roleType: JSON.parse(localStorage.getItem("token")).roleType, //登录权限
      proxyId: JSON.parse(localStorage.getItem("token")).proxyId,
      active: 0, // 当前选中tab的index
      tabList: [
        // tab列表
        { name: "表单信息", child: "agentForm" },
        { name: "收支明细", child: "agentIncome" },
        { name: "充值记录", child: "agentRecharge" },
        { name: "员工", child: "agentStaff" },
        { name: "客户系统", child: "agentClient" },
        { name: "下级代理商", child: "agentSubordinate" }
      ],
      currentView: "agentForm", // 当前组件名称
      name: "", // 代理商名称
      dialogFormVisible: false, // 弹窗状态
      amountPay: "", //实际预扣余额
      proxyId: this.$route.params.proxyId, //代理商id
      subProxyId: "", //下级代理id
      dialogForm: {
        amount: "", // 金额
        payPassword: "", // 支付密码
        remark: "", // 备注
        detailImg: [] //付款凭据
      },
      rules: {
        amount: [
          {
            required: true,
            message: "请输入0-999999999的充值金额",
            trigger: "blur"
          }
          // { validator: validateNum, trigger: "blur" },
          // { validator: validateAmount, trigger: "blur" }
        ],
        payPassword: [
          { required: true, message: "请输入支付密码", trigger: "blur" },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      },
      roleType: JSON.parse(localStorage.getItem("token")).roleType
    };
  },
  watch: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 监听路由变化
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:33:00
     */
    $route(to, from) {
      this.name = this.$route.params.proxyCompanyName;
      sessionStorage["proxyId"] = this.$route.params.proxyId;
      this.pid = this.$route.params.pid;
      this.subProxyId = this.$route.params.proxyId;
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 监控金额,发生变化时 获取折扣金额
     * @param {type}
     * @return:
     * @Date: 2019-10-08 16:56:19
     */
    "dialogForm.amount": {
      deep: true,
      handler: function(val) {
        if (val === "") {
          val = 0;
        }
        this.validateAmount(val);
      }
    }
  },
  created() {
    this.name = this.$route.params.proxyCompanyName;
    sessionStorage["proxyId"] = this.$route.params.proxyId;
    this.pid = this.$route.params.pid;
    this.subProxyId = this.$route.params.proxyId;
    if (this.$route.params.activestatus) {
      // this.proxyId = this.$route.params.proxyId;
      this.tabActiveIndex(this.$route.params.activestatus);
    } else {
      this.tabActiveIndex(0);
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 点击跳转上级代理商详情页面
     * @param {type}
     * @return:
     * @Date: 2019-10-14 11:33:03
     */
    clickChange(id) {
      if (this.pid !== JSON.parse(localStorage.getItem("token")).proxyId) {
        this.$router.push({
          path: "/agent/detail",
          name: "agentDetail",
          params: {
            proxyId: id
          }
        });
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 异步验证,调取amount的值传入后台,对充值金额进行折扣计算
     * @param {type}
     * @return:
     * @Date: 2019-10-23 15:37:08
     */
    validateAmount(value) {
      let params = {
        amount: value * 100,
        subProxyId: this.subProxyId
      };
      rechargeInfo(params).then(res => {
        if (res.code === 200) {
          this.amountPay = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 输入充值金额验证
     * @param {type}
     * @return:
     * @Date: 2019-10-23 15:21:53
     */
    oninput(val) {
      val = val.replace(/[^\d]/g, ""); //清除"数字"以外的字符
      this.dialogForm.amount = val;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 关闭充值弹框清空
     * @Date: 2019-09-24 16:38:01
     */
    cancelRecharge() {
      this.$refs.dialogForm.resetFields();
      this.dialogForm = {
        amount: "", // 金额
        payPassword: "", // 支付密码
        remark: "" // 备注
      };
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 上传图片 接口组件调用
     * @param {type}
     * @return:
     * @Date: 2019-09-29 19:12:43
     */
    checkImg(data) {
      this.dialogForm.detailImg = data;
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 提交表单
     * @param { String } formName [表单对象名字]
     * @Date: 2019-09-24 16:43:01
     * @update: 对接后台接口 郭亮(849324068@qq.com) 2019年9月27日16:43:07
     */
    handleDialogSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            subProxyId: this.subProxyId,
            amount: this.dialogForm.amount * 100,
            payPassword: rsaJsencrypt(this.dialogForm.payPassword),
            remark: this.dialogForm.remark,
            evidence: JSON.stringify(this.dialogForm.detailImg)
          };
          recharge(params).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: res.msg
              });
              this.dialogFormVisible = false;
              this.$refs.dialogForm.resetFields();
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 切换tab更改当前选中index
     * @param { Number } index [tab切换当前index]
     * @Date: 2019-09-24 15:53:39
     */
    tabActiveIndex(index) {
      this.currentView = this.tabList[index].child;
      this.active = index;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 充值
     * @param {type}
     * @return:
     * @Date: 2019-09-24 08:26:09
     */
    clickRecharge() {
      this.dialogFormVisible = true;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 跳转代理商数据
     * @param {type}
     * @return:
     * @Date: 2019-10-09 09:33:21
     */
    clickAgentData(name) {
      this.$router.push({
        path: "/agent/dataDetail",
        name: "dataDetail",
        params: {
          proxyId: this.proxyId,
          companyName: name
        }
      });
    }
  },
  mounted() {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 判断是否显示充值按钮
     * @param {type}
     * @return:
     * @Date: 2019-10-14 19:35:31
     */
    if (!localStorage.getItem("isShowRecharge")) {
      this.isShowRecharge = false;
    }
  }
};
</script>
<style lang="less" scoped>
.agentData {
  .uploadImg {
    margin-top: 0;
    margin-bottom: 0;
  }
  .tip {
    line-height: 12px !important;
    margin-left: 110px;
    margin-top: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }
  .agent-detail {
    width: calc(100% + 40px);
    background: #f7f8fa;
    padding-bottom: 10px;
    margin-left: -20px;
    margin-top: -20px;
  }
  .capital-info {
    .left {
      border-right: 1px solid #ddd;
    }
  }
  .tab {
    height: 46px;
    line-height: 46px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e5e5;
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
.el-icon-warning:before {
  color: #ff7b8c;
}
.el-dialog {
  border-radius: 6px;
}
</style>
