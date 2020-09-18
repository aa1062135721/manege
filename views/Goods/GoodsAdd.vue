<template>
  <div class="goods-add">
    <Pane>
      <span slot="title">商品添加</span>
      <div slot="content">
        <!-- 添加商品表格 -->
        <el-form :model="goodsAddForm" style="width: 320px;" size="small" label-width="100px">
          <!-- 商品名称 -->
          <el-form-item label="商品名称">
            <el-input v-model="goodsAddForm.name"></el-input>
          </el-form-item>

          <!-- 商品分类 -->
          <el-form-item label="商品分类">
            <el-select v-model="goodsAddForm.category">
              <el-option
                v-for="item in categories"
                :key="item.cateName"
                :value="item.cateName"
              >{{item.cateName}}</el-option>
            </el-select>
          </el-form-item>

          <!-- 商品价格 -->
          <el-form-item label="商品价格">
            <el-input-number v-model="goodsAddForm.price" :min="1" :max="10000"></el-input-number>
          </el-form-item>

          <!-- 商品图片 -->
          <el-form-item label="商品图片">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/goods/goods_img_upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imgUrl" :src="baseImgApi + imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 商品描述 -->
          <el-form-item label="商品描述">
            <el-input v-model="goodsAddForm.goodsDesc" type="textarea"></el-input>
          </el-form-item>

          <!-- 添加商品按钮 -->
          <el-form-item>
            <el-button @click="handleAddGoods" type="primary" size="small">添加商品</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";

// 引入ajax函数
import { getCategories, addGoods } from "@/api/goods";

export default {
  components: {
    Pane
  },
  data() {
    return {
      imgUrl: "", // 商品图片
      baseImgApi: "http://127.0.0.1:5000/upload/imgs/goods_img/",
      // 商品添加表格
      goodsAddForm: {
        name: "",
        category: "",
        price: 0,
        goodsDesc: ""
      },
      categories: [] // 分类名称
    };
  },
  methods: {
    // 成功的回调
    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.imgUrl = imgUrl; // 回填图片
        this.$message({ type: "success", message: msg });
      }
    },
    // 上传之前的限制
    beforeAvatarUpload() {},

    // 添加商品
    async handleAddGoods() {
      this.goodsAddForm.imgUrl = this.imgUrl; // 地址
      let { code, msg } = await addGoods(this.goodsAddForm); // 发送添加商品请求
      if (code === 0) {
        this.$message({ type: "success", message: msg });
        this.$router.push("/goods/goods-list");
      }
    }
  },
  async created() {
    let { categories } = await getCategories(); // 获取所有启用的分类名称
    this.categories = categories; // 赋值渲染
  }
};
</script>

<style lang="less" scoped>
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>