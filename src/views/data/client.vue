<template>
  <div>
    <MerchantCpn
      :searchPlaceholder="'可输入客户名称进行查询'"
      :identiryName="'客户'"
    />
  </div>
</template>

<script setup>
import MerchantCpn from "@/components/merchant-cpn.vue";
</script>

<style lang="scss" scoped></style>
