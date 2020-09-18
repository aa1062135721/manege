<template>
  <div class="layout">
    <!-- 左侧导航 -->
    <Nav />

    <!-- 右侧 -->
    <RightMain />
  </div>
</template>

<script>
// 引入组件
import Nav from "@/views/Layout/Nav.vue";
import RightMain from "@/views/Layout/RightMain.vue";

export default {
  components: {
    Nav,
    RightMain
  }
};
</script>

<style lang="less" scoped>
.layout {
  height: 100%;
  display: flex;
}
</style>
