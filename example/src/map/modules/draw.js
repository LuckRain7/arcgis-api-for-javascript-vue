/*
 *  Description: 标绘工具
 *  Author: LuckRain7
 *  Date: 2020-05-07 17:05:55
 */
import { loadModules } from "esri-loader";
import config from "../config";

function drawInit() {
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
        this.Graphic = Graphic;
        this.Draw = Draw;
        this.SimpleMarkerSymbol = SimpleMarkerSymbol;
        this.SimpleLineSymbol = SimpleLineSymbol;
        this.SimpleFillSymbol = SimpleFillSymbol;

        // 添加图形图层
        this.DrawGraphics = new GraphicsLayer({ id: "drawLayer" });
        // 设置图层坐标系
        this.DrawGraphics.SpatialReference = new this.SpatialReference({
          wkid: 4490,
        });
        // 将图层加载到地图上，图层设置为 7
        this.map.addLayer(this.DrawGraphics, 7);

        // 实例化画图
        this.draw = new Draw(this.map);

        //定义图形样式（自定义）(这里使用默认样式)
        this.draw.markerSymbol = new SimpleMarkerSymbol();
        this.draw.lineSymbol = new SimpleLineSymbol();
        this.draw.fillSymbol = new SimpleFillSymbol();

        // 添加画图的监听事件
        this.draw.on("draw-complete", drawEndEvent.bind(this));
      }
    )
    .catch((err) => {
      console.error(err);
    });
}

// 内置函数 画完后将图形加载到图形图层
function drawEndEvent(evt) {
  //添加图形到地图
  let symbol;
  if (evt.geometry.type === "point" || evt.geometry.type === "multipoint") {
    symbol = this.draw.markerSymbol;
  } else if (evt.geometry.type === "line" || evt.geometry.type === "polyline") {
    symbol = this.draw.lineSymbol;
  } else {
    symbol = this.draw.fillSymbol;
  }
  // 获取图形样式
  let tx = this.Graphic(evt.geometry, symbol);
  // 将图形样式加载到地图上
  this.DrawGraphics.add(tx);
}

// 设置所画图形
function drawActive(type) {
  let tool = null;
  switch (type) {
    case "POINT":
      tool = "POINT";
      break;
    case "POLYLINE":
      tool = "POLYLINE";
      break;
    case "POLYGON":
      tool = "POLYGON";
      break;
    case "CIRCLE":
      tool = "CIRCLE";
      break;
    case "RECTANGLE":
      tool = "RECTANGLE";
      break;
    case "stop":
      this.draw.deactivate(); // 停止画图
      break;
    case "delete":
      this.draw.deactivate(); // 停止画图
      this.DrawGraphics.clear(); // 清除图层
      break;
  }
  if (tool !== null) {
    this.draw.activate(this.Draw[tool]); //激活对应的绘制工具
  }
}

export { drawInit, drawActive };
