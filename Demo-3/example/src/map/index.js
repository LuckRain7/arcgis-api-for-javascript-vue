/*
 * @Author       : 震雨 LuckRain7
 * @Date         : 2020-12-15 11:04:21
 * @LastEditTime : 2020-12-15 11:28:00
 * @Description  : 导出出口
 * @ Love and Peace
 */
import ArcGIS from "./init.js";
import { baseMapChange } from "./modules/BaseMap";
import { addLayer, removeLayer } from "./modules/LayerControl.js";
import { MeasurementClose } from "./modules/Measurement.js";
import { drawInit, drawActive } from "./modules/Draw.js";

// 图层切换
ArcGIS.prototype.baseMapChange = baseMapChange;

// 图层控制
ArcGIS.prototype.addLayer = addLayer;
ArcGIS.prototype.removeLayer = removeLayer;

// 测量
ArcGIS.prototype.MeasurementClose = MeasurementClose;

// 标绘
ArcGIS.prototype.drawInit = drawInit;
ArcGIS.prototype.drawActive = drawActive;

export default ArcGIS;
