import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// reset.css
import "@/assets/css/reset.css";

// iconfont.css
import "@/assets/fonts/iconfont.css";

// 引入elementui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

// 在Vue的原型上 添加中介bus
Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
