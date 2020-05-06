/* eslint-disable no-unused-vars */
/*
 *  Description: arcgis地图部分
 *  Author: LuckRain7
 *  Date: 2020-04-28 20:44:49
 */

import { loadModules, loadCss } from "esri-loader"; // 异步加载模块
import config from "./config"; // 配置项
import { DataType } from "../utils/index"; // 工具函数

class ArcGIS {
  constructor() {
    this.map = null; // 地图
    this.baseMap = null; // 地图底图
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
        ]) => {
          this.baseMap = {
            vectorMap: new SDTDTLayer(), //矢量
            rasterMap: new SDRasterLayer(), //影像
            rasterMapAnnotation: new SDRSAnnoLayer(), //影像注记
            type: 1, // 1为矢量 | 2：影像
          };

          Parser.parse();

          // 设置初始化地图位置
          const startExtent = new Extent(
            ...config.startExtent,
            new SpatialReference({ wkid: 4490 })
          );

          //加载地图
          this.map = new Map($el, {
            extent: startExtent, // 初始化位置
            zoom: 10, // 缩放级别
            logo: false, // esri logo
            maxZoom: 18, // 最大缩放级别
            sliderPosition: "bottom-right", // 缩小放大按钮位置
          });
          this.map.addLayer(this.baseMap.vectorMap, 0);

          // 测量工具
          let measurement = new Measurement(
            {
              map: this.map,
              defaultLengthUnit: Units.KILOMETERS,
              defaultAreaUnit: Units.SQUARE_KILOMETERS,
            },
            document.getElementById("measureResult")
          );
          measurement.startup();
        }
      ) //end
      .catch((err) => {
        console.error(err);
      });
  }

  baseMapChange() {
    if (this.baseMap.type === 1) {
      this.addLayer(
        [this.baseMap.rasterMap, this.baseMap.rasterMapAnnotation],
        [0, 1]
      );
      this.removeLayer(this.baseMap.vectorMap);
      this.baseMap.type = 2;
    } else {
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
