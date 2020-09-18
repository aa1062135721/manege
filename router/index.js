import Vue from "vue";
import VueRouter from "vue-router";
import local from "@/utils/local";

// 解决重复跳转的警告问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

// 引入组件
import Login from "@/views/Login.vue";
import Layout from "@/views/Layout/Layout.vue";

// 动态路由
const asyncRoutes = [
  // 登录
  {
    path: "/login",
    component: Login,
    visible: false,
  },
  // 后台首页
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    visible: true,
    children: [
      {
        meta: { title: "后台首页", icon: "icon-faxian-copy" },
        path: "/home",
        component: () => import("@/views/Home.vue"),
      },
    ],
  },
  // 订单管理
  {
    path: "/order",
    component: Layout,
    meta: { title: "订单管理", icon: "icon-dingdan" },
    redirect: "/order/order-list",
    visible: true,
    children: [
      {
        path: "/order/order-list",
        visible: true,
        meta: { title: "订单列表" },
        component: () => import("@/views/Order/OrderList.vue"),
      },
      {
        name: "orderEdit", // 路由的名字： 这种有名字的路由 叫命名式路由
        path: "order-edit",
        visible: false,
        meta: { title: "订单编辑" },
        component: () => import("@/views/Order/OrderEdit.vue"),
      },
    ],
  },
  // 商品管理
  {
    path: "/goods",
    component: Layout,
    visible: true,
    meta: {
      title: "商品管理",
      icon: "icon-shangpin",
    },
    children: [
      {
        path: "goods-list",
        meta: { title: "商品列表" },
        component: () => import("@/views/Goods/GoodsList.vue"),
      },
      {
        path: "goods-add",
        meta: { title: "商品添加" },
        component: () => import("@/views/Goods/GoodsAdd.vue"),
      },
      {
        path: "goods-cate",
        meta: { title: "商品分类" },
        component: () => import("@/views/Goods/GoodsCate.vue"),
      },
    ],
  },
  // 店铺管理
  {
    path: "",
    component: Layout,
    visible: true,
    redirect: "/shop",
    children: [
      {
        path: "/shop",
        meta: { title: "店铺管理", icon: "icon-dianpu" },
        component: () => import("@/views/Shop.vue"),
      },
    ],
  },
  // 账号管理
  {
    path: "/account",
    component: Layout,
    redirect: "/account/account-list",
    visible: true,
    meta: {
      title: "账号管理",
      icon: "icon-zhanghao",
      roles: ["super", "normal"],
    },
    children: [
      {
        path: "account-list",
        meta: { title: "账号列表", roles: ["super"] },
        component: () => import("@/views/Account/AccountList.vue"),
      },
      {
        path: "account-add",
        meta: { title: "账号添加", roles: ["super"] },
        component: () => import("@/views/Account/AccountAdd.vue"),
      },
      {
        path: "pass-modify",
        meta: { title: "修改密码" },
        component: () => import("@/views/Account/PassModify.vue"),
      },
      {
        path: "personal",
        meta: { title: "个人中心" },
        component: () => import("@/views/Account/Personal.vue"),
      },
    ],
  },
  // 销售统计
  {
    path: "/total",
    component: Layout,
    redirect: "/total/goods-total",
    visible: true,
    meta: { title: "销售统计", icon: "icon-tongji", roles: ["super"] },
    children: [
      {
        path: "goods-total",
        meta: { title: "商品统计" },
        component: () => import("@/views/Total/GoodsTotal.vue"),
      },
      {
        path: "order-total",
        meta: { title: "订单统计" },
        component: () => import("@/views/Total/OrderTotal.vue"),
      },
    ],
  },

  // 必须在最后面
  {
    path: "/404",
    visible: false,
    component: () => import("@/views/404.vue"),
  },
  {
    path: "*",
    visible: false,
    redirect: "/404",
  },
];

// 路由配置
const routes = [
  // 登录
  {
    path: "/login",
    component: Login,
  },
  // 后台首页
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        meta: { title: "后台首页" },
        path: "/home",
        component: () => import("@/views/Home.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  let isLogin = local.get("t_k") || ""; // 判断是否登录 如果本地有令牌 证明是登录过的

  // 判断
  if (isLogin) {
    next(); // 放行 同意访问
  } else {
    // 否则 就是没有登录过
    if (to.path === "/login") {
      next(); // 如果用户想去登录页面 直接放行
    } else {
      next("/login"); // 如果用户想访问别的页面  直接跳转到登录去
    }
  }
});

/**
 * @description: 计算权限路由
 * @param: asyncRoutes 所有动态路由
 * @param: role 当前角色
 */
function filterAccessRoutes(routes, role) {
  let accessRoutes = routes.filter((item) => {
    if (hasPremission(item, role)) {
      // 如果有儿子
      if (item.children && item.children.length) {
        item.children = filterAccessRoutes(item.children, role); // 递归过滤
      }

      return true;
    } else {
      return false;
    }
  });
  return accessRoutes;
}

/**
 * @description: 判断是否有权限 如果有权限 返回true  没有权限 返回false
 * @param: route  当前路由对象
 * @param: role 当前角色
 */
function hasPremission(route, role) {
  // console.log(route, role);
  // 如果配置了meta 而且配置了 roles
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(role); // 如果roles中包含当前角色 就返回true  否则 返回false
  } else {
    return true; // 默认没有配置的 都是有权限的
  }
}

/**
 * @description: 计算左侧权限菜单
 * @param:  accessRoutes 算出来的权限路由
 */
function calcMenus(accessRoutes) {
  let menus = accessRoutes.filter((v) => {
    // 特定处理订单
    if (v.children && v.children.length > 1 && v.children[0].visible) {
      v.children.pop();
    }

    return v.visible;
  });
  return menus;
}

/**
 * 创建路由
 * */
export function createRoutes() {
  let role = local.get("role");

  // 算出权限路由
  let accessRoutes = filterAccessRoutes(asyncRoutes, role);

  // 计算出权限菜单
  let menus = calcMenus(accessRoutes);
  local.set("menus", menus);

  // 添加动态路由
  router.addRoutes(accessRoutes);
}

createRoutes(); // 调用生成路由的方法

// 获取角色

export default router;
