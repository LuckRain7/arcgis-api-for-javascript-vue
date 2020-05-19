# 🌍 6、实现 ArcGIS Server 地图服务信息查询 - 属性查询

Demo-5 中我们实现了空间查询，这里我们进行属性查询代码编写。

**信息查询分为两个类**

- 空间查询：点击地图查询对应区域的要素信息。（ QueryTask，IdentifyTask  ）
- 属性查询：通过对某个属性进行模糊匹配，在地图显示对应元素。（ FindTask ）









```diff
loadModules(
  [
+    "esri/tasks/IdentifyTask",
+    "esri/tasks/IdentifyParameters",
+    "esri/InfoTemplate",
  ],
  config.loadConfig
)
  .then(
    ([
+      IdentifyTask, // IdentifyTask 空间查询
+      IdentifyParameters,// IdentifyTask 空间查询参数
+      InfoTemplate, // 信息弹窗模板
    ])
```

