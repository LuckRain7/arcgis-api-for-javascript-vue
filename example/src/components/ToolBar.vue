<!--
 * @Description: 工具条
 * @Author: LuckRain7
 * @Date: 2020-05-06 16:54:57
 -->
<template>
  <div class="toolbar">
    <!-- 使用按钮组 -->
    <a-button-group>
      <!-- 地图切换按钮 -->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="baseMapChange(1)">
            矢量
          </a-menu-item>
          <a-menu-item key="2" @click="baseMapChange(2)">
            影像
          </a-menu-item>
        </a-menu>
        <a-button type="primary">
          <a-icon type="global" />底图 <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 地图切换按钮 END-->

      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="measurement(1)">
            开始测量
          </a-menu-item>
          <a-menu-item key="2" @click="measurement(0)">
            取消测量
          </a-menu-item>
        </a-menu>
        <a-button type="primary">
          <a-icon type="tool" />测量 <a-icon type="down" />
        </a-button>
      </a-dropdown>

      <!-- 标绘 GO-->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="draw('POINT')">
            点
          </a-menu-item>
          <a-menu-item key="2" @click="draw('POLYLINE')">
            线
          </a-menu-item>
          <a-menu-item key="3" @click="draw('POLYGON')">
            面
          </a-menu-item>
          <a-menu-item key="4" @click="draw('CIRCLE')">
            圆形
          </a-menu-item>
          <a-menu-item key="5" @click="draw('RECTANGLE')">
            长方形
          </a-menu-item>
          <a-menu-item key="6" @click="draw('stop')">
            停止标绘
          </a-menu-item>
          <a-menu-item key="7" @click="draw('delete')">
            清除标绘
          </a-menu-item>
        </a-menu>
        <a-button type="primary">
          <a-icon type="highlight" />标绘 <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 标绘 END-->

      <!-- 空间查询 GO-->
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="spatialQuery('POINT')">
            点查询
          </a-menu-item>
          <a-menu-item key="2" @click="spatialQuery('RECTANGLE')">
            面查询
          </a-menu-item>
          <a-menu-item key="3" @click="spatialQuery('CIRCLE')">
            圆形查询
          </a-menu-item>
          <a-menu-item key="4" @click="spatialQuery('POLYGON')">
            多边形查询
          </a-menu-item>
        </a-menu>
        <a-button type="primary">
          <a-icon type="file-search" />空间查询 <a-icon type="down" />
        </a-button>
      </a-dropdown>
      <!-- 空间查询 END-->

      <a-button type="primary" @click="attributeQuery">
        <a-icon type="file-search" />属性查询
      </a-button>

      <a-button type="primary" @click="showLegend">
        <a-icon type="unordered-list" />图例
      </a-button>

      <a-button type="primary" @click="showLayerList">
        <a-icon type="database" />图层
      </a-button>
    </a-button-group>
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  methods: {
    // 开启测量
    measurement(type) {
      this.$emit("measurement", type);
    },
    // 底图切换
    baseMapChange(type) {
      this.$emit("baseMapChange", type);
    },
    // 标绘
    draw(type) {
      this.$emit("draw", type);
    },
    // 显示图例
    showLegend() {
      this.$emit("showLegend");
    },
    // 显示图层
    showLayerList() {
      this.$emit("showLayerList");
    },
    // 空间查询
    spatialQuery(type) {
      this.$emit("spatialQuery", type);
    },
    // 属性查询
    attributeQuery() {
      this.$emit("spatialQuery");
    },
  },
};
</script>

<style lang="less">
.toolbar {
  position: absolute;
  top: 80px;
  right: 40px;
  height: 40px;
  width: auto;
  z-index: 99;
}
</style>
