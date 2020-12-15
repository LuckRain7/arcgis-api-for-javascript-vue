/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-05-06 11:10:22
 */
import Vue from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./style/index.less";

Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
