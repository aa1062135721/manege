<template>
  <div>
    <Pane>
      <span slot="title">商品列表</span>
      <div slot="content">
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%">
          <!-- 第一列：可以展开和收缩 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <!-- 表格 -->
              <el-form label-position="left" inline class="demo-table-expand">
                <!-- 商品ID -->
                <el-form-item label="商品ID">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <!-- 商品名称 -->
                <el-form-item label="商品名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <!-- 所属分类 -->
                <el-form-item label="所属分类">
                  <span>{{ props.row.category }}</span>
                </el-form-item>
                <!-- 商品价格 -->
                <el-form-item label="商品价格">
                  <span>{{ props.row.price }}</span>
                </el-form-item>

                <!-- 创建时间 -->
                <el-form-item label="创建时间">
                  <span>{{ props.row.ctime }}</span>
                </el-form-item>
                <!-- 商品评价 -->
                <el-form-item label="商品评价">
                  <span>{{ props.row.rating }}</span>
                </el-form-item>
                <!-- 商品销量 -->
                <el-form-item label="商品销量">
                  <span>{{ props.row.sellCount }}</span>
                </el-form-item>
                <!-- 商品描述 -->
                <el-form-item label="商品描述">
                  <span>{{ props.row.goodsDesc }}</span>
                </el-form-item>
                <!-- 商品图片 -->
                <el-form-item label="商品图片">
                  <img
                    style="border-radius: 4px;"
                    width="120"
                    height="120"
                    :src="baseImgApi + props.row.imgUrl"
                  />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!-- 商品名称 -->
          <el-table-column label="商品名称" width="180">
            <template slot-scope="scope">
              <span class="goods-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <!-- 所属分类 -->
          <el-table-column label="所属分类" prop="category" width="160"></el-table-column>
          <!-- 商品价格 -->
          <el-table-column label="商品价格" prop="price" width="160"></el-table-column>
          <!-- 商品图片 -->
          <el-table-column label="商品图片" width="160">
            <template slot-scope="scope">
              <img
                style="border-radius: 4px;"
                width="50"
                height="50"
                :src="baseImgApi + scope.row.imgUrl"
              />
            </template>
          </el-table-column>
          <!-- 商品描述 -->
          <el-table-column label="商品描述" width="250">
            <template slot-scope="scope">
              <span class="goods-desc">{{ scope.row.goodsDesc }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="primary" size="small">编辑</el-button>
              <el-button @click="del(scope.row.id)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";

// 引入ajax函数
import { getGoodsList } from "@/api/goods";

export default {
  components: {
    Pane
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 28,

      baseImgApi: "http://127.0.0.1:5000/upload/imgs/goods_img/"
    };
  },
  methods: {
    // 编辑
    edit(row) {
      console.log("编辑：", row);
    },
    // 删除
    del(id) {
      console.log("删除:", id);
    },

    // 获取数据
    async getData() {
      let { total, data } = await getGoodsList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      // 赋值渲染
      this.total = total;
      this.tableData = data;
    },

    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  },

  created() {
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
/deep/ .goods-desc,
/deep/ .goods-name {
  white-space: nowrap;
  overflow: hidden;
}
</style>