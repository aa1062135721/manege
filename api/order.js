/**
 * 所有订单相关的请求ajax函数
 */

import request from "@/utils/request";

// 获取订单列表
export function getOrderList(params) {
  return request.get("/order/list", params);
}

// 获取订单详情
export function getOrderDetail(params) {
  return request.get("/order/detail", params);
}

// 获取订单统计数据
export function getOrderData(params) {
  return request.get("/order/ordertotal", params);
}
