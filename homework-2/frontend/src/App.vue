<script setup lang="ts">
import { onMounted } from 'vue';
import { useTheme } from './composables/useTheme';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<template>
  <router-view></router-view>
</template>

<style lang="scss">
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

body {
  &:not(.monaco-enable-motion) {
    display: block;
  }
}
</style>
