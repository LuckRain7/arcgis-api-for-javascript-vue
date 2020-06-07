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
  this.FeatureLayer = null;
  // 属性查询
  this.FindTask = null;
  this.FindParameters = null;
  this.Query = null;
  this.QueryTask = null;
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
      "esri/layers/FeatureLayer",
      "esri/tasks/FindTask",
      "esri/tasks/FindParameters",
      "esri/renderers/HeatmapRenderer",
      "esri/config", // 所有JS API配置选项的默认值。
      "esri/tasks/GeometryService",
      "esri/Color",
      "esri/tasks/BufferParameters",
      "esri/geometry/normalizeUtils",
      "dojo/on", // dojo 事件监听
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
        FeatureLayer,
        FindTask, // FindTask 属性查询
        FindParameters, // FindTask 属性查询参数
        HeatmapRenderer, // 热力图渲染
        EsriConfig, // 所有JS API配置选项的默认值。
        GeometryService, // 表示由ArcGIS服务器REST API公开的几何图形服务资源。它用于对几何图形执行各种操作，如项目、简化、缓冲区和关系。
        EsriColor, // 设置颜色
        BufferParameters, // 缓冲区参数配置模块
        NormalizeUtils, // 将与中央子午线相交或落在世界范围之外的几何图形标准化，因此它们保持在当前的坐标系内。仅支持Web墨卡托和地理坐标。
        dojoOn, // dojo 事件监听
      ]) => {
        this.SpatialReference = SpatialReference;
        this.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
        this.FeatureLayer = FeatureLayer;
        this.Draw = Draw;
        this.GraphicsLayer = GraphicsLayer;
        this.Graphic = Graphic;
        this.SimpleMarkerSymbol = SimpleMarkerSymbol;
        this.SimpleLineSymbol = SimpleLineSymbol;
        this.SimpleFillSymbol = SimpleFillSymbol;
        // FindTask 属性查询
        this.FindTask = FindTask;
        this.FindParameters = FindParameters;
        //  Query 综合查询
        this.Query = Query;
        this.QueryTask = QueryTask;
        // 热力图渲染
        this.HeatmapRenderer = HeatmapRenderer;
        // 所有JS API配置选项的默认值。
        this.EsriConfig = EsriConfig;
        this.GeometryService = GeometryService;
        // dojo
        this.dojoOn = dojoOn;

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

        // --------------- //
        // - 添加地图边界 - //
        // --------------- //
        // 1.通过 ArcGISDynamicMapServiceLayer 类进行导入
        const bianjieMapServer = new this.ArcGISDynamicMapServiceLayer(
          serverUrl().bianjie,
          {
            id: "bianjie", // 设置 id
            opacity: 1, // 设置地图服务的透明度
          }
        );

        this.map.addLayer(bianjieMapServer, 3); // 2.通过 map.addLayer 函数 加载到地图上

        // 防止 ArcGIS API 内部 call apply 等继承出现问题
        // 我们需要 function 定义函数
        let that = this;

        // ! 单 on("Load",xx) 不执行(原因待查)
        this.map.on("Load", mapReady);
        this.map.onLoad();
        // thatMap.on("Click", mapClick);

        let toolBar;
        // 得使用 ；function 定义函数
        function dddddd(evtObj) {
          console.log(evtObj);
        }

        function mapReady() {
          console.log("地图加载完成");

          // 配置缓冲区参数
          EsriConfig.defaults.geometryService = new GeometryService(
            serverUrl().Utilities.Geometry
          );
          EsriConfig.defaults.io.proxyUrl = "/proxy/";
          EsriConfig.defaults.io.alwaysUseProxy = false;

          // 定义一个绘图工具
          toolBar = new Draw(that.map);
          toolBar.activate(Draw.CIRCLE);
          toolBar.on("draw-complete", nongyecompany);
        }

        function nongyecompany(evtObj) {
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
                    showBuffer1
                  );
                }
              );
            } else {
              params.geometries = [normalizedGeometry];
              EsriConfig.defaults.geometryService.buffer(params, showBuffer1);
            }
          });
        }

        let showBuffer1 = (bufferedGeometries) => {
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
            var BufferTask = QueryTask(
              serverUrl().huinong.zhongzhiBuffer + "/0"
            );
            var Bufferquery = new Query();
            Bufferquery.returnGeometry = true;
            // 设置坐标系
            graphicBuffer.spatialReference = new SpatialReference(4490);
            Bufferquery.geometry = graphicBuffer;
            Bufferquery.outFields = ["*"];
            BufferTask.execute(Bufferquery, showResults);

            function showResults(featureSet) {
              // that.map.graphics.clear();
              console.log(featureSet);
            }
          });

          // const geometries = bufferedGeometries[0].rings[0];
          // console.log(geometries);
          // console.log(that.map);

          //   console.log(geometry);
        };
      }
    ) //end
    .catch((err) => {
      console.error(err);
    });
};

export default ArcGIS;
