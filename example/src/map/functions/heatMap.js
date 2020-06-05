/*
 *  Description: 热力图基本模板
 *  Author: LuckRain7
 *  Date: 2020-05-30 10:01:40
 */
function heatMapFunc(FeatureLayer, HeatmapRenderer, serverUrl, that) {
  console.log(1);

  let doctorNumFlayer = new FeatureLayer(
    serverUrl().fenxi.xiangcunyisheng + "/0",
    {
      outFields: ["*"], //必须要有返回值，提供给热力图进行分析
    }
  );

  let heatmapRenderer = new HeatmapRenderer({
    field: "yiliao", // 根据哪一个字段进行渲染
    blurRadius: 12, //蓝色
    colors: [
      "rgba(30,144,255, 0)",
      "rgba(30,144,255,0.8)",
      "rgb(0, 255, 0)",
      "rgb(255, 255, 0)",
      "rgb(255, 0, 0)",
    ],
  });
  doctorNumFlayer.setRenderer(heatmapRenderer);

  that.map.addLayer(doctorNumFlayer); // 将热力图分析添加到地图上
}

export default heatMapFunc;
