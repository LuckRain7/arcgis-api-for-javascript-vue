/* eslint-disable no-unused-vars */
/*
 * @Author       : 震雨 LuckRain7
 * @Date         : 2020-08-20 10:44:38
 * @LastEditTime : 2020-12-15 11:53:45
 * @Description  : arcgis地图部分
 * @ Love and Peace
 */

import { loadModules, loadCss } from "esri-loader"; // 异步加载模
import config from "./config"; // 配置项

function ArcGIS() {
  this.map = null; // 地图
  this.baseMap = null; // 地图底图
}

ArcGIS.prototype.init = function init($el) {
  // 加载地图必备样式文件
  loadCss("http://localhost:3000/arcgis-3.32/esri/css/esri.css");
  loadCss("http://localhost:3000/arcgis-3.32/dijit/themes/claro/claro.css");

  // 异步加载对应 js 模块
  loadModules(
    [
      // --- 初始化 ---
      "esri/map",
      "tdlib/SDTDTLayer",
      "tdlib/SDRasterLayer",
      "tdlib/SDRSAnnoLayer",
      "esri/geometry/Extent",
      "esri/SpatialReference",
      // --- 测量 ---
      "esri/dijit/Measurement",
      "esri/units",
      // --- 比例尺 ---
      "esri/dijit/Scalebar",
      // --- 标绘 ---
      "esri/toolbars/draw", // 画图
      "esri/symbols/SimpleMarkerSymbol", // 点
      "esri/symbols/SimpleLineSymbol", // 线
      "esri/symbols/SimpleFillSymbol", // 面
      "esri/graphic", // 图形模块
      "esri/layers/GraphicsLayer", // 图形图层模块
      // --- parser ---
      "dojo/parser",
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
        Scalebar, // 比例尺模块
        Draw, // 画图
        SimpleMarkerSymbol, // 点
        SimpleLineSymbol, // 线
        SimpleFillSymbol, // 面
        Graphic, // 图形模块
        GraphicsLayer, // 图形图层模块

        Parser, // 样式解析模块
      ]) => {
        this.SpatialReference = SpatialReference; // 坐标系

        this.GraphicsLayer = GraphicsLayer;
        this.Graphic = Graphic;
        this.Draw = Draw;
        this.SimpleMarkerSymbol = SimpleMarkerSymbol;
        this.SimpleLineSymbol = SimpleLineSymbol;
        this.SimpleFillSymbol = SimpleFillSymbol;

        // 设置地图地图图层
        this.baseMap = {
          vectorMap: new SDTDTLayer(), //矢量地图
          rasterMap: new SDRasterLayer(), //影像地图
          rasterMapAnnotation: new SDRSAnnoLayer(), //影像注记
          type: 1, // 1 为矢量 | 2：影像
        };

        Parser.parse(); // 解析

        // 设置初始化地图位置
        const startExtent = new Extent(
          ...config.startExtent,
          new SpatialReference({ wkid: 4490 })
        );

        // 添加地图实例
        this.map = new Map("map", {
          extent: startExtent, // 初始化位置
          zoom: 10, // 缩放级别
          logo: false, // esri logo
          maxZoom: 18, // 最大缩放级别
          sliderPosition: "bottom-right", // 缩小放大按钮位置
        });

        // 将图层添加到地图实例上 (图层,图层层级)
        this.map.addLayer(this.baseMap.vectorMap, 0);

        // 测量工具初始化
        this.measurement = new Measurement(
          {
            map: this.map,
            defaultLengthUnit: Units.KILOMETERS, // 设置初始化单位
            defaultAreaUnit: Units.SQUARE_KILOMETERS,
          },
          document.getElementById("measurement")
        );
        this.measurement.startup();

        // 初始化比例尺
        Scalebar({
          map: this.map,
          attachTo: "bottom-left", // 位置
          scalebarUnit: "metric", // 单位
          scalebarStyle: "line", // 样式
        });

        // 初始化标绘工具
        this.drawInit();
      }
    ) //end
    .catch((err) => {
      console.error(err);
    });
};

export default ArcGIS;
