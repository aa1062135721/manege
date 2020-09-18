<template>
  <div class="account-add">
    <Pane>
      <span slot="title">添加账号</span>
      <div slot="content">
        <el-form
          :model="accAddForm"
          :rules="rules"
          status-icon
          ref="accAddForm"
          size="small"
          style="width: 315px;"
          label-width="100px"
        >
          <!-- 账号 -->
          <el-form-item label="账号" prop="account">
            <el-input v-model="accAddForm.account"></el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="accAddForm.password"></el-input>
          </el-form-item>

          <!-- 用户组 -->
          <el-form-item label="用户组" prop="userGroup">
            <el-select placeholder="请选择用户组" v-model="accAddForm.userGroup">
              <el-option label="普通管理员" value="普通管理员"></el-option>
              <el-option label="超级管理员" value="超级管理员"></el-option>
            </el-select>
          </el-form-item>

          <!-- 按钮 -->
          <el-form-item>
            <el-button @click="submitForm" size="small" type="primary">添加</el-button>
            <el-button @click="resetForm" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Pane>
  </div>
</template>

<script>
// 引入组件
import Pane from "@/components/Pane/Pane.vue";

// 引入正则
import { accReg, pwdReg } from "@/utils/reg";

// 引入ajax函数
import { addAcc } from "@/api/account";

export default {
  components: {
    Pane
  },
  data() {
    // 自定义验证账号
    const checkAcc = (rule, value, callback) => {
      /* 
        rule: 对象
        value: 用户输入的值
        callback: 回调函数
          如果验证通过：  callback()
          如果验证失败：  callback(new Error("错误提示信息"))
      */
      if (!value) {
        callback(new Error("请输入账号"));
      } else if (!accReg.test(value)) {
        callback(new Error("3到12位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };

    // 自定义验证密码
    const checkPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("3到12位（字母，数字，下划线，减号）"));
      } else {
        callback();
      }
    };

    return {
      // 和表单双向绑定的数据对象
      accAddForm: {
        account: "",
        password: "",
        userGroup: ""
      },
      // 验证规则
      rules: {
        // account: { required: true, message: "请输入账号", trigger: "blur" },

        // 内置验证
        // account: [
        //   { required: true, message: "请输入账号", trigger: "blur" },
        //   { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        // ],

        // 自定义验证
        account: {
          required: true,
          validator: checkAcc,
          trigger: "blur"
        },

        // password: { required: true, message: "请输入账号", trigger: "blur" },

        // 自定义验证
        password: {
          required: true,
          validator: checkPwd,
          trigger: "blur"
        },

        userGroup: { required: true, message: "请输入账号", trigger: "change" }
      }
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      // 触发整个表单的验证
      this.$refs.accAddForm.validate(async valid => {
        if (valid) {
          let { code } = await addAcc(this.accAddForm); // 发送添加账号请求

          // 判断
          if (code === 0) {
            this.$router.push("/account/account-list"); // 跳转到账号列表
          }
        } else {
          console.log("表单验证不通过 不可以提交哦~~~");
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.accAddForm.resetFields(); // 选中整个表单 调用重置方法
    }
  }
};
</script>

<style lang="less" scoped>
</style>