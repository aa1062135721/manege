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
      <div slot="content">
        <!-- 使用报表组件 -->
        <!-- <LineChart v-if="flag" :options="options" /> -->
        <LineChart :options="options" />
      </div>
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

// 引入报表组件
import LineChart from "@/components/Chart/LineChart.vue";

export default {
  components: {
    Pane,
    LineChart
  },
  data() {
    return {
      // 订单表单
      orderForm: {
        date: []
      },

      flag: false,

      // 配置
      options: {
        title: "订单统计",
        legend: ["订单金额"],
        xData: [],
        series: []
      }
    };
  },
  methods: {
    // 获取数据的函数
    async getData() {
      // 发送ajax 获取订单统计的数据
      let { data } = await getOrderData({
        date:
          this.orderForm.date === null
            ? JSON.stringify([])
            : JSON.stringify(this.orderForm.date)
      });

      // 算出x轴和y轴的数据
      let xData = data.map(v => moment(v.orderTime).format("YY-MM-DD HH:mm"));
      let yData = data.map(v => v.orderAmount);

      // 赋值传入报表组件渲染
      this.options.xData = xData;
      this.options.series = [
        {
          name: "订单金额",
          type: "line",
          data: yData
        }
      ];

      // console.log("拿到后端接口数据，赋值!");

      // this.flag = true; // 把报表显示出来 开始渲染
    },

    // 查询
    search() {
      this.getData();
    }
  },
  mounted() {
    this.getData(); // 调用接口 获取数据
  }
};
</script>

<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
}
</style>