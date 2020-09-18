<template>
  <div>
    <Pane>
      <div slot="title">
        <el-form :model="orderForm" :inline="true" size="small">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="orderForm.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" size="small" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="content"></div>
    </Pane>
  </div>
</template>

<script>
import moment from "moment";

import Pane from "@/components/Pane/Pane.vue";

// 引入 echarts
import echarts from "echarts";

// 引入ajax函数
import { getOrderData } from "@/api/order";

export default {
  components: {
    Pane
  },
  data() {
    return {
      // 订单表单
      orderForm: {
        date: []
      }
    };
  },
  methods: {
    async getData() {
      let { data } = await getOrderData({
        date:
          this.orderForm.date === null
            ? JSON.stringify([])
            : JSON.stringify(this.orderForm.date)
      });

      let xData = data.map(v => moment(v.orderTime).format("YY/MM/DD HH:ss"));
      let yData = data.map(v => v.orderAmount);

      // 调用绘图方法
      this.drawLine(xData, yData);
    },

    // 渲染报表的方法
    drawLine(xData, yData) {
      // 初始化dom
      let myChart = echarts.init(document.getElementById("box"));

      // 写配置
      var option = {
        // 标题
        title: {
          text: "订单统计"
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
          data: ["订单金额"]
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
          data: xData
        },
        // y轴
        yAxis: {
          type: "value"
        },

        // 核心配置
        series: [
          {
            name: "订单金额",
            type: "line",
            data: yData
          }
        ]
      };

      // 使用配置创建报表
      myChart.setOption(option);
    },

    // 查询
    search() {
      this.getData();
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
}
</style>