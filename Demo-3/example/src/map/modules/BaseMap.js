/*
 * @Author       : 震雨 LuckRain7
 * @Date         : 2020-12-15 11:02:24
 * @LastEditTime : 2020-12-15 11:13:53
 * @Description  : 底图切换
 * @ Love and Peace
 */

const name = "baseMapChange";

const baseMapChange = function baseMapChange(type) {
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
};

export { name, baseMapChange };
