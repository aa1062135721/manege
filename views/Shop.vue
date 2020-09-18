<template>
  <div>
    <Pane>
      <div slot="title" class="title">
        <span>店铺管理</span>
        <el-button @click="edit" size="small" type="primary">{{ isDiabled ? '修改': '完成' }}</el-button>
      </div>
      <div slot="content">
        <el-form
          :model="shopForm"
          :disabled="isDiabled"
          style="width: 460px;"
          size="small"
          label-width="100px"
        >
          <!-- 店铺名称 -->
          <el-form-item label="店铺名称">
            <el-input v-model="shopForm.name"></el-input>
          </el-form-item>
          <!-- 店铺公告 -->
          <el-form-item label="店铺公告">
            <el-input rows="7" v-model="shopForm.bulletin" type="textarea"></el-input>
          </el-form-item>

          <!-- 店铺头像 -->
          <el-form-item label="店铺头像">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:5000/shop/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="shopForm.avatar" :src="baseImgApi + shopForm.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 店铺图片 -->
          <el-form-item label="店铺图片">
            <el-upload
              action="http://127.0.0.1:5000/shop/upload"
              list-type="picture-card"
              :file-list="fileList"
              :on-success="handleImgSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>

            <!-- 预览的模态框 -->
            <el-dialog :visible.sync="dialogVisible">
              <!-- 预览的图片 -->
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
          <!-- 配送费 -->
          <el-form-item label="配送费">
            <el-input v-model="shopForm.deliveryPrice"></el-input>
          </el-form-item>
          <!-- 配送时间 -->
          <el-form-item label="配送时间">
            <el-input v-model="shopForm.deliveryTime"></el-input>
          </el-form-item>
          <!-- 配送描述 -->
          <el-form-item label="配送描述">
            <el-input v-model="shopForm.description"></el-input>
          </el-form-item>
          <!-- 店铺评分 -->
          <el-form-item label="店铺评分">
            <el-input v-model="shopForm.score"></el-input>
          </el-form-item>
          <!-- 销量 -->
          <el-form-item label="销量">
            <el-input v-model="shopForm.sellCount"></el-input>
          </el-form-item>
          <!-- 活动 -->
          <el-form-item label="活动">
            <el-checkbox-group v-model="shopForm.supports">
              <el-checkbox label="在线支付满28减5" name="type"></el-checkbox>
              <el-checkbox label="VC无限橙果汁全场8折" name="type"></el-checkbox>
              <el-checkbox label="单人精彩套餐" name="type"></el-checkbox>
              <el-checkbox label="特价饮品8折抢购" name="type"></el-checkbox>
              <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 营业时间 -->
          <el-form-item label="营业时间">
            <el-time-picker
              v-model="shopForm.date"
              value-format="yyyy-MM-dd HH:mm:ss"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
        </el-form>
      </div>
    </Pane>
  </div>
</template>

<script>
import Pane from "@/components/Pane/Pane.vue";

// 引入ajax函数
import { getShopInfo, editShopInfo } from "@/api/shop";

export default {
  components: {
    Pane
  },
  data() {
    return {
      shopForm: {
        avatar: "", // 店铺头像
        name: "",
        bulletin: "",
        deliveryPrice: "",
        deliveryTime: "",
        description: "",
        score: "",
        sellCount: "",
        supports: [],
        date: []
      },
      baseImgApi: "http://127.0.0.1:5000/upload/shop/", // 图片所有服务器文件夹路径
      // 图片列表
      fileList: [
        // {
        //   url: ""
        // },
        // {
        //   url: ""
        // }
      ],
      dialogVisible: false, // 预览模态框
      dialogImageUrl: "",
      isDiabled: true
    };
  },
  methods: {
    async getData() {
      let { data } = await getShopInfo();

      // 回填店铺图片列表
      data.pics.forEach(v => {
        this.fileList.push({
          url: this.baseImgApi + v
        });
      });

      this.shopForm = data; // 赋值渲染
    },
    // 店铺头像上传成功
    handleAvatarSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.$message({ type: "success", message: msg });
        this.shopForm.avatar = imgUrl;
      }
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url; // 预览图片路径
      this.dialogVisible = true; // 显示模态框
    },
    // 店铺图片删除
    handleRemove(file) {
      // 要把图片从数组中删除
      this.fileList.forEach((v, i) => {
        if (file.url === v.url) {
          this.fileList.splice(i, 1);
        }
      });
    },

    // 店铺图片上传成功
    handleImgSuccess(res) {
      // 要把图片加入数组
      this.fileList.push({
        url: this.baseImgApi + res.imgUrl
      });
    },

    // 修改
    async edit() {
      this.isDiabled = !this.isDiabled; // 改变禁用状态

      if (this.isDiabled) {
        this.shopForm.pics = this.fileList.map(v =>
          v.url.substr(this.baseImgApi.length)
        );

        // 发送修改请求
        await editShopInfo({
          id: this.shopForm.id,
          name: this.shopForm.name,
          bulletin: this.shopForm.bulletin,
          avatar: this.shopForm.avatar,
          deliveryPrice: this.shopForm.deliveryPrice,
          deliveryTime: this.shopForm.deliveryTime,
          description: this.shopForm.description,
          score: this.shopForm.score,
          sellCount: this.shopForm.sellCount,

          // 处理参数是数组的情况
          supports: JSON.stringify(this.shopForm.supports),
          date: JSON.stringify(this.shopForm.date),
          pics: JSON.stringify(this.shopForm.pics)
        });
      }
    }
  },
  created() {
    this.getData();
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
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>