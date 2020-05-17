<!--
 * @Description:  
 * @Author: LuckRain7
 * @Date: 2020-05-17 21:33:07
-->
<template>
  <div class="layer-nav-menu">
    <div class="title">图层列表</div>
    <div class="layer-tree">
      <a-tree
        v-model="checkedKeys"
        checkable
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        @expand="onExpand"
        @select="onSelect"
        @check="onCheck"
      />
    </div>
  </div>
</template>

<script>
const treeData = [
  {
    title: "惠农信息图层",
    key: "huinong",
    children: [
      {
        title: "合作社",
        key: "hezuoshe",
        children: [
          { title: "示范合作社", key: "shifan" },
          { title: "农机合作社", key: "nongji" },
          { title: "农民合作社", key: "nongmin" },
        ],
      },
      {
        title: "土壤类型",
        key: "turangleixing",
      },
      {
        title: "水利设施",
        key: "shuilisheshi",
        children: [
          { title: "大中型水库", key: "max" },
          { title: "小型水库", key: "min" },
        ],
      },
    ],
  },
  {
    title: "社区信息图层",
    key: "社区",
  },
  {
    title: "人才信息图层",
    key: "rencai",
  },
  {
    title: "产业园区信息图层",
    key: "yuanqu",
  },
  {
    title: "边界图层",
    key: "bianjie",
    children: [
      { title: "诸城边界", key: "bianjie-zhucheng" },
      { title: "社区边界", key: "bianjie-shequ" },
      { title: "乡镇边界", key: "bianjie-xiangzhen" },
    ],
  },
];
export default {
  data() {
    return {
      expandedKeys: ["huinong"], // 默认展开
      autoExpandParent: true,
      //   checkedKeys: ["0-0-0"],
      checkedKeys: [], // 默认勾选
      selectedKeys: [], // 默认选中
      treeData, // 渲染数据
    };
  },
  watch: {},
  methods: {
    onExpand(expandedKeys) {
      console.log("用户展开了", expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onSelect(selectedKeys, info) {
      console.log("用户选择了", info);
      this.selectedKeys = selectedKeys;
    },
    onCheck(checkedKeys, info) {
      console.log(checkedKeys);
      console.log(info);
      this.checkedKeys = checkedKeys;
    },
  },
};
</script>
