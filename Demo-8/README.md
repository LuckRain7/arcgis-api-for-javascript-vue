# 🌍 8、缓冲区分析（developing）

### 缓冲区分析代码思路：

1.  确定 ArcGIS Server中几何服务地址
2.  绘制图形，确定查询区域
3.  将绘制好的图形设置缓冲区分析参数，传入几何服务进行处理
4.  接收几何服务处理后的缓冲区图形
5.  利用 `QueryTask `，传入缓冲区图形进行查询。
6.  接收查询后结果

代码位置：

### **在下图中可以找到 ArcGIS Server中几何服务地址**

![geometry-utilities](C:\Users\ZHCZ\Desktop\arcgis-api-for-javascript-vue\Demo-8\geometry-utilities.png)

### **在 src\map\init.js 引入一下模块**

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

### 主要代码：

```javascript
  function mapReady() {
    console.log("地图加载完成");

    // 注册图形样式
    that.geometrySymbol = geometrySymbol(
      SimpleMarkerSymbol,
      SimpleLineSymbol,
      EsriColor
    );
    console.log(that.geometrySymbol);

    // 配置缓冲区参数
    EsriConfig.defaults.geometryService = new GeometryService(
      serverUrl().Utilities.Geometry
    );
    EsriConfig.defaults.io.proxyUrl = "/proxy/";
    EsriConfig.defaults.io.alwaysUseProxy = false;

    // 定义一个绘图工具
    toolBar = new Draw(that.map);
    toolBar.activate(Draw.CIRCLE);
    toolBar.on("draw-complete", bufferQuery);
  }
  // 利用所画区域进行查询
  function bufferQuery(evtObj) {
    // 获取所画图形形状
    let geometry = evtObj.geometry;
    let symbol;
    // 设置查询图形样式
    switch (geometry.type) {
      case "point": // 点缓冲区分析
        symbol = new SimpleMarkerSymbol(
          SimpleMarkerSymbol.STYLE_SQUARE,
          10,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new EsriColor([255, 0, 0]),
            1
          ),
          new EsriColor([0, 255, 0, 0.25])
        );
        break;
      case "polyline": // 先缓冲区分析
        symbol = new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_DASH,
          new EsriColor([255, 0, 0]),
          1
        );
        break;
      case "polygon": // 面缓冲区分析
        symbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_NONE,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_DASHDOT,
            new EsriColor([255, 0, 0]),
            2
          ),
          new EsriColor([255, 255, 0, 0.25])
        );
        break;
    }

    // 添加查询图形到地图上
    let graphic = new Graphic(geometry, symbol);
    that.map.graphics.add(graphic);

    // 初始化 Buffer 查询参数
    var params = new BufferParameters();
    params.distances = ["2"]; // 默认距离
    params.unit = GeometryService["UNIT_KILOMETER"]; // 设置缓冲区距离单位
    params.bufferSpatialReference = new SpatialReference({
      wkid: 102100,
    }); // 设置坐标系（平面坐标系）
    params.outSpatialReference = that.map.spatialReference; // 设置输出坐标系

    // 将图形进行处理
    NormalizeUtils.normalizeCentralMeridian([geometry]).then(function(
      normalizedGeometries
    ) {
      let normalizedGeometry = normalizedGeometries[0];
      // 图形判断
      if (normalizedGeometry.type === "polygon") {
        EsriConfig.defaults.geometryService.simplify(
          [normalizedGeometry],
          function(geometries) {
            params.geometries = geometries;

            EsriConfig.defaults.geometryService.buffer(
              params,
              showBuffer
            );
          }
        );
      } else {
        params.geometries = [normalizedGeometry];
        EsriConfig.defaults.geometryService.buffer(params, showBuffer);
      }
    });
  }

  let showBuffer = (bufferedGeometries) => {
    let symbol2 = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new EsriColor([255, 0, 0, 0.65]),
        2
      ),
      new EsriColor([255, 0, 0, 0.35])
    );

    bufferedGeometries.forEach(function(geometry) {
      // 添加缓冲区形状
      let graphic = new Graphic(geometry, symbol2);
      that.map.graphics.add(graphic);

      let graphicBuffer = geometry;
      // 使用 QueryTask 对缓冲区进行查询
      var BufferTask = QueryTask(
        serverUrl().huinong.zhongzhiBuffer + "/0"
      );
      var Bufferquery = new Query();
      Bufferquery.returnGeometry = true;
      // 设置坐标系
      graphicBuffer.spatialReference = new SpatialReference(4490);
      Bufferquery.geometry = graphicBuffer;
      Bufferquery.outFields = ["*"];
      BufferTask.execute(Bufferquery, showResults); // 进行查询

      function showResults(featureSet) {
        that.map.graphics.clear(); // 清除地图图形
        console.log(featureSet);
        const { features } = featureSet; // 解构
        if (features.length < 1) return; // 判空

        let html = "";

        features.map(function(item) {
          console.log(item);
          // 添加查询图形到地图上
          let itemGraphic = new Graphic(
            item.geometry,
            that.geometrySymbol.bufferPoint
          );
          that.map.graphics.add(itemGraphic);
          html += `<div>${item.attributes.name}</div>`;
        });

        // 打印
        document.querySelector(
          ".content-buffer .main-content"
        ).innerHTML = html;
      }
    });
  };
```

效果：

![buffer](C:\Users\ZHCZ\Desktop\arcgis-api-for-javascript-vue\Demo-8\buffer.gif)

<br>

[🚀 返回首页]( https://github.com/LuckRain7/arcgis-api-for-javascript-vue )

