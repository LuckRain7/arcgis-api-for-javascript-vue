/*
 *  Description: 信息查询
 *  Author: LuckRain7
 *  Date: 2020-05-19 12:28:23
 *
 * 空间查询
 * 属性查询
 */

/* example  IdentifyTask 查询封装

import { executeIdentifyTask } from "./functions/InfoQuery.js";
executeIdentifyTask(
  ev,
  thatMap,
  serverUrl().huinong.hezuoshe,
  IdentifyTask,
  IdentifyParameters,
  InfoTemplate
);

*/

/*
 *  description: 查询事件
 *  param {type} event                点击事件
 *  param {type} thatMap              map实例
 *  param {type} url                  查询服务地址
 *  param {type} IdentifyTask         查询类
 *  param {type} IdentifyParameters   查询参数类
 *  param {type} InfoTemplate         信息模板类
 *  return:
 */
function executeIdentifyTask(
  event,
  thatMap,
  url,
  IdentifyTask,
  IdentifyParameters,
  InfoTemplate
) {
  // 针对合作社图层进行查询
  let hezuosheMSIT;
  let hezuosheMSIP;
  // 创建 identify tasks 实例 并设置参数
  hezuosheMSIT = new IdentifyTask(url);

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
        console.log(index);

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

// //定义一个绘图工具
// let toolBar;
// toolBar = new that.Draw(that.map);
// toolBar.activate(that.Draw.CIRCLE);
// toolBar.on("draw-complete", drawEnd);

/*
 *  description:  executeQueryTaskBySpace 空间查询
 *  param {type} event          点击事件
 *  param {type} thatMap        map实例
 *  param {type} url            查询服务地址
 *  param {type} Query          查询类
 *  param {type} QueryTask      查询类
 *  param {type} InfoTemplate   信息模板类
 *  param {type} toolBar        绘图工具
 *  return:
 */
function executeQueryTaskBySpace(
  event,
  thatMap,
  url,
  Query,
  QueryTask,
  InfoTemplate,
  toolBar
) {
  //获得绘图得到的面
  let geometry = event.geometry;
  //关闭绘图工具
  toolBar.deactivate();

  // 设置查询
  let queryTask = new QueryTask(url + "/0"); // 创建查询对象，需拼接查询图层id编号
  let query = new Query(); // 创建查询参数对象
  query.geometry = geometry; // 空间查询的几何对象
  query.outFields = ["*"]; // 服务器返回字段 *:all
  query.outSpatialReference = thatMap.spatialReference; // 空间参考信息
  query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS; // 设置查询的标准
  query.returnGeometry = true; // 是否返回几何信息

  //执行空间查询
  const deferred = queryTask.execute(query).addCallback(function(result) {
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
  // console.log(deferred);

  // 设置弹窗显示
  thatMap.infoWindow.setFeatures([deferred]);
  thatMap.infoWindow.show(event.mapPoint);
}

export { executeIdentifyTask, executeQueryTaskBySpace };
