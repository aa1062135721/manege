/**
 * 通用的请求封装
 * created by 小貂蝉
 */

import axios from "axios";
import qs from "qs";
import local from "@/utils/local";

// 引入路由
import router from "@/router";

// 引入提示框
import { Message } from "element-ui";

axios.defaults.baseURL = "http://172.16.3.254:5000"; // 服务器请求地址
axios.defaults.timeout = 5000; // 请求超时

// 请求拦截器
axios.interceptors.request.use((config) => {
  let tk = local.get("t_k"); // 从本地取出token

  if (tk) {
    config.headers.Authorization = tk; // 把token令牌挂在请求头的 Authorization 字段上 发送给后端
  }

  return config;
});

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 判断 如果后端响应的数据包含 code 和 msg 两个字段
    if (response.data.code !== undefined && response.data.msg !== undefined) {
      let { code, msg } = response.data;

      if (code === 0) {
        Message({ type: "success", message: msg });
      } else if (code === 1) {
        Message.error(msg);
      }
    }
    return response;
  },
  (err) => {
    if (
      err.response.data.code !== undefined &&
      err.response.data.msg !== undefined
    ) {
      if (err.response.data.code === 401) {
        // Message.error(err.response.data.msg); // 错误提示
        // 跳转到登录
        router.push("/login");
      }
    }

    return Promise.reject(err);
  }
);

// 封装通用的get请求和post请求
export default {
  get(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: data,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  post(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, qs.stringify(data))
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
