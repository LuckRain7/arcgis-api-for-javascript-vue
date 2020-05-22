/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-05-07 17:47:42
 */

// 关闭测量工具
function MeasurementClose() {
  this.measurement.clearResult(); // 清除测量图案
  // 拿到开启的工具名称 并关闭已开启的工具
  this.measurement.getTool() &&
    this.measurement.setTool(this.measurement.getTool().toolName, false);
}

export { MeasurementClose };
