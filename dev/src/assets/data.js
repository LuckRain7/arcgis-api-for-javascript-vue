/*
 *  Description:
 *  Author: LuckRain7
 *  Date: 2020-05-18 23:04:19
 */

export const treeData = [
  {
    title: "惠农信息图层",
    key: "huinong",
    checkable: false,
    children: [
      {
        title: "合作社",
        key: "hezuoshe",
        checkable: false,
        selectable: false,
        children: [
          { title: "示范合作社", key: "shifan" },
          { title: "农机合作社", key: "nongji" },
          { title: "农民合作社", key: "nongmin" },
        ],
      },
      {
        title: "土壤",
        selectable: false,
        key: "turangleixing",
        checkable: false,
        children: [{ title: "土壤类型", key: "turangleixing" }],
      },

      {
        title: "水利设施",
        key: "shuilisheshi",
        checkable: false,
        children: [
          { title: "大中型水库", key: "max" },
          { title: "小型水库", key: "min" },
        ],
      },
      {
        title: "雨量分析",
        key: "雨量",
      },
    ],
  },
  {
    title: "社区信息图层",
    key: "社区",
    checkable: false,
    selectable: false,
    children: [{ title: "xx", key: "xx" }],
  },
  {
    title: "人才信息图层",
    key: "rencai",
    checkable: false,
    children: [{ title: "xx", key: "xx" }],
  },
  {
    title: "产业园区信息图层",
    key: "yuanqu",
    checkable: false,
    children: [{ title: "xx", key: "xx" }],
  },
  {
    title: "边界图层",
    key: "bianjie",
    checkable: false,
    children: [
      { title: "诸城边界", key: "bianjie-zhucheng" },
      { title: "社区边界", key: "bianjie-shequ" },
      { title: "乡镇边界", key: "bianjie-xiangzhen" },
    ],
  },
];

export const treeData2 = 1;
