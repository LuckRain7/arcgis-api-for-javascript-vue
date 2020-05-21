/*
 *  Description: 导出文件
 *  Author: LuckRain7
 *  Date: 2020-05-07 17:08:50
 */

import ArcGIS from "./init.js";
import { baseMapChange } from "./modules/BaseMap";
import { drawInit, drawActive } from "./modules/draw.js";
import { MeasurementClose } from "./modules/Measurement.js";
import { addLayer, removeLayer } from "./modules/LayerControl.js";
import { executeQueryTask } from "./modules/Query.js";

// 切换底图
ArcGIS.prototype.baseMapChange = baseMapChange;

// 导入标绘功能
ArcGIS.prototype.drawInit = drawInit;
ArcGIS.prototype.drawActive = drawActive;

// 导入测量功能
ArcGIS.prototype.MeasurementClose = MeasurementClose;

// 图层控制功能
ArcGIS.prototype.addLayer = addLayer;
ArcGIS.prototype.removeLayer = removeLayer;

// 查询
ArcGIS.prototype.executeQueryTask = executeQueryTask; // 属性查询
export default ArcGIS;
