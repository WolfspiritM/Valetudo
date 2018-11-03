import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

import Vue from "vue";
import VueOnsen from "vue-onsenui";
import App from "./App.vue";
import router from "./router";
import store from "./store";


Vue.use(VueOnsen);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
