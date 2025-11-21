<template>
  <div class="app-layout">
    <TheNavbar />
    <main class="main-content">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
// 布局组件自动加载导航和页脚
</script>

<style scoped lang="sass">
.app-layout
  min-height: 100vh
  display: flex
  flex-direction: column

.main-content
  flex: 1
  padding-top: 70px
</style>

