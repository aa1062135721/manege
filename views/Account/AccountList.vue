<template>
  <div>
    <Pane>
      <span slot="title">账号列表</span>
      <div slot="content">
        <!-- 表格 -->
        <el-table
          @selection-change="selectChange"
          :data="tableData"
          ref="tableData"
          style="width: 100%"
        >
          <!-- 单选框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- 账号 -->
          <el-table-column prop="account" label="账号" width="180"></el-table-column>
          <!-- 用户组 -->
          <el-table-column prop="userGroup" label="用户组" width="180"></el-table-column>
          <!-- 创建时间 -->
          <el-table-column prop="ctime" label="创建时间" width="180"></el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" size="mini" type="primary">编辑</el-button>
              <el-button @click="del(scope.row.id)" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          style="margin-top: 20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 3, 5, 10, 20, 30]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>

        <!-- 批量删除和取消选择 -->
        <div style="margin-top: 20px;">
          <el-button @click="batchDel" size="small" type="danger">批量删除</el-button>
          <el-button @click="cancelSelect" size="small" type="primary">取消选择</el-button>
        </div>

        <!-- 编辑模态框 -->
        <el-dialog title="编辑账号" :visible.sync="dialogVisible" width="380px">
          <!-- 编辑账号表单 -->
          <el-form :model="editForm" size="small" label-width="80px">
            <!-- 账号 -->
            <el-form-item label="账号">
              <el-input v-model="editForm.account" style="width: 215px;"></el-input>
            </el-form-item>
            <!-- 用户组 -->
            <el-form-item label="用户组">
              <el-select placeholder="请选择用户组" v-model="editForm.userGroup">
                <el-option label="普通管理员" value="普通管理员"></el-option>
                <el-option label="超级管理员" value="超级管理员"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </Pane>
  </div>
</template>

<script>
// 引入面板
import Pane from "@/components/Pane/Pane.vue";

// 引入ajax函数
import { getAccList, delAcc, batchDelete } from "@/api/account";

// 引入时间格式处理模块 moment
import moment from "moment";

export default {
  components: {
    Pane
  },
  data() {
    return {
      tableData: [],
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页条数
      total: 0, // 总条数
      dialogVisible: false, // 编辑模态框的显示和隐藏
      editForm: {
        account: "",
        userGroup: ""
      }
    };
  },
  methods: {
    // 获取数据
    async getData() {
      // 发送请求 获取账号列表数据
      let { total, data } = await getAccList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });

      // 解决删除完了 这一页没有数据的问题
      if (!data.length && this.currentPage !== 1) {
        this.currentPage--;
        this.getData();
      }

      // 处理时间格式
      data.forEach(v => {
        v.ctime = moment(v.ctime).format("YYYY-MM-DD HH:mm:ss");
      });

      // 赋值渲染
      this.total = total;
      this.tableData = data;
    },
    //pageSize【每页条数】 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    // currentPage【当前页】 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    // 取消选择
    cancelSelect() {
      this.$refs.tableData.clearSelection();
    },
    // 选项发生改变
    selectChange(rows) {
      this.ids = rows.map(v => v.id); // 把被选中的数据的id们拿出来
    },
    // 批量删除
    batchDel() {
      // 没有选择 不能发送请求
      if (!this.ids || !this.ids.length) {
        this.$message.error("请选择以后再操作哦，哥哥。");
        return;
      }

      // 优化体验
      this.$confirm("你确定批量删除吗，想清楚?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送批量删除ajax请求
          let { code } = await batchDelete({
            ids: JSON.stringify(this.ids)
          });

          // 判断
          if (code === 0) {
            this.getData(); // 刷新
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消批量删除"
          });
        });
    },
    // 删除
    del(id) {
      // 优化删除体验  避免过于仓促
      this.$confirm("你确定要删除吗，危险哦~~~?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        // 确定就走then
        .then(async () => {
          let { code } = await delAcc({ id }); // 发送删除请求
          // 判断
          if (code === 0) {
            this.getData(); // 刷新
          }
        })
        // 取消就走catch
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑
    edit(row) {
      this.dialogVisible = true; // 显示模态框
      this.editForm = { ...row }; // 回填表单数据
    }
  },
  created() {
    this.getData(); // 调用函数 获取账号列表数据
  }
};
</script>

<style lang="less" scoped>
</style>