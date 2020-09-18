<template>
  <div class="login">
    <!-- 登录表单 -->
    <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm" label-width="100px">
      <!-- 账号 -->
      <el-form-item label="账号" prop="account">
        <el-input
          prefix-icon="iconfont icon-zhanghao"
          type="text"
          v-model="loginForm.account"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input
          @click.native="changeType"
          @keydown.native.enter="submitForm"
          prefix-icon="iconfont icon-mima"
          :suffix-icon="isOpen ? 'iconfont icon-yanjing-zheng' : 'iconfont icon-yanjing_bi'"
          :type="isOpen ? 'text' : 'password'"
          v-model="loginForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入ajax函数
import { checkLogin } from "@/api/account";
// 引入本地存储
import local from "@/utils/local";

import { createRoutes } from "@/router";

export default {
  data() {
    return {
      // 登录表单
      loginForm: {
        account: "",
        password: ""
      },
      // 验证规则对象
      rules: {
        account: { required: true, message: "请输入账号", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" }
      },
      isOpen: false // 眼睛开和闭
    };
  },
  methods: {
    // 改变眼睛的状态
    changeType(e) {
      if (e.target.className.includes("icon-yanjing")) {
        this.isOpen = !this.isOpen;
      }
    },
    // 提交登录表单
    submitForm() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let { code, role, token } = await checkLogin(this.loginForm); // 发送登录请求
          // 判断
          if (code === 0) {
            local.set("t_k", token); // 把token存入本地
            local.set("role", role); // 把角色存入本地

            createRoutes(); // 登录成功 调用创建路由方法

            // 跳转到首页
            this.$router.push("/");
          }
        } else {
          console.log("前端验证不通过，不可以提交");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/imgs/bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  .el-form {
    width: 420px;
    .el-form-item {
      /deep/ .el-form-item__label {
        color: #000;
      }

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
