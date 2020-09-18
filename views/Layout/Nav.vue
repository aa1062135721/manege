<template>
  <div class="nav">
    <div class="logo">
      <img width="50" height="50" src="../../assets/imgs/logo.png" alt />
      <h1>商家后台</h1>
    </div>

    <!-- 导航 -->
    <el-menu
      background-color="#2d3a4b"
      text-color="#fff"
      unique-opened
      router
      :default-active="curActive"
    >
      <template v-for="item in menus">
        <!-- 没有儿子的 -->
        <el-menu-item
          v-if="item.children && item.children.length === 1"
          :index="item.children && item.children[0].path"
          :key="item.path"
        >
          <i
            class="iconfont"
            :class="item.meta && item.meta.icon ? item.meta.icon : item.children[0].meta.icon"
          ></i>
          <span
            slot="title"
          >{{ item.meta && item.meta.title ? item.meta.title : item.children[0].meta.title }}</span>
        </el-menu-item>

        <!-- 有儿子的 -->
        <el-submenu v-else :index="item.path" :key="item.path">
          <template slot="title">
            <i class="iconfont" :class="item.meta.icon"></i>
            <span>{{ item.meta.title }}</span>
          </template>

          <el-menu-item
            v-for="v in item.children"
            :key="v.path"
            :index="item.path + '/' + v.path"
          >{{ v.meta.title }}</el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import local from "@/utils/local";

export default {
  data() {
    return {
      menus: []
    };
  },
  created() {
    this.menus = local.get("menus"); // 从本地取出菜单
  },
  computed: {
    curActive() {
      if (this.$route.path === "/order/order-edit") return "/order/order-list";
      return this.$route.path;
    }
  }
};
</script>

<style lang="less" scoped>
.nav {
  flex: 0 0 200px;
  background-color: #2d3a4b;
  .logo {
    height: 60px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-menu {
    border-right: 0px;

    .el-submenu {
      .iconfont {
        color: #ffffff;
        margin-right: 10px;
      }
      /deep/.el-menu {
        .el-menu-item {
          background-color: #202f3f !important;
        }
      }
    }

    .el-menu-item {
      .iconfont {
        color: #ffffff;
        margin-right: 10px;
      }
    }
  }
}
</style>