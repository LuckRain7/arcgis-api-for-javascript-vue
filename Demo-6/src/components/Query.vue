<!--
 * @Description: 属性查询框
 * @Author: LuckRain7
 * @Date: 2020-05-19 17:57:27
-->

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
        <template v-for="(item, index) in attributeQueryData">
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
    attributeQueryData: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
};
</script>
