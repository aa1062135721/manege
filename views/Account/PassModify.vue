<template>
  <div class="pass-modify">
    <Pane>
      <span slot="title">修改密码</span>
      <div slot="content">
        <!-- 修改密码表单 -->
        <el-form
          :model="passForm"
          :rules="rules"
          ref="passForm"
          style="width: 380px;"
          size="small"
          label-width="100px"
          status-icon
        >
          <el-form-item label="原密码" prop="oldPwd">
            <el-input v-model="passForm.oldPwd"></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="passForm.newPwd"></el-input>
          </el-form-item>

          <el-form-item label="确认新密码" prop="confirmPwd">
            <el-input v-model="passForm.confirmPwd"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="submitForm" size="small" type="primary">确认修改</el-button>
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
import { pwdReg } from "@/utils/reg";

// 引入ajax函数
import { validateOldPwd, editPwd } from "@/api/account";

// 引入本地存储工具函数
import local from "@/utils/local";

export default {
  components: {
    Pane
  },
  data() {
    // 自定义验证-旧密码
    const checkOldPwd = async (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入旧密码"));
      } else {
        let { code, msg } = await validateOldPwd({ oldPwd: value }); // 发送ajax请求 把旧密码发送给后端
        if (code === "11") {
          callback(new Error(msg));
        } else {
          callback();
        }
      }
    };

    // 自定义验证-新密码
    const checkNewPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (!pwdReg.test(value)) {
        callback(new Error("3到12位（字母，数字，下划线，减号）"));
      } else {
        if (this.passForm.confirmPwd) {
          // 反向一致性 【重写去触发一下确认密码字段的一致性验证】
          this.$refs.passForm.validateField("confirmPwd");
        }

        callback();
      }
    };

    // 自定义验证-确认新密码
    const checkConfirmPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (value !== this.passForm.newPwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };

    return {
      passForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      rules: {
        oldPwd: { required: true, validator: checkOldPwd, trigger: "blur" },
        newPwd: { required: true, validator: checkNewPwd, trigger: "blur" },

        confirmPwd: {
          required: true,
          validator: checkConfirmPwd,
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    // 修改密码
    submitForm() {
      this.$refs.passForm.validate(async valid => {
        if (valid) {
          let { code } = await editPwd({ newPwd: this.passForm.newPwd }); // 修改密码

          if (code === 0) {
            local.clear(); // 清除本地
            this.$router.push("/login"); // 跳转到登录
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>