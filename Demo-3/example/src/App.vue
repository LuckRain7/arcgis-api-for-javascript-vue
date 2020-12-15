<template>
  <div id="app">
    <!-- 头部 -->
    <Header />
    <!-- 工具条组件 -->
    <tool-bar
      @measurement="measurement"
      @baseMapChange="baseMapChange"
      @draw="draw"
      @showLegend="showLegend"
      @showLayerList="showLayerList"
    >
    </tool-bar>
    <!-- 测量组件 -->
    <Measurement :show="isShowMeasurement" @closMmeasurement="measurement">
    </Measurement>
    <!-- 地图部分 -->
    <div class="main">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"; // 引入头部组件
import ToolBar from "@/components/ToolBar.vue"; // 工具条组件
import Measurement from "@/components/Measurement.vue"; // 测量组件
import ArcGIS from "@/map/index.js";
const Map = new ArcGIS();

export default {
  name: "App",

  components: {
    Header,
    ToolBar,
    Measurement,
  },
  data() {
    return {
      isShowMeasurement: false,
    };
  },

  mounted() {
    Map.init("map");
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
    // 地图切换
    baseMapChange(type) {
      Map.baseMapChange(type);
    },
    // 标绘
    draw(type) {
      Map.drawActive(type);
    },
    // 显示图例
    showLegend() {
      console.log("显示图例");
    },
    // 显示图层
    showLayerList() {
      console.log("显示图层");
    },
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