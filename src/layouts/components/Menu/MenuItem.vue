<template>
  <!-- 单栏目 -->
  <el-menu-item
    class="sub-menu"
    :key="item.path"
    :index="item.path"
    v-if="!item.children"
  >
    <img
      class="menu-icon"
      v-if="item.icon"
      :src="item.icon"
      style="width: 16px; height: 16px"
      alt=""
    />
    <template #title>
      <span class="title" style="font-size: 15px">
        {{ item.meta.title }}
      </span>
    </template>
  </el-menu-item>
  <!-- 有子栏目 -->
  <el-sub-menu v-else :index="item.path" class="sub-menu-item">
    <template #title>
      <img class="menu-icon" v-if="item.icon" :src="item.icon" />
      <span class="title" style="font-size: 15px">{{ item.meta.title }}</span>
    </template>
    <template v-for="(option, index) in item.children">
      <menu-item v-if="option.children" :key="option.path" :item="option" />
      <el-menu-item v-else :index="option.path" :key="index">
        <span class="title" style="font-size: 14px">
          {{ option.meta.title }}
        </span>
      </el-menu-item>
    </template>
  </el-sub-menu>
</template>

<script>
export default {
  name: "MenuItem",
};
</script>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>
<style lang="scss" scoped>
:deep(.el-menu-item) {
  height: 60px;
  padding-left: 55px !important;
  background-color: #202732;
}

:deep(.el-icon) {
  font-size: 16px !important;
}

.sub-menu-item {
  &.is-active {
    :deep(.el-sub-menu__title) {
      color: #fff !important;
    }
  }
}

.menu-icon,
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px !important;
  height: 22px !important;
  object-fit: cover;
  margin-right: 13px;
  visibility: initial !important;
}
</style>
