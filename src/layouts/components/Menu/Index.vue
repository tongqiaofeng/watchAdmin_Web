<template>
  <el-scrollbar>
    <!--  :default-openeds="openeds" -->
    <el-menu
      :default-active="route.path"
      :collapse-transition="false"
      :background-color="'#202732'"
      :unique-opened="true"
      :collapse="false"
      :text-color="'#b7bdc6'"
      :active-text-color="'#94FFF1'"
      router
      style="z-index: 999; padding-top: 40px"
      :mode="'vertical'"
    >
      <template v-for="item in constantRoutes[1].children" :key="item.path">
        <MenuItem :item="item" />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import MenuItem from "./MenuItem.vue";
import { constantRoutes } from "@/router/index";

const router = useRouter();
const route = useRoute();

const defaultActive = computed(() => {
  console.log(router);
  const { fullPath } = router.currentRoute.value;
  return fullPath || "/index";
});

const openeds = ref([
  "/index",
  "/data",
  "/purchase",
  "/sale",
  "/stock",
  "/bill",
  "/company",
]);
</script>

<style lang="scss" scoped>
:deep(.el-menu-item.is-active) {
  background-color: #1b403b !important;
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #b7bdc6 !important;
}
</style>
