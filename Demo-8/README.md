# 🌍 8、缓冲区分析（developing）



**在 src\map\init.js 引入一下模块**

```diff
loadModules(
  [
+      "esri/config", // 所有JS API配置选项的默认值。
+      "esri/tasks/GeometryService",
+      "esri/Color",
+      "esri/tasks/BufferParameters", 
+      "esri/geometry/normalizeUtils",
  ],
  config.loadConfig
)
  .then(
    ([
+        EsriConfig, // 所有JS API配置选项的默认值。
+        GeometryService, // 表示由ArcGIS服务器REST API公开的几何图形服务资源。它用于对几何图形执行各种操作，如项目、简化、缓冲区和关系。
+        EsriColor, // 设置颜色
+        BufferParameters, // 缓冲区参数配置模块
+        NormalizeUtils,
    ])=> {
    // 缓存
+    this.EsriConfig = EsriConfig;
+    this.GeometryService = GeometryService;
+    this.EsriColor = EsriColor;
+    this.BufferParameters = BufferParameters;
+    this.NormalizeUtils = NormalizeUtils;
    }
```





<br>

[🚀 返回首页]( https://github.com/LuckRain7/arcgis-api-for-javascript-vue )

