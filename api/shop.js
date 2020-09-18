/**
 * 所有店铺相关的请求ajax函数
 */

import request from "@/utils/request";

// 获取店铺默认数据
export function getShopInfo() {
  return request.get("/shop/info");
}

// 店铺修改
export function editShopInfo(params) {
  return request.post("/shop/edit", params);
}
