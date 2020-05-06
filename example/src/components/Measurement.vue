<!--
 * @Description: 测量组件
 * @Author: LuckRain7
 * @Date: 2020-05-06 18:16:28
 -->
<template>
  <div class="measurementdiv" v-show="show">
    <div class="div-header">
      <span class="title">测量组件</span>
      <span class="close" @click="close">X</span>
    </div>
    <div id="measurement"></div>
  </div>
</template>

<script>
export default {
  name: "Measurement",
  data() {
    return {
      // show: true,
    };
  },
  props: {
    show: Boolean,
  },
  methods: {
    close() {
      this.show = false;
    },
  },
};
</script>
