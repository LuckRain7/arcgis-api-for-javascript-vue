/*
 *  Description: 查询模块
 *  Author: LuckRain7
 *  Date: 2020-05-21 22:16:11
 */

const name = "查询模块";

/*
 *  description: QueryTask 属性查询
 *  param {String}    url          查询服务地址
 *  param {Array}     layerIds     查询图层is
 *  param {String}    searchText   查询内容
 *  param {Function}  callback     回调函数
 *  return:  callback(feats)
 */
function executeQueryTask(options, callback) {
  const { url, layerIds, searchText } = options;
  console.log(options);

  let findTask = new this.FindTask(url); //创建属性查询对象

  let findParams = new this.FindParameters(); //创建属性查询参数
  findParams.returnGeometry = true; // true 返回几何信息
  // findParams.layerIds = [0, 1, 2]; // 查询图层id
  findParams.layerIds = layerIds; // 查询图层id
  findParams.searchFields = ["artel"]; // 查询字段 artel
  findParams.searchText = searchText; // 查询内容 artel = searchText

  // 执行查询对象
  findTask.execute(findParams).addCallback(function(result) {
    console.log("result::::", result);
    if (result.length < 1) return [];
    const feats = result.map((item) => {
      return item.feature.attributes;
    });
    console.log("feats::", feats);
    callback(feats);
  });
}
export { name, executeQueryTask };
