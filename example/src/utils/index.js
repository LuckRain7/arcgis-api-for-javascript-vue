/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-05-06 11:28:32
 */
/*
 *
 *
 *  lowObjToArray | 把对象转换成数组(浅转换)
 */

/*
 *  description: 把对象转换成数组(浅转换)
 *  param {object} obj
 *  return: array{key:key,value:value}
 */
export function lowObjToArray(obj) {
  let array = [];
  Object.keys(obj).map((key) => {
    array.push({
      key: key,
      value: obj[key],
    });
  });
  return array;
}

//DataType("young"); // "string"
//DataType(20190214); // "number"
//DataType(true); // "boolean"
//DataType([], "array"); // true
//DataType({}, "array"); // false
export function DataType(tgt, type) {
  const dataType = Object.prototype.toString
    .call(tgt)
    .replace(/\[object (\w+)\]/, "$1")
    .toLowerCase();
  return type ? dataType === type : dataType;
}
