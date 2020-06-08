/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-06-08 16:01:56
 */

// 点标注
function label(SimpleMarkerSymbol, SimpleLineSymbol, EsriColor) {
  // buffer 标记点图形
  const bufferPoint = new SimpleMarkerSymbol(
    SimpleMarkerSymbol.STYLE_SQUARE,
    10,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new EsriColor([255, 0, 0]),
      1
    ),
    new EsriColor([0, 255, 0, 0.25])
  );

  return {
    bufferPoint,
  };
}

export default label;
