<template>
  <div>
    <Pane>
      <span slot="title">订单列表</span>
      <div slot="content">
        <!-- 查询表单 -->
        <el-form :model="searchForm" inline size="small" label-width="80px">
          <!-- 订单号 -->
          <el-form-item label="订单号">
            <el-input v-model="searchForm.orderNo"></el-input>
          </el-form-item>
          <!-- 收货人 -->
          <el-form-item label="收货人">
            <el-input v-model="searchForm.consignee"></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone"></el-input>
          </el-form-item>
          <!--  订单状态 -->
          <el-form-item label="订单状态">
            <el-select v-model="searchForm.orderState">
              <el-option value="派送中">派送中</el-option>
              <el-option value="已受理">已受理</el-option>
              <el-option value="已完成">已完成</el-option>
            </el-select>
          </el-form-item>
          <!--  选择时间 -->
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="searchForm.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" size="small" type="primary">查询</el-button>
            <el-button @click="reset" size="small" type="success">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格 -->
        <el-table
          style="margin-top: 20px; margin-bottom: 20px; width: 1200px;"
          border
          :data="tableData"
        >
          <el-table-column fixed label="订单号" width="160" prop="orderNo"></el-table-column>
          <el-table-column label="下单时间" width="160" prop="orderTime"></el-table-column>
          <el-table-column label="手机号" width="160" prop="phone"></el-table-column>
          <el-table-column label="收货人" width="160" prop="consignee"></el-table-column>
          <el-table-column label="配送地址" width="160" prop="deliverAddress"></el-table-column>
          <el-table-column label="送达时间" width="160" prop="deliveryTime"></el-table-column>
          <el-table-column label="用户备注" width="160" prop="remarks"></el-table-column>
          <el-table-column label="订单金额" width="160" prop="orderAmount"></el-table-column>
          <el-table-column label="订单状态" width="160" prop="orderState"></el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" size="mini" type="primary">编辑</el-button>
              <el-button size="mini" type="success">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px;"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10, 20, 30]"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </Pane>
  </div>
</template>

<script>
// 引入面板
import Pane from "@/components/Pane/Pane.vue";

// 引入ajax函数
import { getOrderList } from "@/api/order";

// 引入时间格式化
import moment from "moment";

// 引入本地存储
import local from "@/utils/local";

export default {
  components: {
    Pane
  },
  data() {
    return {
      currentPage: 1,
      total: 28,
      pageSize: 5,

      // 查询表单
      searchForm: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      },

      // 表格
      tableData: []
    };
  },
  methods: {
    // 获取数据
    async getData() {
      let { total, data } = await getOrderList({
        // 分页参数
        currentPage: this.currentPage,
        pageSize: this.pageSize,

        // 查询参数
        orderNo: this.searchForm.orderNo,
        consignee: this.searchForm.consignee,
        phone: this.searchForm.phone,
        orderState: this.searchForm.orderState,
        date:
          this.searchForm.date == null
            ? JSON.stringify([])
            : JSON.stringify(this.searchForm.date)
      });

      // 处理时间
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD HH:mm:ss");
        v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD HH:mm:ss");
      });

      // 赋值渲染
      this.total = total;
      this.tableData = data;
    },

    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },

    // 查询
    search() {
      this.currentPage = 1;
      this.getData();
    },

    // 重置
    reset() {
      // 清空表单
      this.searchForm = {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      };
      this.search(); // 查询
    },

    // 编辑
    edit(row) {
      // 1. 把当前行数据存入本地 【本地存储方式】
      local.set("ordeDetail", row);
      this.$router.push("/order/order-edit"); // 跳转到编辑页面

      // 2. 路由query传递参数 【query方式通过地址来传递】
      // this.$router.push({
      //   path: "/order/order-edit",
      //   query: {
      //     id: row.id
      //   }
      // });
      // 3. 路由params传递参数
      // this.$router.push({
      //   name: "orderEdit", // 通过路由名字跳转
      //   params: {
      //     row
      //   }
      // });
    }
  },
  created() {
    this.getData(); // 调用获取数据的函数 【这个函数以及带了查询参数】
  }
};
</script>

<style lang="less" scoped>
</style>