# 🌍 7、 热力图分析 Thermogram Analysis

## 1.  根据图层进行热力图渲染

> 代码地址:[ https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-7/init.js ]( https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-7/init.js )

**在 src\map\init.js 引入一下模块**

```diff
loadModules(
  [
+    "esri/layers/FeatureLayer",
+    "esri/renderers/HeatmapRenderer",
  ],
  config.loadConfig
)
  .then(
    ([
+      FeatureLayer, // Feature 图层
+      HeatmapRenderer,// 热力图渲染
    ])=> {
    // 缓存
+    this.FeatureLayer = FeatureLayer;
+    this.HeatmapRenderer = HeatmapRenderer;
    }
```

利用 FeatureLayer 的可编辑性，进行热力图渲染

```javascript
function mapReady() {
  console.log(1);

  let doctorNumFlayer = new FeatureLayer(
    serverUrl().fenxi.xiangcunyisheng + "/0",
    {
      outFields: ["*"], //必须要有返回值，提供给热力图进行分析
    }
  );

  let heatmapRenderer = new HeatmapRenderer({
    field: "yiliao", // 根据哪一个字段进行渲染
    blurRadius: 12, //蓝色
    colors: [
      "rgba(30,144,255, 0)",
      "rgba(30,144,255,0.8)",
      "rgb(0, 255, 0)",
      "rgb(255, 255, 0)",
      "rgb(255, 0, 0)",
    ],
  });
  doctorNumFlayer.setRenderer(heatmapRenderer);

  that.map.addLayer(doctorNumFlayer); // 将热力图分析添加到地图上
}
```

效果：

![](https://luckrain7.github.io/arcgis-api-for-javascript-vue/Demo-7/heatmap.png)

## 2.  根据数据进行热力图渲染

TODO（暂定后期更新）



<br>

[🚀 返回首页](https://github.com/LuckRain7/arcgis-api-for-javascript-vue)

