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
import { DataType } from "../utils/index"; // 工具函数

class ArcGIS {
  constructor() {
    this.map = null; // 地图
    this.baseMap = null; // 地图底图
    this.measurement = null; // 测量功能
    this.GraphicsLayer = null; //图形图层
    this.draw = null; // 绘图
  }

  init($el) {
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
        ]) => {
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

          // 测量工具初始化
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
        }
      ) //end
      .catch((err) => {
        console.error(err);
      });
  }

  // 初始化标绘工具
  drawInit() {
    loadModules(
      [
        "esri/toolbars/draw", // 画图
        "esri/symbols/SimpleMarkerSymbol", // 点
        "esri/symbols/SimpleLineSymbol", // 线
        "esri/symbols/SimpleFillSymbol", // 面
        "esri/graphic", // 图形模块
        "esri/layers/GraphicsLayer", // 图形图层模块
      ],
      config.loadConfig
    )
      .then(
        ([
          Draw,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          SimpleFillSymbol,
          Graphic,
          GraphicsLayer,
        ]) => {
          this.GraphicsLayer = GraphicsLayer;

          var DrawGraphics = new esri.layers.GraphicsLayer({ id: "drawLayer" });
          DrawGraphics.SpatialReference = new SpatialReference({ wkid: 4490 });
          map.addLayer(DrawGraphics, 7);

          this.draw = new Draw(this.map);
          //定义图形样式
          this.draw.markerSymbol = new SimpleMarkerSymbol();
          this.draw.lineSymbol = new SimpleLineSymbol();
          this.draw.fillSymbol = new SimpleFillSymbol();
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }

  // 关闭测量工具
  MeasurementClose() {
    this.measurement.clearResult(); // 清除测量图案
    // 拿到开启的工具名称 并关闭已开启的工具
    this.measurement.getTool() &&
      this.measurement.setTool(this.measurement.getTool().toolName, false);
  }

  // 切换地图底图
  baseMapChange(type) {
    if (type === this.baseMap.type) return; // 防止重复加载

    // 添加 影像
    if (type === 2) {
      this.addLayer(
        [this.baseMap.rasterMap, this.baseMap.rasterMapAnnotation],
        [0, 1]
      );
      this.removeLayer(this.baseMap.vectorMap);
      this.baseMap.type = 2;
    }
    // 添加 矢量
    else {
      this.addLayer(this.baseMap.vectorMap, 0);
      this.removeLayer([
        this.baseMap.rasterMap,
        this.baseMap.rasterMapAnnotation,
      ]);
      this.baseMap.type = 1;
    }
  }

  /*
   *  description:  添加图层
   *  param {Layer,Array<Layer>} layer  需添加的图层
   *  param {number,Array<number>} lever 添加图层的层数
   */
  addLayer(layer, lever) {
    // 判断是
    if (DataType(layer, "array")) {
      layer.forEach((item, index) => {
        lever ? this.map.addLayer(item, lever[index]) : this.map.addLayer(item);
      });
    } else {
      lever ? this.map.addLayer(layer, lever) : this.map.addLayer(layer);
    }
  }

  removeLayer(layer) {
    this.map.removeLayer(layer);
  }
}

export default ArcGIS;
