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
      ]) => {
        this.SpatialReference = SpatialReference;
        this.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
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

        const hezuosheMapServer = new this.ArcGISDynamicMapServiceLayer(
          serverUrl().huinong.hezuoshe,
          {
            id: "hezuoshe",
            opacity: 1,
          }
        );
        this.map.addLayer(hezuosheMapServer, 4);

        console.log(this.map);
      }
    ) //end
    .catch((err) => {
      console.error(err);
    });
};

export default ArcGIS;
