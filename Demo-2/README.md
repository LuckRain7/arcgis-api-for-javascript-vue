# vue + ArcGIS 地图应用系列二：加载地图

![](./2.png)

## 1.  创建 Vue 项目

我们利用 Vue-CLI 工具进行快捷创建

1.  下载 Vue-CLI 工具

```bash
yarn add global @vue/cli  # or: npm i @vue/cli -g
```

2.  创建 Vue 项目

根据自己项目需求进行配置，这里不过多的赘述。

```bash
vue create example # example为项目名称，我这里以example为例
```

3.  进行项目并启动测试

```bash
cd example
yarn serve
```

访问 http://localhost:8080 ，出现 vue 界面说明项目创建成功。

## 2.  引入 ArcGIS API

>  因为历史原因，ArcGIS API 使用的 AMD 模块化思想，与 Vue 的模块化思想相冲突。ArcGIS 官方给出了  `esri-loader ` 解决方案，我们使用这个包进行 ArcGIS API 的异步加载

1.  下载 esri-loader

```bash
yarn add esri-loader # or: npm i esri-loader -s
```

2.  配置 ArcGIS API 异步加载地址

>  我们在第一讲中讲到的  [ArcGIS API for JavaScript 本地部署(开发环境)](https://luckrain7.github.io/arcgis-api-for-javascript-vue/) 就派上了用场。

- 新建一个配置文件 src/map/config.js 配置托管的 API 地址

```javascript
export default {
  // load配置
  loadConfig: {
    url: 'http://localhost:3000/arcgis-3.32/init.js', //托管 API 地址
  },

  // 初始化位置
  startExtent: [
    118.54805985687483,
    36.48416358185947,
    120.25643388031263,
    35.52697974396869,
  ],
}
```

3. 在 src/map/init.js 中新建 ArcGIS 加载类

代码如下

```javascript
/* eslint-disable no-unused-vars */
/*
 *  Description: arcgis地图部分
 *  Author: LuckRain7
 *  Date: 2020-04-28 20:44:49
 */

import { loadModules, loadCss } from "esri-loader"; // 异步加载模块
import config from "./config"; // 配置项
import { DataType } from "../utils/index"; // 工具函数

class ArcGIS {
  constructor() {
    this.map = null; // 地图
    this.baseMap = null; // 地图底图
  }

  init($el) {
    // 加载地图必备样式文件
    loadCss("http://localhost:3000/arcgis-3.32/esri/css/esri.css");
    loadCss("http://localhost:3000/arcgis-3.32/dijit/themes/claro/claro.css");
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
          this.baseMap = {
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

          //加载地图
          this.map = new Map($el, {
            extent: startExtent, // 初始化位置
            zoom: 10, // 缩放级别
            logo: false, // esri logo
            maxZoom: 18, // 最大缩放级别
            sliderPosition: "bottom-right", // 缩小放大按钮位置
          });
          this.map.addLayer(this.baseMap.vectorMap, 0);

        }
      ) //end
      .catch((err) => {
        console.error(err);
      });
  }

  /*
   *  description:  添加图层
   *  param {Layer,Array<Layer>} layer  需添加的图层
   *  param {number,Array<number>} lever 添加图层的层数
   */
  addLayer(layer, lever) {
    // 判断是都为数组
    if (DataType(layer, "array")) {
      layer.forEach((item, index) => {
        lever ? this.map.addLayer(item, lever[index]) : this.map.addLayer(item);
      });
    } else {
      lever ? this.map.addLayer(layer, lever) : this.map.addLayer(layer);
    }
  }
}

export default ArcGIS;
```

## 3.  创建地图组件并加载地图

1. 引入我们上面创建好的模块，并进行实例化
2. 执行其中的 init 方法。并传入对应 dom 的 ID

```vue
<template>
  <div id="app">
    <Header />
    <div class="main">
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";

// 引入 ArcGIS 模块，并进行实例化
import ArcGIS from "./map/init.js";
let Map = new ArcGIS();
export default {
  name: "App",
  components: {
    Header,
  },
  mounted() {
    Map.init("map"); // 初始化地图模块
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

```

## 4.  效果图

![](./init.png)

