/**
 * 所有商品相关的请求ajax函数
 */

import request from "@/utils/request";

// 获取商品分类列表
export function getCateList(params) {
  return request.get("/goods/catelist", params);
}

// 添加分类
export function addCate(params) {
  return request.post("/goods/addcate", params);
}

// 修改分类
export function editCate(params) {
  return request.post("/goods/editcate", params);
}

// 删除分类
export function delCate(params) {
  return request.get("/goods/delcate", params);
}

// 查询所有分类名称
export function getCategories() {
  return request.get("/goods/categories");
}

// 添加商品
export function addGoods(params) {
  return request.post("/goods/add", params);
}

// 获取商品列表
export function getGoodsList(params) {
  return request.get("/goods/list", params);
}
