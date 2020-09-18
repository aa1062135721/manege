<template>
  <div>订单编辑</div>
</template>

<script>
// 引入本地存储
import local from "@/utils/local";

// 引入ajax函数
import { getOrderDetail } from "@/api/order";

export default {
  async created() {
    // 1. 把数据取出来 【本地存储方式】
    let row = local.get("ordeDetail");
    console.log("取出来的：", row);

    // 2. 获取query方式传递过来的参数
    // let id = this.$route.query.id;
    // let res = await getOrderDetail({ id });
    // console.log(res);

    // 3. 获取params传递过来的数据 【不能刷新 】
    // let row = this.$route.params.row;
    // console.log(row);
  }
};
</script>

<style lang="less" scoped>
</style>