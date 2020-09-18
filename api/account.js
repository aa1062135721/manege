/**
 * 所有账号相关的请求ajax函数
 */

import request from "@/utils/request";

// 登录请求
export function checkLogin(params) {
  return request.post("/users/checkLogin", params);
}

// 添加账号
export function addAcc(params) {
  return request.post("/users/add", params);
}

// 获取账号列表
export function getAccList(params) {
  return request.get("/users/list", params);
}

// 删除账号
export function delAcc(params) {
  return request.get("/users/del", params);
}

// 批量删除
export function batchDelete(params) {
  return request.get("/users/batchdel", params);
}

// 验证旧密码
export function validateOldPwd(params) {
  return request.get("/users/checkoldpwd", params);
}

// 修改密码
export function editPwd(params) {
  return request.post("/users/editpwd", params);
}

// 获取头部个人信息
export function getInfo() {
  return request.get("/users/info");
}

// 修改用户头像
export function saveAvatar(params) {
  return request.get("/users/avataredit", params);
}
