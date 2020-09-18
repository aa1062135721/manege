<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 留了一个插槽 之后把标题插入 -->
      <slot name="title"></slot>
    </div>
    <div>
      <!-- 内容： 留一个插槽 之后把内容插入 -->
      <slot name="content"></slot>
    </div>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
</style>