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
import ArcGIS from "@/map/init.js";
const arcgis = new ArcGIS();

export default {
  name: "App",

  components: {
    Header,
  },

  mounted() {
    arcgis.init("map");
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