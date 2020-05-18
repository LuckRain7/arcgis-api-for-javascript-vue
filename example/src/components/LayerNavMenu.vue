<!--
 * @Description:  
 * @Author: LuckRain7
 * @Date: 2020-05-17 21:33:07
-->
<template>
  <div class="layer-nav-menu">
    <div class="title">图层列表</div>
    <div class="layer-tree">
      <!-- multiple 是否可以多选-->
      <!-- show-line 是否显示线-->
      <!--  -->
      <a-tree
        v-model="checkedKeys"
      
        multiple
        :show-line="showLine"
        :show-icon="showIcon"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        @expand="onExpand"
        @select="onSelect"
        @check="onCheck"
      >
        <a-icon slot="switcherIcon" type="down" />
        <a-icon slot="smile" type="smile-o" />
        <a-icon slot="meh" type="smile-o" />
        <template slot="custom" slot-scope="{ selected }">
          <a-icon :type="selected ? 'frown' : 'frown-o'" />
        </template>
      </a-tree>
    </div>
  </div>
</template>

<script>
import { treeData } from "../assets/data.js";

export default {
  data() {
    return {
      expandedKeys: ["huinong"], // 默认展开
      autoExpandParent: true,
      //   checkedKeys: ["0-0-0"],
      checkedKeys: [], // 默认勾选
      selectedKeys: [], // 默认选中
      treeData, // 渲染数据
      checkedArrayJudge: [],
      selectedArrayJudge: [],
      showLine: true,
      showIcon: false,
    };
  },
  watch: {},

  methods: {
    /* ^_^ */

    // 展开与收缩
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },

    // 选择
    onSelect(selectedKeys, info) {
      // console.log(selectedKeys);
      // console.log(info);

      const { selected } = info;
      let changeArray = [];

      if (selected) {
        // 提取增加的内容
        changeArray = selectedKeys.filter((item) => {
          return !this.selectedArrayJudge.some((x) => x == item);
        });
        console.log("添加了：：", changeArray);
      } else {
        // 提取减少的内容
        changeArray = this.selectedArrayJudge.filter((item) => {
          return !selectedKeys.some((x) => x == item);
        });
        console.log("删除了：：", changeArray);
      }

      // console.log(this.selectedKeys);

      this.selectedKeys = selectedKeys;
      this.selectedArrayJudge = selectedKeys;
    },

    // 检查
    onCheck(checkedKeys, info) {
      console.log(checkedKeys);
      console.log(info);

      // let changeArray = []; // 变化内容数组
      // const { checked } = info; // 判断是添加还是减少

      // if (checked) {
      //   // 提取增加的内容
      //   changeArray = checkedKeys.filter((item) => {
      //     return !this.checkedArrayJudge.some((x) => x == item);
      //   });
      // } else {
      //   // 提取减少的内容
      //   changeArray = this.checkedArrayJudge.filter((item) => {
      //     return !checkedKeys.some((x) => x == item);
      //   });
      // }

      // console.log(changeArray);
      // // 过滤一级目录

      // this.checkedKeys = checkedKeys;
      // // 添加到判断数组（记录上一次的结果，与这一次的进行比较）
      // this.checkedArrayJudge = checkedKeys;
    },
  },
};
</script>
