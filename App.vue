<template>
  <div class="app">
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
// import { createRoutes } from "@/router";

export default {
  created() {
    // console.log("根组件");
  }
};
</script>

<style lang="less" scoped>
.app {
  height: 100%;
}
</style>
