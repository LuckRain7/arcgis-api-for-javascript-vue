/*
 * @Author       : 震雨 LuckRain7
 * @Date         : 2020-12-15 11:26:57
 * @LastEditTime : 2020-12-15 11:27:01
 * @Description  : 测量模块
 * @ Love and Peace
 */

// 关闭测量工具
const MeasurementClose = function MeasurementClose() {
  this.measurement.clearResult(); // 清除测量图案
  // 拿到开启的工具名称 并关闭已开启的工具
  this.measurement.getTool() &&
    this.measurement.setTool(this.measurement.getTool().toolName, false);
};

export { MeasurementClose };
