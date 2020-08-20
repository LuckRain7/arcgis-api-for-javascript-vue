<!--
 * @Description:  
 * @Author: LuckRain7
 * @Date: 2020-06-08 09:01:59
-->
<template>
  <div class="content-buffer">
    <div class="title">
      缓冲区查询内容
    </div>
    <div class="main-content"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }, 
    },
  },
};
</script>

<style></style>
