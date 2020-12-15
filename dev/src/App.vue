<template>
  <div id="app">
    <Header />
    <div class="main">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"; // 引入头部组件
import { loadModules, loadCss } from "esri-loader"; // 异步加载模块
import config from "@/map/config.js"; // 配置项

export default {
  name: "App",

  components: {
    Header,
  },

  mounted() {
    // 加载地图必备样式文件
    loadCss("http://localhost:3000/arcgis-3.32/esri/css/esri.css");
    loadCss("http://localhost:3000/arcgis-3.32/dijit/themes/claro/claro.css");

    // 异步加载对应 js 模块
    loadModules(
      [
        "esri/map",
        "tdlib/SDTDTLayer",
        "tdlib/SDRasterLayer",
        "tdlib/SDRSAnnoLayer",
        "esri/geometry/Extent",
        "esri/SpatialReference",
        "dojo/parser",
      ],
      config.loadConfig
    )
      .then(
        ([
          Map, // 地图模块
          SDTDTLayer, // 山东天地图矢量地图
          SDRasterLayer, // 山东天地图影像地图
          SDRSAnnoLayer, // 山东天地图影像地图注记
          Extent, // 范围模块
          SpatialReference, // 坐标系模块
          Parser, // 样式解析模块
        ]) => {
          // 设置地图地图图层
          let baseMap = {
            vectorMap: new SDTDTLayer(), //矢量地图
            rasterMap: new SDRasterLayer(), //影像地图
            rasterMapAnnotation: new SDRSAnnoLayer(), //影像注记
            type: 1, // 1 为矢量 | 2：影像
          };

          Parser.parse(); // 解析

          // 设置初始化地图位置
          const startExtent = new Extent(
            ...config.startExtent,
            new SpatialReference({ wkid: 4490 })
          );

          // 添加地图实例
          let map = new Map("map", {
            extent: startExtent, // 初始化位置
            zoom: 10, // 缩放级别
            logo: false, // esri logo
            maxZoom: 18, // 最大缩放级别
            sliderPosition: "bottom-right", // 缩小放大按钮位置
          });

          // 将图层添加到地图实例上
          map.addLayer(baseMap.vectorMap, 0);
        }
      ) //end
      .catch((err) => {
        console.error(err);
      });
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