<template>
  <div class="min-h-screen flex flex-col">
    <TheNavbar />
    <main class="flex-1 pt-[70px]">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
// 布局组件自动加载导航和页脚
</script>

