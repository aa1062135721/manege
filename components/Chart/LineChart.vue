<template>
  <div id="box" style="height: 400px;"></div>
</template>

<script>
// 引入 echarts
import echarts from "echarts";

export default {
  // 接收外部数据
  props: {
    options: {
      type: Object, // 类型检测
      required: true // 是否必填
    }
  },
  methods: {
    // 渲染报表的方法
    drawLine() {
      // 初始化dom
      this.myChart = echarts.init(document.getElementById("box"));

      // 写配置
      var option = {
        // 标题
        title: {
          text: this.options.title // 1动态的 从外部传入
        },
        // 提示
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        // 图例
        legend: {
          data: this.options.legend // 2动态的 从外部传入
        },
        // 网格
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        // 工具盒子
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // x轴
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.options.xData // 3 动态的 从外部传入
        },
        // y轴
        yAxis: {
          type: "value"
        },

        // 核心配置  // 动态的 从外部传入
        series: this.options.series
      };

      // 使用配置创建报表
      this.myChart.setOption(option);
    }
  },
  mounted() {
    this.drawLine();
  },

  // 侦听器
  watch: {
    // 对外部传入的数据 options对象 进行深度监听
    options: {
      handler(newVal, oldVal) {
        console.log("数据变化了, 使用变化后的新数据，重新渲染报表:", newVal);

        // 重新去渲染报表
        this.myChart.setOption({
          title: {
            text: newVal.title // 1动态的 从外部传入
          },
          // 图例
          legend: {
            data: newVal.legend // 2动态的 从外部传入
          },
          // x轴
          xAxis: {
            data: newVal.xData // 3 动态的 从外部传入
          },
          series: newVal.series
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>