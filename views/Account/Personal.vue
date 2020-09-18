<template>
  <div class="personal">
    <Pane>
      <span slot="title">个人中心</span>
      <div slot="content">
        <p>管理员ID: {{ info.id }}</p>
        <el-divider></el-divider>
        <p>账号: {{ info.account }}</p>
        <el-divider></el-divider>
        <p>用户组: {{ info.userGroup }}</p>
        <el-divider></el-divider>
        <p>创建时间: {{ info.ctime | filterCtime }}</p>
        <el-divider></el-divider>

        <!-- 头像 -->
        <div>
          <h1>管理员头像</h1>

          <!-- 头像上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="http://172.16.3.254:5000/users/avatar_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imgUrl" :src="baseImgAPI + imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <!-- 确认修改 -->
          <el-button @click="handleEditAvatar" type="primary" size="small">确认修改</el-button>
        </div>
      </div>
    </Pane>
  </div>
</template>

<script>
// 引入本地存储
import local from "@/utils/local";

// 引入面板
import Pane from "@/components/Pane/Pane.vue";

// 引入时间格式化模块moment
import moment from "moment";

// 引入ajax函数
import { saveAvatar } from "@/api/account";

export default {
  components: {
    Pane
  },
  data() {
    return {
      info: {},
      imgUrl: "",
      baseImgAPI: "http://172.16.3.254:5000/upload/imgs/acc_img/" // 图片服务器地址
    };
  },
  methods: {
    // 获取本地数据
    getLocalData() {
      this.info = local.get("info"); // 把数据从本地取出来 赋值给data中的info
    },

    // 图片上传成功触发的回调函数
    handleAvatarSuccess(res) {
      // res就是发送上传图片请求以后 后端响应回来的数据
      let { code, imgUrl, msg } = res;
      if (code === 0) {
        this.$message({ type: "success", message: msg }); // 弹出成功提示
        this.imgUrl = imgUrl; // 赋值
      }
    },

    // 保存修改头像
    async handleEditAvatar() {
      let { code } = await saveAvatar({ imgUrl: this.imgUrl }); // 发送修改头像的ajax

      // 判断
      if (code === 0) {
        // 通知头部更新头像
        this.$bus.$emit("updateAvatar");
      }
    },

    // 图片上传之前触发 可以在里面限制图片的大小 和  格式
    beforeAvatarUpload(file) {
      const isJPGAndPng =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGAndPng) {
        this.$message.error("上传头像图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGAndPng && isLt2M;
    }
  },
  created() {
    this.getLocalData(); // 调用获取本地数据的方法
  },

  filters: {
    // 过滤时间格式
    filterCtime(ctime) {
      return moment(ctime).format("YYYY-MM-DD HH:mm:ss");
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.avatar-uploader .el-upload {
  margin: 20px 0;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>