<template>
  <div>
    <h1 class="title">404</h1>

    <button @click="back">返回上一页</button>
  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  color: green;
  font-size: 200px;
}
</style>