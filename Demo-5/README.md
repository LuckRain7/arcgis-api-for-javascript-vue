# 🌍 五、实现 ArcGIS Server 地图服务信息查询

上一讲中我们引入了地图服务，这一讲我们了解如何对服务进行信息查询。

**信息查询分为两个类**

- 空间查询：点击地图查询信息。（ `QueryTask`,`IdentifyTask`  ）
- 属性查询：通过对某个属性进行模糊匹配，在地图显示对应元素。（ `FindTask `）

## 1.  空间查询

点击地图上某个信息点，显示对应的要素信息

### 1.1  IdentifyTask

> 多图层多要素查询
>
> 代码地址：[https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-5/src/IdentifyTask-init.js](https://github.com/LuckRain7/arcgis-api-for-javascript-vue/blob/master/Demo-5/src/IdentifyTask-init.js)

在 src\map\init.js 中引入`IdentifyTask`、 `IdentifyParameters` 两个模块

```diff
loadModules(
  [
+    "esri/tasks/IdentifyTask",
+    "esri/tasks/IdentifyParameters",
  ],
  config.loadConfig
)
  .then(
    ([
+      IdentifyTask, // IdentifyTask 空间查询
+      IdentifyParameters,// IdentifyTask 空间查询参数
    ])
```

等待地图加载完成后添加点击事件，并初始化查询参数

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

点击事件函数进行相关查询

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

