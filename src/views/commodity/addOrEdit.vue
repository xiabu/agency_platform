<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:53:55
 * @LastEditTime: 2019-10-31 11:29:18
 * @LastEditors: 李丽琼（1581868603@qq.com）
 -->
<template>
  <div class="addOrEdit">
    <el-form class="form" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="auto">
      <el-form-item label="商品名称" prop="name">
        <el-input type="text" maxlength="40" show-word-limit v-model="ruleForm.name" placeholder="请输入商品名称"
          class="input"></el-input>
      </el-form-item>
      <el-form-item label="商品图片" prop="img">
        <upload-img :imgNum="1" class="uploadImg" @checkImg="checkImg" :imgs="ruleForm.img"></upload-img>
        <p class="tip">大小不超过2M</p>
        <!-- <p class="check" v-show="ruleForm.img == '' && showTip">请上传商品图片</p> -->
      </el-form-item>
      <el-form-item label="购买价格" prop="price">
        <el-input maxlength="10" autoComplete="new-password" v-model="ruleForm.price" class="input"
          placeholder="请输入购买价格"></el-input>
      </el-form-item>
      <el-form-item label="续费价格" prop="rprice">
        <el-input maxlength="10" autoComplete="new-password" v-model="ruleForm.rprice" class="input"
          placeholder="请输入续费价格"></el-input>
      </el-form-item>
      <el-form-item label="关联名片版本" prop="card">
        <el-select v-model="ruleForm.card" placeholder="请选择关联名片版本" class="option" @blur="blur">
          <el-option v-for="(item, index) in getCardVersion" :label="item.PHPProductName"
            :value="item.relevanceCardVersion" :key="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开通名片数 :" style="margin-left:5px;">
        <span>{{ruleForm.num || '-'}}</span>
      </el-form-item>
      <el-form-item label="是否上架" prop="switchBtn">
        <el-switch v-model="ruleForm.switchBtn" active-color="#4DA1FF" inactive-color="#cccccc">
        </el-switch>
        <div class="option-desc">上架后，代理商可开通/续费此名片版本</div>
      </el-form-item>
    </el-form>
    <div class="footer-btn">
      <el-button @click="handleGoBack">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </div>
</template>
<script>
import uploadImg from "../../components/uploadImg";
import { validateInteger, validateNum } from "../../assets/js/form_validate";
import { editProduct, getProductData, getPHPData } from "../../api/product.js";
import { type } from "os";
import { json } from "body-parser";
export default {
  components: {
    uploadImg
  },
  data() {
    var cardNum = (rule, value, callback) => {
      let reg = /^[0-9]+.?[0-9]*$/;
      if (value != "") {
        if (!reg.test(value)) {
          callback(new Error("请输入数字值"));
          return false;
        } else {
          if (value > 10000) {
            callback(new Error("只能输入大于1-10000的数字"));
            return false;
          } else {
            callback();
          }
        }
      }
      callback();
    };
    var buyPrice = (rule, value, callback) => {
      if (value !== "" && value > 9999999.99) {
        callback(new Error("请输入0-9999999.99的数字"));
        return false;
      } else {
        callback();
      }
    };
    var renewalPrice = (rule, value, callback) => {
      if (value !== "" && value > 9999999.99) {
        callback(new Error("请输入0-9999999.99的数字"));
        return false;
      } else {
        callback();
      }
    };
    return {
      isShow: false, //是否显示关联名片版本为空提示
      showTip: false, //是否显示商品图片为空提示
      // switchBtn: true, //开关是否关闭
      id: "", //商品id
      getCardVersion: [], //名片版本
      ruleForm: {
        name: "",
        img: [],
        num: "",
        price: "",
        rprice: "",
        card: "",
        switchBtn: true
      },
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        img: [{ required: true, message: "请上传商品图片", trigger: "blur" }],
        price: [
          {
            required: true,
            message: "请输入0-9999999.99的数字",
            trigger: "blur"
          },
          { validator: validateNum, trigger: "blur" },
          { validator: buyPrice, trigger: "blur" }
        ],
        rprice: [
          {
            required: true,
            message: "请输入0-9999999.99的数字",
            trigger: "blur"
          },
          { validator: validateNum, trigger: "blur" },
          { validator: renewalPrice, trigger: "blur" }
        ],
        card: [
          { required: true, message: "请选择关联名片版本", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    "ruleForm.card"(newData) {
      this.getCardVersion.forEach(item => {
        if (item.relevanceCardVersion === newData) {
          this.ruleForm.num = item.cardNum;
        }
      });
    }
  },
  methods: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description:
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:23:12
     */
    checkImg(imgArr) {
      this.ruleForm.img = imgArr;
      if (imgArr.length > 0) {
        this.$refs.ruleForm.validateField("img");
      }
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description:
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:23:04
     */
    getData() {
      getPHPData().then(res => {
        if (res.code == 200) {
          this.getCardVersion = res.data;
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description:取消添加商品
     * @param {type}
     * @return:
     * @Date: 2019-09-24 11:38:28
     */
    handleGoBack() {
      this.$refs.ruleForm.resetFields();
      this.$router.push({
        path: "/commodity"
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 添加商品
     * @param {type}
     * @return:
     * @Date: 2019-09-24 11:39:34
     */
    submitForm() {
      if (this.ruleForm.card === this.ruleForm.cardbak) {
        this.ruleForm.card = this.ruleForm.cardNo;
      }
      if (this.value == "") {
        this.isShow = true;
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var data = {
            id: this.$route.params.id,
            productName: this.ruleForm.name,
            productPicUrl: JSON.stringify(this.ruleForm.img),
            cardNum: this.ruleForm.num,
            buyPrice: this.ruleForm.price * 100,
            renewalPrice: this.ruleForm.rprice * 100,
            relevance_card_version: this.ruleForm.card,
            productStatus: this.ruleForm.switchBtn ? 1 : 2
          };
          editProduct(data).then(res => {
            if (res.code == 200) {
              let hint = "";
              this.$route.params.id ? (hint = "修改成功") : (hint = "添加成功");
              this.$message({
                type: "success",
                message: hint
              });
              this.$router.push({
                path: "/commodity"
              });
            }
          });
        }
      });
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 关联名片版本失焦处理
     * @param {type}
     * @return:
     * @Date: 2019-09-24 14:28:03
     */
    blur() {
      this.isShow = true;
    },
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 根据id获取名片版本
     * @param {type}
     * @return:
     * @Date: 2019-10-31 11:28:03
     */
    getCard(relevanceCardVersion) {
      let result = "";
      this.getCardVersion.forEach(ele => {
        if (ele.relevanceCardVersion == relevanceCardVersion) {
          result = ele.PHPProductName;
        }
      });
      return result;
    }
  },
  created() {
    //@update 李丽琼（1581868603@qq.com） 2019-09-27 20:21:50 修改商品详情处理
    getPHPData().then(res => {
      if (res.code == 200) {
        this.getCardVersion = res.data;
        if (this.$route.params.id) {
          let data = {
            productId: this.$route.params.id
          };
          getProductData(data).then(res => {
            if (res.code == 200) {
              this.ruleForm = {
                name: res.data.productName,
                img: JSON.parse(res.data.productPicUrl),
                num: res.data.cardNum,
                price: Number(res.data.buyPrice / 100).toFixed(2),
                rprice: Number(res.data.renewalPrice / 100).toFixed(2),
                cardNo: res.data.relevanceCardVersion,
                cardbak: this.getCard(res.data.relevanceCardVersion),
                card: this.getCard(res.data.relevanceCardVersion),
                switchBtn: res.data.productStatusName == "否" ? false : true
              };
            }
          });
        }
      }
    });
  }
};
</script>
<style lang="less" scoped>
.addOrEdit {
  .el-input__inner {
    color: #333333;
  }
  .footer-btn {
    bottom: 0;
  }
  .option-desc {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
  .card_num {
    height: 12px;
    font-size: 14px;
    color: #333333;
  }
  .form {
    background: #ffffff;
    padding: 20px 0 0 140px;
    margin-bottom: 40px;
    .input {
      width: 400px;
      // margin-bottom: 22px;
    }
    .option {
      width: 400px;
      // margin-top: -5px;
    }
    .uploadImg {
      margin-top: 2px;
    }
    .tip {
      margin-top: 10px;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666;
    }
    .check {
      margin-top: 10px;
      color: #f56c6c;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
    }
  }
}
</style>
<style lang="less">
.addOrEdit {
  .el-input__inner {
    color: #333333;
  }
}
</style>