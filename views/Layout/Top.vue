<template>
  <div class="top">
    <el-row>
      <el-col :span="12">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in breadArr"
            :key="item.title"
            :to="{ path: item.path }"
          >{{ item.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col class="right-box" :span="12">
        <!-- 下拉菜单 -->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            欢迎你，{{ account }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 头像 -->
        <el-avatar :size="size" :src="imgUrl"></el-avatar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入本地存储
import local from "@/utils/local";

// 引入ajax函数
import { getInfo } from "@/api/account";

export default {
  data() {
    return {
      account: "",
      imgUrl: "",
      size: "large",
      breadArr: [] // 面包屑数组
    };
  },
  methods: {
    // 点击下拉选项出发
    handleCommand(cmd) {
      if (cmd === "personal") {
        this.$router.push("/account/personal"); // 跳转到个人中心
      } else if (cmd === "logout") {
        local.clear(); // 清除本地数据

        // 弹出提示
        this.$message({
          type: "success",
          message: "退出系统成功，欢迎回来，哥哥"
        });

        this.$router.push("/login"); // 跳转到登录页面

        // 刷新一下【才会把原来的路由对象销毁】
        location.reload();
      }
    },
    // 计算面包屑函数
    calcBread() {
      let arr = [{ path: "/", title: "首页" }];

      this.$route.matched.forEach(item => {
        if (item.meta.title) {
          arr.push({ path: item.path, title: item.meta.title });
        }
      });

      this.breadArr = arr;
    },
    // 获取用户数据
    async getData() {
      let res = await getInfo(); // 发送请求 获取用户信息

      // 赋值渲染
      this.account = res.account;
      this.imgUrl = res.imgUrl;

      // 把用户信息存入本地
      local.set("info", res);
    }
  },

  // 生命周期
  created() {
    // 调用计算面包屑函数
    this.calcBread();

    this.getData(); // 调用获取用户信息的函数

    // 监听个人中心修改头像传递过来的数据
    this.$bus.$on("updateAvatar", () => {
      this.getData(); // 调用获取用户信息的函数
    });
  },

  // 侦听器
  watch: {
    "$route.path"(newVal, oldVal) {
      // 调用计算面包屑函数
      this.calcBread();
    }
  }
};
</script>

<style lang="less" scoped>
.top {
  flex: 0 0 60px;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  .el-row {
    height: 60px;
    .el-col {
      height: 60px;
      display: flex;
      align-items: center;
    }
    .el-col.right-box {
      justify-content: flex-end;
      .el-avatar {
        margin-left: 10px;
      }
    }
  }
}
</style>