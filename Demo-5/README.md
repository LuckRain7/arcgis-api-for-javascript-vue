# 🌍 五、实现 ArcGIS Server 地图服务信息查询 - 空间查询

上一讲中我们引入了地图服务，这一讲我们了解如何对服务进行信息查询。

**信息查询分为两个类**

- 空间查询：点击地图查询对应区域的要素信息。（ [QueryTask](#2--querytask)，[IdentifyTask](#1--identifytask)  ）
- 属性查询：通过对某个属性进行模糊匹配，在地图显示对应元素。（ `FindTask `）

## 1  IdentifyTask

> 单服务多图层多要素查询（一个地图服务里边可查询多个图层多个要素）
>
> 代码地址：[https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-5/src/IdentifyTask-init.js](https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-5/src/IdentifyTask-init.js)

**在 src\map\init.js 中引入`IdentifyTask`、 `IdentifyParameters` 两个模块**

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

**等待地图加载完成后添加点击事件，并初始化查询参数**

```javascript
// ! 单 on("Load",xx) 不执行(原因待查)
this.map.on("Load", mapReady);
this.map.onLoad();

function mapReady() {
  console.log("--- 地图加载完毕 ---");
  // 添加地图点击事件
  thatMap.on("click", executeIdentifyTask);

  // 创建 identify tasks 实例 并设置参数
  hezuosheMSIT = new IdentifyTask(serverUrl().huinong.hezuoshe);

  // 初始化 IdentifyParameters
  hezuosheMSIP = new IdentifyParameters();
  // 设定 xx 像素范围内查询
  hezuosheMSIP.tolerance = 3;
  // true 结果集包括与每个结果关联的几何。
  hezuosheMSIP.returnGeometry = true;
  // 查询图层（可以控制此参数，实现图层之间的单独查询）
  hezuosheMSIP.layerIds = [0, 1, 2];
  // 指定使用“标识”时要使用的图层。
  hezuosheMSIP.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
  hezuosheMSIP.width = thatMap.width;
  hezuosheMSIP.height = thatMap.height;
}
```

**点击事件函数进行相关查询**

```javascript
  function executeIdentifyTask(event) {
    //识别期间用于选择要素的几何。通过改变此选项进行区域选择、点选
    hezuosheMSIP.geometry = event.mapPoint;
    hezuosheMSIP.mapExtent = thatMap.extent;

    var deferred = hezuosheMSIT
      .execute(hezuosheMSIP) // 将参数传入
      .addCallback(function(response) {
        // response 为数组
        if (response.length < 1) return;

        return response.map((item, index) => {
          console.log("图层名称：", item.layerName);
          console.log(`${item.displayFieldName}::${item.value}`);

          // 要素特征
          let { feature } = item;
          console.log("要素属性表::", feature.attributes);
          console.log("要素图形::", feature.geometry);
          feature.attributes.layerName = item.layerName;
          // 设置信息弹窗模板内容
          var info = new InfoTemplate("Attributes", "${*}");
          feature.setInfoTemplate(info);
          return feature;
        });
      });

    // 设置弹窗显示
    thatMap.infoWindow.setFeatures([deferred]);
    thatMap.infoWindow.show(event.mapPoint);
  }
```

效果：（💛动图较大，请耐心等待）

![](https://luckrain7.github.io/arcgis-api-for-javascript-vue/Demo-5/IdentifyTask.gif)

## 2  QueryTask

> 对 ArcGIS Server REST API 公开的地图服务的图层资源执行查询操作。 
>
> 单服务单图层多要素查询（一个地图服务查询单图层的多要素）
>
> 代码地址：[https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-5/src/queryTask-init.js](https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-5/src/queryTask-init.js)

**在 src\map\init.js 中引入`query`、 `QueryTask` 两个模块**

```diff
loadModules(
  [
+    "esri/tasks/query",
+    "esri/tasks/QueryTask",
  ],
  config.loadConfig
)
  .then(
    ([
+      query, // Query 查询
+      QueryTask,// QueryTask 查询
    ])
```

**等待地图加载完成后添加点击事件，并初始化查询参数**

因为 QueryTask 查询点时不提供缓冲区效果查询，所以需要格外的根据绘制图形进行查询

```javascript
this.map.on("Load", mapReady);
this.map.onLoad();
let toolBar;

function mapReady() {
 //定义一个绘图工具
 toolBar = new that.Draw(that.map);
 toolBar.activate(that.Draw.CIRCLE);
 toolBar.on("draw-complete", drawEnd);
}

function drawEnd(event) {
 //获得绘图得到的面
 let geometry = event.geometry;
 //关闭绘图工具
 toolBar.deactivate();

 // 设置查询
 let queryTask = new QueryTask(hezuosheUrl + "/0"); // 创建查询对象，需拼接查询图层id编号
 let query = new Query(); // 创建查询参数对象
 query.geometry = geometry; // 空间查询的几何对象
 query.outFields = ["*"]; // 服务器返回字段 *:all
 query.outSpatialReference = thatMap.spatialReference; // 空间参考信息
 query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS; // 设置查询的标准
 query.returnGeometry = true; // 是否返回几何信息

 //执行空间查询
 const deferred = queryTask
   .execute(query)
   .addCallback(function(result) {
     const { features } = result;
     if (features.length < 1) return;
     console.log(features);

     return features.map((item, index) => {
       // 设置信息弹窗模板内容
       let info = new InfoTemplate("Attributes" + index, "${*}");
       item.setInfoTemplate(info);
       return item;
     });
   });
 console.log(deferred);

 // 设置弹窗显示
 thatMap.infoWindow.setFeatures([deferred]);
 thatMap.infoWindow.show(event.mapPoint);
}
```

效果：（💛动图较大，请耐心等待）

![](https://luckrain7.github.io/arcgis-api-for-javascript-vue/Demo-5/QueryTask.gif)

[🚀返回首页](https://github.com/LuckRain7/arcgis-api-for-javascript-vue)

