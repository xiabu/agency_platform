<!--
 * @Description: 上传图片
 * @Author: 李沛韬（929498346@qq.com）
 * @Date: 2019-09-17 16:51:03
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-11-12 17:18:29
 -->
<template>
  <div class="upload">
    <div class="file-list">
      <div class="file-item" v-if="images.length != 0">
        <div class="file-ite" v-for="(item,index) in images" :key="index">
          <img width="100px" height="100px" style="border-radius: 4px;" :src="cdnurl+item" alt="">
          <img class="closed" width="18px" height="18px" src="../assets/img/close1@2x.png" alt=""
            @click="deleteitem(index)">
        </div>
      </div>
      <div class="add" v-if="images.length < imgNum">
        <input accept="image/*" type="file" id="upfile" @change="upfile" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import QS from "qs"; // 引入qs模块，用来序列化post类型的数据
import { getUpyun, getAliyun } from "../api/agent.js";
export default {
  props: {
    // 图片数组
    imgs: {
      type: Array,
      default: function() {
        return [];
      }
    },
    imgNum: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      cdnurl: "http://agencytest.oss-cn-hangzhou.aliyuncs.com/", //图片cdn
      images: this.imgs //图片数组
    };
  },
  watch: {
    /**
     * @author: 李丽琼（1581868603@qq.com）
     * @description: 监听imgs
     * @param {type}
     * @return:
     * @Date: 2019-09-29 19:22:25
     */
    imgs: {
      immediate: true,
      handler(imgs) {
        this.images = imgs;
      }
    }
  },
  methods: {
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 删除图片
     * @param {type}
     * @return:
     * @Date: 2019-09-19 20:08:51
     */
    deleteitem(index) {
      this.images.splice(index, 1);
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 选择图片
     * @param {type}
     * @return:
     * @Date: 2019-09-19 20:09:50
     */
    upfile() {
      var file = document.getElementById("upfile").files[0];
      var that = this;
      if (file) {
        if (file.size / 1024 / 1024 > 2) {
          that.$message({
            message: "上传图片大小不能超过 2MB!",
            type: "error",
            duration: 2000
          });
          return false;
        }
        if (
          file.type != "image/png" &&
          file.type != "image/jpeg" &&
          file.type != "image/gif" &&
          file.type != "image/jpg"
        ) {
          that.$message({
            message: "请上传图片",
            type: "error",
            duration: 2000
          });
          return false;
        }
        getAliyun().then(res => {
          console.log(res, 5959);
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
          formData.append("file", file);
          axios.post(res.host, formData).then(res => {
            this.images.push(key);
            this.$emit("checkImg", this.images); //传出图片数组
            axios.defaults.headers = {
              userToken: JSON.parse(localStorage.getItem("token")).userToken
            };
          });
        });
        // var formData = new FormData();
        // formData.append("file", file);
      }
    },
    /**
     * @author: 李沛韬（929498346@qq.com）
     * @description: 图片命名
     * @param {type}
     * @return:
     * @Date: 2019-11-05 09:44:48
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
     * @description: 上传图片
     * @param {type}
     * @return:
     * @Date: 2019-09-19 20:09:27
     */
    submit(formData) {
      getUpyun().then(res => {
        formData.append("policy", res.data.policy);
        formData.append("authorization", res.data.authorization);
        axios.defaults.headers = {};
        axios.post(res.data.url, formData).then(res => {
          if (res.data.code == 200) {
            this.images.push(res.data.url);
            this.$emit("checkImg", this.images); //传出图片数组
            axios.defaults.headers = {
              userToken: JSON.parse(localStorage.getItem("token")).userToken
            };
          }
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.upload {
  .file-list {
    display: flex;
    .file-item {
      display: flex;
      height: 100px;
      .file-ite {
        position: relative;
        img {
          margin-right: 20px;
        }
        .closed {
          position: absolute;
          margin-right: 0px;
          top: 4px;
          right: 24px;
        }
      }
    }
    .add {
      line-height: 10px;
      width: 100px;
      height: 100px;
      background: url("../assets/img/upload.png") no-repeat 50% 50%;
      cursor: pointer;
      input {
        width: 100%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
      }
    }
  }
}
</style>