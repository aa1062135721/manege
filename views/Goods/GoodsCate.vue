<template>
  <div class="goods-cate">
    <Pane>
      <div slot="title" class="title">
        <span>商品分类</span>
        <el-button @click="handleAddCate" type="primary" size="small">添加分类</el-button>
      </div>

      <div slot="content">
        <!-- 分类表格 -->
        <el-table :data="tableData">
          <el-table-column width="120" label="序号" type="index"></el-table-column>
          <el-table-column label="分类名称">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.cateName }}</span>
              <el-input v-else size="small" v-model="scope.row.cateName"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="是否启用">
            <template slot-scope="scope">
              <el-switch
                :disabled="scope.row.isEdit ? false: true"
                v-model="scope.row.state"
                active-color="#13ce66"
              ></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="edit(scope.row)"
                :type="scope.row.isEdit ? 'success' : 'primary'"
                size="small"
              >{{ scope.row.isEdit ? '完成': '编辑' }}</el-button>
              <el-button @click="del(scope.row.id)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px;"
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>

        <!-- 添加分类模态框 -->
        <el-dialog title="添加分类" :visible.sync="dialogVisible" width="400px">
          <el-form :model="addCateForm" size="small" label-width="80px">
            <el-form-item label="分类名称">
              <el-input v-model="addCateForm.cateName"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
              <el-switch v-model="addCateForm.state" active-color="#13ce66"></el-switch>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveCate">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";

// 引入ajax函数
import { getCateList, addCate, editCate, delCate } from "@/api/goods";

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

      dialogVisible: false, // 模态框是否显示

      // 添加分类
      addCateForm: {
        cateName: "",
        state: true
      }
    };
  },
  methods: {
    // 当前页码改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },

    // 获取数据
    async getData() {
      // 发送请求 获取分页数据
      let { total, data } = await getCateList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      // 处理state
      data.forEach(v => {
        v.state = v.state == 1 ? true : false; // 把启用和禁用 从1-》true  0-》false
        v.isEdit = false; // 每一行 都添加一个是否可以编辑的状态 默认是false  不可编辑
      });

      // 赋值渲染
      this.total = total;
      this.tableData = data;
    },

    // 添加分类
    handleAddCate() {
      this.dialogVisible = true; // 显示模态框
    },

    // 确定保存分类
    async saveCate() {
      // 发送添加分类ajax请求
      let { code } = await addCate(this.addCateForm);
      if (code === 0) {
        this.dialogVisible = false; // 隐藏模态框
      }
    },

    // 编辑分类
    async edit(row) {
      row.isEdit = !row.isEdit;

      // 判断 如果点击的是完成
      if (!row.isEdit) {
        // 发送ajax 保存修改
        let { code } = await editCate({
          id: row.id,
          cateName: row.cateName,
          state: row.state
        });

        if (code === 0) {
          this.getData(); // 刷新
        }
      }
    },

    // 删除分类
    async del(id) {
      let { code } = await delCate({ id });

      if (code === 0) {
        this.getData();
      }
    }
  },
  created() {
    this.getData(); // 调用获取分类的接口
  }
};
</script>

<style lang="less" scoped>
.goods-cate {
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>