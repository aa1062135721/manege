<template>
  <div class="right-main">
    <!-- 头部 -->
    <Top />

    <!-- 内容: 路由出口预留的位置 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Top from "./Top.vue";

export default {
  components: {
    Top
  }
};
</script>

<style lang="less" scoped>
.right-main {
  flex: 1;
  background-color: #f3f5f7;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
    // 如果内容非常多 y轴方向滚动即可
    overflow-y: scroll;
  }
}
</style>