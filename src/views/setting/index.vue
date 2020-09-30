<!--
 * @Description: 创建页面
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 18:54:27
 * @LastEditTime: 2019-11-20 10:58:40
 * @LastEditors: 李沛韬（929498346@qq.com）
 -->
<template>
  <div class="setting">
    <div class="item">
      <div class="item-name logo">企业logo</div>
      <img v-if="image" :src="cdnurl + image" alt="">
      <img v-else src="../../assets/img/favicon.png" alt="">
      <span class="logo modify" @click="addImg">修改</span>
    </div>
    <div class="item">
      <div class="item-name">企业名称</div>
      <div>{{proxyCompanyName}}</div>
    </div>
    <div class="item">
      <div class="item-name">企业地址</div>
      <div class="item-infor"><span>{{provinceName}}-{{cityName}}{{proxyAddress}}</span><span
          @click="modifyAddress">修改</span></div>
    </div>
    <div class="item">
      <div class="item-name" style="margin-right: 125px;">拿货折扣比例</div>
      <div>{{discount}}%</div>
    </div>
    <el-dialog class="el-dialog1" title="企业地址" :visible.sync="propAdd" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="区域" required>
          <Address :addressObj="form" :cityVal='form.city' :addresVal='form.address' />
        </el-form-item>
        <el-form-item>
          <el-form-item label="详细地址">
            <el-input type="textarea" v-model="form.desc" placeholder="请输入详细地址" :rows="4" show-word-limit
              maxlength="60"></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="confirm" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="企业logo" :visible.sync="imgDialog" width="800px !important" :close-on-click-modal="false"
      class="dialog1">
      <div class="box">
        <div class="cut-box">
          <h3>裁剪操作框</h3>
          <div class="cut-img">
            <div v-show="!showImg" class="cut-img-upload">
              <span class="cut-img-default">+添加图片</span>
              <input ref="inp_file_1" type="file" id="file_1" class="upload-file-input"
                accept="image/png, image/jpeg, image/gif, image/jpg" @change="chooseImg($event, 'inp_file_1')">
            </div>
            <vueCropper v-if="showImg" ref="cropper" :mode="mode" :img="option.img" :outputSize="option.size"
              :original="option.original" :outputType="option.outputType" :canMove="option.canMove"
              :canMoveBox="option.canMoveBox" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth"
              :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" :canScale="option.canScale"
              :centerBox="option.centerBox" :full="option.full" :fixed="option.fixed" @realTime="realTime">
            </vueCropper>
          </div>
        </div>
        <div id="preview" class="preview-box">
          <h3>裁剪预览框</h3>
          <div class="preview-img" style="background-color:#999;">
            <div :style="previewStyle">
              <div :style="previews.div">
                <img :src="previews.url" :style="previews.img" v-if="showImg">
              </div>
            </div>
            <div v-if="!showImg" class="preview-img-default">
              <span>请选择图片后预览哦</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="upload">
          <span class="upload-btn-text">选择图片</span>
          <!-- <el-button type="primary" style="width:100%; height: 100%;">选择图片</el-button> -->
          <input ref="inp_file" type="file" id="file" class="input-img"
            accept="image/png, image/jpeg, image/gif, image/jpg" @change="chooseImg($event, 'inp_file')">
        </div>
        <el-button @click="imgDialog = false;previewStyle.zoom=1;">取 消</el-button>
        <el-button type="primary" @click="cutImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Address from "../../components/address";
import { getUpyun, getAliyun } from "../../api/agent.js";
import axios from "axios";
import { updateProxyCom, getProxyCom } from "../../api/setting.js";
import addressData from "../../assets/json/address.json";
export default {
  data() {
    return {
      discount: "", //折扣
      proxyCompanyName: "", //代理商企业名称
      proxyAddress: "", //详细地址
      cityName: "", //市名
      provinceName: "", //省名
      addressItem: [], //省级数据
      image: "", //图片路径
      cdnurl: "http://agencytest.oss-cn-hangzhou.aliyuncs.com/", //图片cdn
      imgDialog: false, //弹框
      showImg: false, //控制图片裁剪框的显示隐藏，用于更新裁剪框的mode
      propAdd: false, //选择地址弹窗
      option: {
        img: "", //裁剪图片的地址
        info: true, //裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        original: false, //是否显示原始宽高
        outputType: "jpeg", //裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        canMove: false, //图片是否允许移动
        canMoveBox: true, //截图框是否允许移动
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 300, // 默认生成截图框宽度
        autoCropHeight: 300, // 默认生成截图框高度
        fixedBox: false, //固定截图框大小 不允许改变
        fixedNumber: [1, 1], //截图框的宽高比例
        centerBox: true, //截图框是否被限制在图片里
        full: true, //是否输出原图比例的截图
        fixed: true //限制裁切图片比例尺寸
      },
      previewStyle: {}, //预览样式
      previews: "", //预览
      form: {
        desc: "", //详细内容
        address: "北京-7460-0", // 省
        city: "北京市-7461" // 市
      }
    };
  },
  components: {
    Address
  },
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 获取企业信息
     * @param {type}
     * @return:
     * @Date: 2019-10-10 11:04:00
     */
    getProxy() {
      getProxyCom().then(res => {
        if (res.code == 200) {
          this.proxyAddress = res.data.proxyAddress;
          this.cityName = res.data.cityName;
          this.provinceName = res.data.provinceName;
          this.proxyCompanyName = res.data.proxyCompanyName;
          this.discount = res.data.discount;
          this.image = res.data.proxyLogo;
          this.form.city = res.data.cityName + "-" + res.data.cityCode;
          for (let index = 0; index < this.addressItem.length; index++) {
            if (res.data.provinceCode == this.addressItem[index].value) {
              this.form.address =
                res.data.provinceName +
                "-" +
                res.data.provinceCode +
                "-" +
                index;
            }
          }
        }
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 裁剪上传
     * @param {type}
     * @return:
     * @Date: 2019-09-20 15:22:29
     */
    cutImg() {
      var that = this;
      if (!this.$refs.cropper) {
        this.$message({
          message: "请选择图片",
          type: "warning",
          duration: 1000
        });
        return false;
      }
      this.$refs.cropper.getCropBlob(data => {
        // var formData = new FormData();
        // formData.append("file", data);
        // 获取图片的签名
        getAliyun().then(res => {
          axios.defaults.headers = {};
          let formData = new FormData();
          formData.append("name", file.name);
          let suffix = file.type.split("/")[1];
          let key = res.dir + this.random_string(10) + "." + suffix;
          formData.append("key", key);
          formData.append("policy", res.policy);
          formData.append("OSSAccessKeyId", res.accessid);
          formData.append("success_action_status", 200);
          formData.append("signature", res.signature);
          formData.append("file", data);
          axios.post(res.host, formData).then(res => {
            that.image = key;
            let data = {
              proxyLogo: key
            };
            updateProxyCom(data).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success"
                });
                sessionStorage.setItem("headerImg", that.image);
              } else {
                this.$message({
                  type: "error",
                  message: res.msg
                });
              }
            });
            axios.defaults.headers = {
              userToken: JSON.parse(localStorage.getItem("token")).userToken
            };
          });
          this.imgDialog = false;
        });
        // getUpyun().then(res => {
        //   formData.append("policy", res.data.policy);
        //   formData.append("authorization", res.data.authorization);
        //   axios.defaults.headers = {};
        //   axios.post(res.data.url, formData).then(res => {
        //     if (res.data.code == 200) {
        //       that.image = res.data.url;
        //       let data = {
        //         proxyLogo: res.data.url
        //       };
        //       updateProxyCom(data).then(res => {
        //         if (res.code == 200) {
        //           this.$message({
        //             message: res.msg,
        //             type: "success"
        //           });
        //           sessionStorage.setItem("headerImg", that.image);
        //         } else {
        //           this.$message({
        //             type: "error",
        //             message: res.msg
        //           });
        //         }
        //       });
        //       axios.defaults.headers = {
        //         userToken: JSON.parse(localStorage.getItem("token")).userToken
        //       };
        //     }
        //   });
        //   this.imgDialog = false;
        // });
      });
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 图片命名
     * @param {type}
     * @return:
     * @Date: 2019-11-05 13:37:23
     */
    random_string(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 预览
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:56:31
     */
    realTime(data) {
      var previews = data;
      var imgPro = previews.w / previews.h;
      var previewPro = 430 / 300;
      let zoom = 1;
      if (previewPro > imgPro) {
        // 按照高度进行缩放
        zoom = 300 / data.h; //放大比例
      } else {
        zoom = 430 / data.w; //放大比例
      }
      this.previewStyle = {
        background: "#999",
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: zoom
      };
      this.previews = data;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 图片上传
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:56:45
     */
    chooseImg($event, ref) {
      var that = this;
      that.showImg = false;
      var reads = new FileReader();
      var file = this.$refs[ref].files[0];
      if (file.size / 1024 / 1024 > 2) {
        that.$message({
          message: "上传图片大小不能超过 2MB!",
          type: "error",
          duration: 2000
        });
        return false;
      }
      if (file.type == "image/png") {
        that.option.outputType = "png";
      } else {
        that.option.outputType = "jpeg";
      }
      reads.readAsDataURL(file);
      reads.onload = function(e) {
        var image = new Image();
        that.option.img = e.currentTarget.result;
        image.src = e.currentTarget.result;
        image.onload = function() {
          that.width = this.width;
          that.height = this.height;
          const imgPro = that.width / that.height;
          const cropPro =
            that.option.fixedNumber[0] / that.option.fixedNumber[1];
          if (imgPro > 1 && cropPro > 1) {
            if (imgPro > cropPro) {
              var height = 300 / imgPro;
              that.mode = `300px ${height}px`;
              that.option.autoCropHeight = height;
              that.option.autoCropWidth = height * cropPro;
            } else {
              var height = 300 / imgPro;
              that.mode = `300px ${height}px`;
              that.option.autoCropWidth = 300;
              that.option.autoCropHeight = 300 / cropPro;
            }
          } else if (imgPro > 1 && cropPro < 1) {
            var height = 300 / imgPro;
            that.mode = `300px ${height}px`;
            that.option.autoCropHeight = height;
            that.option.autoCropWidth = height * cropPro;
          } else if (imgPro > 1 && cropPro === 1) {
            var height = 300 / imgPro;
            that.mode = `300px ${height}px`;
            that.option.autoCropHeight = height;
            that.option.autoCropWidth = height * cropPro;
          } else if (imgPro < 1 && cropPro > 1) {
            var width = 300 * imgPro;
            that.mode = `${width}px 300px`;
            that.option.autoCropWidth = width;
            that.option.autoCropHeight = width / cropPro;
          } else if (imgPro < 1 && cropPro < 1) {
            if (imgPro > cropPro) {
              var width = 300 * imgPro;
              that.mode = `${width}px 300px`;
              that.option.autoCropHeight = 300;
              that.option.autoCropWidth = 300 * cropPro;
            } else {
              var width = 300 * imgPro;
              that.mode = `${width}px 300px`;
              that.option.autoCropWidth = width;
              that.option.autoCropHeight = width / cropPro;
            }
          } else if (imgPro < 1 && cropPro === 1) {
            var width = 300 * imgPro;
            that.mode = `${width}px 300px`;
            that.option.autoCropWidth = 300;
            that.option.autoCropHeight = 300;
          } else if (imgPro === 1 && cropPro > 1) {
            var width = 300 * imgPro;
            that.mode = `${width}px 300px`;
            that.option.autoCropWidth = width;
            that.option.autoCropHeight = width / cropPro;
          } else if (imgPro === 1 && cropPro < 1) {
            var height = 300 / imgPro;
            that.mode = `300px ${height}px`;
            that.option.autoCropHeight = height;
            that.option.autoCropWidth = height * cropPro;
          } else {
            that.option.autoCropHeight = that.option.autoCropWidth = 300;
            that.mode = "300px 300px";
          }
          $event.target.value = "";
          that.showImg = true;
        };
      };
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 修改图片弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:58:10
     */
    addImg() {
      this.imgDialog = true;
      this.showImg = false;
      this.option.img = "";
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 修改地址弹窗
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:58:23
     */
    modifyAddress() {
      this.form.desc = this.proxyAddress;
      this.propAdd = true;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 取消
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:58:42
     */
    cancel() {
      this.propAdd = false;
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 保存
     * @param {type}
     * @return:
     * @Date: 2019-09-29 14:58:48
     */
    confirm() {
      let str = this.form.address.split("-");
      let str1 = this.form.city.split("-");
      let data = {
        provinceCode: str[1],
        provinceName: str[0],
        cityCode: str1[1],
        cityName: str1[0],
        proxyAddress: this.form.desc
      };
      updateProxyCom(data).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.getProxy();
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
      this.propAdd = false;
    }
  },
  created() {
    this.addressItem = addressData; //json数组
    this.getProxy(); //获取企业信息
  }
};
</script>
<style lang="less">
.setting {
  padding: 40px 0 0 80px;
  font-size: 14px;
  color: #333;
  .item {
    display: flex;
    margin-bottom: 60px;
    line-height: 14px;
    .modify {
      margin-left: 20px;
      color: #4da1ff;
      cursor: pointer;
    }
    .logo {
      line-height: 80px;
    }
    .item-name {
      margin-right: 150px;
      min-width: 60px;
    }
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
    .item-infor {
      span:last-child {
        margin-left: 20px;
        color: #4da1ff;
        cursor: pointer;
      }
    }
  }
  .el-dialog {
    width: 560px !important;
    .el-dialog__body {
      .el-form {
        .el-form-item {
          .el-form-item__content {
            .el-select {
              .el-input {
                width: 170px;
              }
            }
          }
        }
      }
    }
  }
  //裁剪框
  .box {
    display: flex;
    justify-content: space-between;
  }

  .cut-box {
    display: inline-block;
    width: 430px;
    height: 335px;
    h3 {
      font-size: 14px;
      line-height: 14px;
      margin: 3px 0 20px;
    }
  }

  .preview-box {
    display: inline-block;
    h3 {
      font-size: 14px;
      line-height: 14px;
      margin: 3px 0 20px;
    }
  }

  .cut-img {
    display: inline-block;
    border: 1px solid #e5e5e5;
    width: 300px;
    height: 300px;
    background: #fff;
    .cut-img-upload {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      .cut-img-default {
        line-height: 300px;
        color: #4da1ff;
        font-size: 14px;
      }
      .upload-file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }
  }
  .preview-img {
    position: relative;
    width: 430px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #999;
  }

  .preview-img-default {
    color: #ffffff;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .upload {
    width: 74px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #4da1ff;
    border-radius: 4px;
    position: absolute;
    left: 20px;
    bottom: 20px;
    overflow: hidden;
    .upload-btn-text {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #fff;
    }
  }
  .upload:hover {
    opacity: 0.9;
  }
  // .upload:active {
  //   opacity: 0.8;
  // }
  .input-img {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .dialog1 {
    .el-dialog__footer {
      margin-top: 11px;
    }
  }
}
</style>