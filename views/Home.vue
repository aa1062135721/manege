<template>
  <div class="home">
    <h1>后台首页内容</h1>

    <!-- 使用报表组件 -->
    <LineChart :options="options" />
  </div>
</template>

<script>
import LineChart from "@/components/Chart/LineChart.vue";

export default {
  components: {
    LineChart
  },
  data() {
    return {
      options: {
        title: "数据统计",
        lengend: ["数据统计", "订单统计", "代码统计"],
        xData: [1, 2, 3, 4, 5, 6, 7],
        series: [
          {
            name: "数据统计",
            type: "line",
            data: [100, 200, 500, 300, 100, 150, 189]
          },
          {
            name: "订单统计",
            type: "line",
            data: [700, 200, 600, 300, 200, 150, 589]
          },
          {
            name: "代码统计",
            type: "line",
            data: [200, 200, 500, 350, 200, 150, 189]
          }
        ]
      }
    };
  }
};
</script>

<style lang="less" scoped>
</style>