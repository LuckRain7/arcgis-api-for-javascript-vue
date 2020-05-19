/* eslint-disable no-unused-vars */
/*
 *  Description: arcgis地图部分
 *  Author: LuckRain7
 *  Date: 2020-04-28 20:44:49
 *
 *  MeasurementClose() 关闭测量工具
 */

import { loadModules, loadCss } from "esri-loader"; // 异步加载模块
import config from "./config"; // 配置项
import serverUrl from "../../server.url.config";

function ArcGIS() {
  this.map = null; // 地图
  this.baseMap = null; // 地图底图
  this.SpatialReference = null; // 坐标系
  this.measurement = null; // 测量功能
  this.GraphicsLayer = null; //图形图层
  this.draw = null; // 绘图
  this.GraphicsLayer = null; // 图形图层
  this.Draw = null; // Draw模块
  this.Graphic = null;
  this.SimpleMarkerSymbol = null;
  this.SimpleLineSymbol = null;
  this.SimpleFillSymbol = null;
  this.ArcGISDynamicMapServiceLayer = null;
}

ArcGIS.prototype.init = function init($el) {
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
      "esri/dijit/Measurement",
      "esri/units",
      "dojo/parser",
      "esri/dijit/Scalebar",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/tasks/IdentifyTask",
      "esri/tasks/IdentifyParameters",
      "esri/InfoTemplate",
      "esri/tasks/query",
      "esri/tasks/QueryTask",
      "esri/toolbars/draw", // 画图
      "esri/symbols/SimpleMarkerSymbol", // 点
      "esri/symbols/SimpleLineSymbol", // 线
      "esri/symbols/SimpleFillSymbol", // 面
      "esri/graphic", // 图形模块
      "esri/layers/GraphicsLayer", // 图形图层模块
      // -----------------------
      // "dojo/dom-construct",
      // "dojo/domReady!",
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
        Measurement, //测量模块
        Units, // 单位模块
        Parser, // 样式解析模块
        Scalebar, // 比例尺模块
        ArcGISDynamicMapServiceLayer, // ArcGIS Server REST API公开的动态地图服务资源
        IdentifyTask, // IdentifyTask 空间查询
        IdentifyParameters, // IdentifyTask 空间查询参数
        InfoTemplate, // 信息弹窗模板
        Query, // Query 查询
        QueryTask, // QueryTask 查询
        Draw, // 画图
        SimpleMarkerSymbol, // 点
        SimpleLineSymbol, //  线
        SimpleFillSymbol, // 面
        Graphic, // 图形模块
        GraphicsLayer, // 图形图层模块
      ]) => {
        this.SpatialReference = SpatialReference;
        this.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
        this.Draw = Draw;
        this.GraphicsLayer = GraphicsLayer;
        this.Graphic = Graphic;
        this.SimpleMarkerSymbol = SimpleMarkerSymbol;
        this.SimpleLineSymbol = SimpleLineSymbol;
        this.SimpleFillSymbol = SimpleFillSymbol;

        this.baseMap = {
          vectorMap: new SDTDTLayer(), //矢量
          rasterMap: new SDRasterLayer(), //影像
          rasterMapAnnotation: new SDRSAnnoLayer(), //影像注记
          type: 1, // 1为矢量 | 2：影像
        };

        // 解析
        Parser.parse();

        // 设置初始化地图位置
        const startExtent = new Extent(
          ...config.startExtent,
          new SpatialReference({ wkid: 4490 })
        );

        // 加载地图
        this.map = new Map($el, {
          extent: startExtent, // 初始化位置
          zoom: 10, // 缩放级别
          logo: false, // esri logo
          maxZoom: 18, // 最大缩放级别
          sliderPosition: "bottom-right", // 缩小放大按钮位置
        });
        this.map.addLayer(this.baseMap.vectorMap, 0);

        // ----------------------------
        // ------ 测量工具初始化 -------
        // ----------------------------
        this.measurement = new Measurement(
          {
            map: this.map,
            defaultLengthUnit: Units.KILOMETERS,
            defaultAreaUnit: Units.SQUARE_KILOMETERS,
          },
          document.getElementById("measurement")
        );
        this.measurement.startup();

        // 加载比例尺
        Scalebar({
          map: this.map,
          attachTo: "bottom-left",
          scalebarUnit: "metric",
          scalebarStyle: "line",
        });

        // 初始化标绘工具
        this.drawInit();

        // ---------------------------------
        // ---------添加地图边界-------------
        // ---------------------------------
        // 1.通过 ArcGISDynamicMapServiceLayer 类进行导入
        const bianjieMapServer = new this.ArcGISDynamicMapServiceLayer(
          serverUrl().bianjie,
          {
            id: "bianjie", // 设置 id
            opacity: 1, // 设置地图服务的透明度
          }
        );

        this.map.addLayer(bianjieMapServer, 3); // 2.通过 map.addLayer 函数 加载到地图上

        // |---------------|
        // |-添加合作社图层-|
        // |---------------|
        const hezuosheUrl = serverUrl().huinong.hezuoshe;
        const hezuosheMapServer = new this.ArcGISDynamicMapServiceLayer(
          hezuosheUrl,
          {
            id: "hezuoshe",
            opacity: 1,
          }
        );
        this.map.addLayer(hezuosheMapServer, 4);

        // thatMap.on("Click", mapClick);

        // 防止 ArcGIS API 内部 call apply 等继承出现问题
        // 我们需要 function 定义函数
        let thatMap = this.map;
        let that = this;

        // ! 单 on("Load",xx) 不执行(原因待查)
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

        // console.log(this.map);
        // console.log(this.map === thatMap);
      }
    ) //end
    .catch((err) => {
      console.error(err);
    });
};

export default ArcGIS;
