<script setup lang="ts">
import { useRouterPush } from '@/hooks/common/router';
const { routerPush } = useRouterPush();
const openUrl = () => {
  console.log('跳转');
  routerPush('/g-test/menu-test?id=12&ss=9992');
};
</script>

<template>
  <div>
    <NButton @click="openUrl">测试</NButton>
  </div>
</template>
