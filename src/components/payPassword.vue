<!--
 * @Description: 支付密码弹窗
 * @Author: 郭亮（849324068@qq.com）
 * @Date: 2019-09-16 21:03:51
 * @LastEditors: 郭亮（guoliang9431@dingtalk.com）
 * @LastEditTime: 2019-11-12 14:51:06
 -->
<template>
  <div class="size">
    <el-dialog title="提示" :visible.sync="visible" width="35%" @close="close" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" class="fromPass">
        <el-form-item style="margin-bottom: 11px">
          <span class="waining" v-if="oneOrTwo"><img
              src="../assets/img/warning@3x.png" />预计扣除账户余额￥{{(pay / 100).toFixed(2)}}</span>
          <div v-if="!oneOrTwo">
            <p class="waining1"><img src="../assets/img/warning@3x.png" />确定要将该店铺变更为【{{productName1}}】</p>
            <p class="money2">店铺有效时间：{{startTime}} 至 {{endTime}}</p>
            <div>
              <span class="money">预计扣除账户余额￥{{(pay / 100).toFixed(2)}}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin-left: -15px" label="支付密码" prop="password">
          <el-input maxlength="16" type="password" v-model="form.password" placeholder="请输入支付密码"></el-input>
        </el-form-item>
        <p v-if="!oneOrTwo" class="money1">稍后结算之前版本剩余金额，并返还到代理商账户</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="checkPass('form')" :disabled="isDisable">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addShopAndOpenAccunt, updateShop } from "../api/shop.js";
import { rsaJsencrypt } from "../assets/js/rsa.js";
export default {
  props: {
    productPrice: { type: Number }, //价格商品
    show: { type: Boolean, default: false }, //控制是否显示
    typeOfSubmit: { type: Boolean, default: true }, //警告内容控制
    passwordOne: { type: Object }, //请求参数
    productName: { type: String }, //商品名称
    effectiveTime: { type: String } //有效时间
  },
  data() {
    return {
      isDisable: false, //表单重复提交
      form: {
        password: "" //支付密码
      },
      // 验证规则
      rules: {
        password: [
          {
            required: true,
            message: "请输入支付密码",
            trigger: "blur"
          },
          {
            min: 8,
            max: 16,
            message: "请输入8-16位的密码长度",
            trigger: "blur"
          }
        ]
      },
      visible: this.show, //控制dialog显示
      singlePrice: this.productPrice, //商品价格
      oneOrTwo: this.typeOfSubmit, //提交类型
      payPassObject: this.passwordOne, //接口请求参数
      productName1: this.productName, //商品名称
      effectiveTime1: this.effectiveTime //有效时间
    };
  },
  /**
   * @author: 郭亮（849324068@qq.com）
   * @description: 计算总价
   * @param {type}
   * @return:
   * @Date: 2019-09-17 10:58:19
   */
  computed: {
    //扣款余额
    pay: function() {
      return this.singlePrice;
    },
    //开始时间
    startTime: function() {
      return this.effectiveTime1.split(" - ")[0];
    },
    //结束时间
    endTime: function() {
      return this.effectiveTime1.split(" - ")[1];
    }
  },
  /**
   * @author: 郭亮（849324068@qq.com）
   * @description: 监听show、productPrice、typeOfSubmit ,visible、singlePrice、oneOrTwo随之变化而变化
   * @param {type}
   * @return:
   * @Date: 2019-09-17 10:58:35
   */
  watch: {
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 监控弹窗是否关闭
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:16:53
     */
    show: {
      immediate: true,
      handler(show) {
        this.visible = show;
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 实时响应获取商品价格
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:17:13
     */
    productPrice: {
      immediate: true,
      handler(productPrice) {
        this.singlePrice = productPrice;
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 区分提交类型 开通账号或修改
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:17:44
     */
    typeOfSubmit: {
      immediate: true,
      handler(typeOfSubmit) {
        this.oneOrTwo = typeOfSubmit;
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 监控显示提示语的具体内容判断
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:18:24
     */
    passwordOne: {
      immediate: true,
      handler(passwordOne) {
        this.payPassObject = passwordOne;
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 实时响应获取商品名称
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:19:10
     */
    productName: {
      immediate: true,
      handler(productName) {
        this.productName1 = productName;
      }
    },
    /**
     * @author: 郭亮（guoliang9431@dingtalk.com）
     * @description: 实时响应获取商品购买期限
     * @param {type}
     * @return:
     * @Date: 2019-10-17 15:19:10
     */
    effectiveTime: {
      immediate: true,
      handler(effectiveTime) {
        this.effectiveTime1 = effectiveTime;
      }
    }
  },
  methods: {
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 重置表单
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:58:51
     */
    OnReset() {
      this.$refs.form.resetFields();
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 提交表单并验证密码是否正确,余额是否充足
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:38:35
     */
    checkPass(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.addAccunt();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 请求表单接口
     * @param {type}
     * @return:
     * @Date: 2019-09-24 20:53:44
     */
    addAccunt() {
      let _this = this;
      _this.isDisable = true; //开始可以点击
      var params = _this.payPassObject;
      this.$set(params, "payPassword", rsaJsencrypt(_this.form.password));
      let arrayLength = Object.keys(params);
      if (arrayLength[arrayLength.length - 2] === "paymentVoucherPicUrl") {
        addShopAndOpenAccunt(params).then(res => {
          _this.isDisable = false; //执行请求后就不能点击了
          if (res.code === 200) {
            _this.$message({
              message: res.msg,
              type: "success"
            });
            _this.OnReset();
            _this.$router.push("/shop");
          } else {
            _this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      } else {
        updateShop(params).then(res => {
          _this.isDisable = false; //执行请求后就不能点击了
          if (res.code === 200) {
            _this.$message({
              message: res.msg,
              type: "success"
            });
            _this.OnReset();
            _this.$router.push("/shop");
          } else {
            _this.$message({
              message: res.msg,
              type: "error"
            });
          }
        });
      }
    },
    /**
     * @author: 郭亮（849324068@qq.com）
     * @description: 关闭弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-17 10:32:32
     */
    close() {
      this.$emit("update:show", false); // 子组件更新弹框隐藏
      this.OnReset();
    }
  }
};
</script>
<style lang="less">
.size {
  .waining {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 2px;
      padding-right: 4px;
    }
  }
  .waining1 {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
    display: flex;
    align-items: baseline;
    img {
      width: 14px;
      height: 14px;
      position: relative;
      top: 2px;
      padding-right: 4px;
    }
  }
  .money {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    position: relative;
    left: 18px;
  }
  .money1 {
    line-height: 14px;
    padding-top: 8px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999;
    position: relative;
    left: 18px;
  }
  .money2 {
    line-height: 14px;
    margin-top: 8px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    position: relative;
    left: 18px;
    margin-bottom: 17px;
  }
}
</style>