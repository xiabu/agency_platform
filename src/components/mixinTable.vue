<!--
 * @Description: 提取公用内容
 * @Author: 赵亮
 * @Date: 2019-09-11 11:06:12
 * @LastEditTime: 2019-10-10 10:25:32
 * @LastEditors: 赵亮（cxpzl.mq@gmail.com）
 -->
<script>
import Table from "./table";
import Search from "./search";
import axios from "axios"; // 引入axios
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
export default {
  components: { Table, Search }, // table列表与搜索组件
  data() {
    return {
      searchData: {}, // 搜索按钮数据
      tableData: [], // 表格数据
      pageParams: {
        pageNum: 1, // 当前页码
        total: 0, // 数据总条数
        pageSize: 10 // 每页显示多少条
      },
      checkArr: [] // 勾选的内容
    };
  },
  created() {
    // 获取table数据信息
    this.getDataList();
  },
  methods: {
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 批量导出数据
     * @param { Blob } data [二进制流]
     * @param { String } fileName [文件名]
     * @Date: 2019-10-08 12:02:23
     */
    download(data, fileName) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    },
    /**
     * @author: 赵亮（cxpzl.mq@gmail.com）
     * @description: 批量导出按钮
     * @Date: 2019-10-08 12:02:23
     */
    exportExcel() {
      let tableAllData = this.$store.state.tableData.tableSaveData;
      let userToken = JSON.parse(localStorage.getItem("token")).userToken;
      axios.defaults.headers = {
        // 请求头设置userToken
        userToken: userToken
      };
      axios({
        method: "post",
        url: this.exportPartUrl,
        responseType: "blob",
        data: this.checkArr
      }).then(res => {
        if (res.data.code === 40002) {
          this.$message.error(res.data.msg);
        } else {
          let contentDisposition = res.headers["content-disposition"];
          let fileName = window.decodeURI(
            res.headers["content-disposition"].split("=")[1]
          );
          this.download(res.data, fileName);
        }
      });
    }
  }
};
</script>