<template>
  <div>
    <MerchantCpn
      :searchPlaceholder="'可输入贸易商名称进行查询'"
      :identiryName="'贸易商'"
    />
  </div>
</template>

<script setup>
import MerchantCpn from "@/components/merchant-cpn.vue";
</script>

<style lang="scss" scoped></style>
