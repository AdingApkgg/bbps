<template>
  <div class="home-page">
    <HeroSection />
    <ServerStats />
    <CtaSection />
    <CommentsSection />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// 设置英文语言
locale.value = 'en'

// SEO
useHead({
  title: 'BBPS - Boom Beach Private Server',
  meta: [
    { name: 'description', content: 'Unlimited Resources, Forever Free!' }
  ]
})
</script>

<style scoped lang="sass">
.home-page
  overflow-x: hidden
</style>

