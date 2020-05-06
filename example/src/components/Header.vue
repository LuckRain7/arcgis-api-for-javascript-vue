<!--
 * @Description: 头部组件
 * @Author: LuckRain7
 * @Date: 2020-05-06 11:16:41
 -->
<template>
  <div class="header">
    Vue + ArcGIS API for JavaScript 教程 DEMO
  </div>
</template>

<script>
export default {
  name: "header",
};
</script>

<style lang="less">
@height: 70px;
.header {
  height: @height;
  line-height: @height;
  width: 100%;
  text-align: center;
  font-size: 30px;

  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
</style>
