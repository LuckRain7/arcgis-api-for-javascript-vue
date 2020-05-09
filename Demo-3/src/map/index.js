/*
 *  Description: 导出文件
 *  Author: LuckRain7
 *  Date: 2020-05-07 17:08:50
 */

import ArcGIS from "./init.js";
import { drawInit, drawActive } from "./modules/draw.js";
import { MeasurementClose } from "./modules/Measurement.js";

// 导入标绘功能
ArcGIS.prototype.drawInit = drawInit;
ArcGIS.prototype.drawActive = drawActive;
ArcGIS.prototype.MeasurementClose = MeasurementClose;

export default ArcGIS;
