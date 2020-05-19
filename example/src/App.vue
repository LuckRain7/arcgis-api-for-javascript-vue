<!--
 * @Description:  
 * @Author: LuckRain7
 * @Date: 2020-05-06 11:10:22
 -->
<template>
  <div id="app">
    <!-- 头部组件 -->
    <my-header />

    <!-- 地图主题组件 -->
    <div class="main">
      <div id="map"></div>
    </div>

    <!-- 工具条组件 -->
    <tool-bar
      @measurement="measurement"
      @baseMapChange="baseMapChange"
      @draw="draw"
      @showLegend="showLegend"
      @showLayerList="showLayerList"
      @spatialQuery="spatialQuery"
    ></tool-bar>

    <!-- 测量组件 -->
    <measurement
      :show="isShowMeasurement"
      @closMmeasurement="measurement"
    ></measurement>

    <layer-nav-menu></layer-nav-menu>
  </div>
</template>

<script>
import MyHeader from "./components/Header.vue";
import ToolBar from "./components/ToolBar.vue";
import Measurement from "./components/Measurement.vue";
import LayerNavMenu from "./components/LayerNavMenu.vue";

// 引入 ArcGIS 模块，并进行实例化
import ArcGIS from "./map/index.js";
let Map = new ArcGIS();
export default {
  name: "App",

  mounted() {
    Map.init("map"); // 初始化地图模块
  },
  methods: {
    // 测量
    measurement(type) {
      switch (type) {
        case 0:
          this.isShowMeasurement = false;
          Map.MeasurementClose();
          break;
        case 1:
          this.isShowMeasurement = true;
      }
    },
    /* 地图切换 */
    baseMapChange(type) {
      Map.baseMapChange(type);
    },
    // 标绘
    draw(type) {
      Map.drawActive(type);
    },
    // 显示图例
    showLegend() {
      console.log("开启图例");
    },
    // 显示图层
    showLayerList() {
      console.log("开启图层");
    },
    spatialQuery(type) {
      console.log(type);
    },
  },
  data() {
    return {
      isShowMeasurement: false, // 测量窗口
    };
  },
  components: {
    MyHeader,
    ToolBar,
    Measurement,
    LayerNavMenu,
  },
};
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.main {
  position: absolute;
  top: 70px;
  bottom: 0;
  width: 100%;

  #map {
    width: 100%;
    height: 100%;
  }
}
</style>
