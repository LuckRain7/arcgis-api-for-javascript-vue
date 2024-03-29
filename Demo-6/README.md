# 🌍 6、实现 ArcGIS Server 地图服务信息查询 - 属性查询

Demo-5 中我们实现了空间查询，这里我们进行属性查询代码编写。

**信息查询分为两个类**

- 空间查询：点击地图查询对应区域的要素信息。（ QueryTask，IdentifyTask ）
- 属性查询：通过对某个属性进行模糊匹配，在地图显示对应元素。（ [FindTask](#1---findtask)、[QueryTask](#2---querytask) ）
  - FindTask ：多用于多字段的模糊匹配
  - QueryTask : 多用于数值的区间查询、字段的精准匹配。

## 1. FindTask

首先创建一个属性查询组件(src\components\Query.vue)，用于接收查询的变量及展示查询结果。

> ps : 此组件会在后续使用中不断的优化，此代码是简单的例子代码

```vue
<template>
  <div class="a-query">
    <div class="title">
      <span>属性查询</span>
      <a-icon type="close" class="title-icon" />
    </div>

    <div class="query-main">
      <div>
        <a-input-search
          placeholder="input search text"
          enter-button
          @search="onSearch"
        />
      </div>
      <div class="query-content">
        查询内容：
        <template v-for="(item, index) in queryTaskData">
          <div :key="index">
            <div
              style="color:red;height:40px;text-align:center;line-height:40px"
            >
              搜索内容{{ index }}
            </div>
            <template v-for="(item2, index2) in Object.keys(item)">
              <div :key="index2">{{ item2 }}::{{ item[item2] }}</div>
            </template>
          </div>
          <!-- <div :key="index">{{ Object.keys(item) }}</div> -->
        </template>
      </div>
      <div><br /><br /></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    onSearch(value) {
      this.$emit("attributeQueryOnSearch", value);
    },
  },
  props: {
    queryTaskData: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
};
</script>
```

**在 src\map\init.js 中引入`FindTask`、 `FindParameters` 两个模块**

```diff
loadModules(
  [
+    "esri/tasks/FindTask",
+    "esri/tasks/FindParameters",
  ],
  config.loadConfig
)
  .then(
    ([
+      FindTask, // FindTask 属性查询
+      FindParameters,// FindTask 属性查询参数
    ])=> {
    // 缓存属性查询类
+    this.FindTask = FindTask;
+    this.FindParameters = FindParameters;
    }
```

**创建 src\map\modules\Query.js 查询模块，封装查询函数。**

```javascript
const name = "查询模块";

/*
 *  description: FindTask 属性查询
 *  param {String}    url          查询服务地址
 *  param {Array}     layerIds     查询图层is
 *  param {String}    searchText   查询内容
 *  param {Function}  callback     回调函数
 *  return:  callback(feats)
 */
function executeFindTask(options, callback) {
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
  findTask.execute(findParams).addCallback(function (result) {
    console.log("result::::", result);
    if (result.length < 1) return [];
    const feats = result.map((item) => {
      return item.feature.attributes;
    });
    console.log("feats::", feats);
    callback(feats);
  });
}
export { name, executeFindTask };
```

在模块化中导入 src\map\index.js

```diff
+ import { executeFindTask } from "./modules/Query.js";

+ ArcGIS.prototype.executeFindTask = executeFindTask; // 属性查询
```

在页面( src\App.vue )中引入组件并执行对应的查询函数

> ps : 以下代码为核心添加代码。

```vue
<template>
  <!-- 属性查询框 -->
  <Query
    @attributeQueryOnSearch="attributeQueryOnSearch"
    :queryTaskData="queryTaskData"
  ></Query>
</template>
<script>
 // 导入
import Query from "./components/Query.vue";
import url from "../server.url.config.js";

 methods:{
     attributeQueryOnSearch(searchText) {
       console.log("查询内容::::", searchText);
       // 查询并接回调函数
       Map.executeFindTask(
         {
           url: url().huinong.hezuoshe,
           layerIds: [0, 1, 2],
           searchText: searchText,
         },
         (res) => {
           console.log(res);
           this.queryTaskData = res;
         }
       );
     },
 },
</script>
```

效果：（💛 动图较大，请耐心等待）

![](https://luckrain7.github.io/arcgis-api-for-javascript-vue/Demo-6/FindTask.gif)

## 2.  QueryTask

在 src\map\init.js 中引入`query`、 `QueryTask` 两个模块**

```diff
loadModules(
  [
+    "esri/tasks/query",
+    "esri/tasks/QueryTask",
  ],
  config.loadConfig
)
  .then(
    ([
+      Query, // Query 查询
+      QueryTask,// QueryTask 查询
    ])=> {
    // Query 综合查询
+    this.Query = Query;
+    this.QueryTask = QueryTask;
    }
```

**创建 src\map\modules\Query.js 查询模块，封装查询函数。**

```javascript
/*
 *  description: 基于 QueryTask 的属性查询
 *  param {String}    url          查询服务地址
 *  param {Array}     layerId      查询图层id
 *  param {String}    searchText   查询内容
 *  param {Function}  callback     回调函数
 *  return:  callback(feats)
 */
function executeQueryTaskByAttribute(options, callback) {
  const { url, layerId, searchText } = options;

  // 初始化查询实例和参数
  let queryTask = new this.QueryTask(url + "/" + layerId);
  let query = new this.Query();

  query.where = `artel = '${searchText}'`; // 类 sql 的查询语句
  query.outFields = ["*"]; // 返回的字段信息 *:返回全部字段
  query.returnGeometry = true; // 返回几何形状
  console.log(111111);

  //执行属性查询
  queryTask.execute(query).addCallback(function(result) {
    const { features } = result;
    if (features.length < 1) return;

    const feats = features.map((item) => {
      return item.feature.attributes;
    });

    callback(feats);
  });
}

export {  executeFindTask, executeQueryTaskByAttribute };
```

在模块化中导入 src\map\index.js

```diff
+ import { executeQueryTaskByAttribute } from "./modules/Query.js";

+ ArcGIS.prototype.executeQueryTaskByAttribute = executeQueryTaskByAttribute; // 属性
```

在页面( src\App.vue )中引入组件并执行对应的查询函数

```javascript
<template>
  <!-- 属性查询框 -->
  <Query
    @attributeQueryOnSearch="attributeQueryOnSearch"
    :queryTaskData="queryTaskData"
  ></Query>
</template>
<script>
 // 导入
import Query from "./components/Query.vue";
import url from "../server.url.config.js";

 methods:{
     attributeQueryOnSearch(searchText) {
       console.log("查询内容::::", searchText);
       // 查询并接回调函数
        Map.executeQueryTaskByAttribute(
          {
            url: url().huinong.hezuoshe,
            layerId: "0",
            searchText: searchText,
          },
          (res) => {
            console.log(res);
            this.attributeQueryData = res;
          }
        );
     },
 },
</script>
```



<br>

[🚀 返回首页](https://github.com/LuckRain7/arcgis-api-for-javascript-vue)
