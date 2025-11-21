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

const { t } = useI18n()

// SEO
useHead({
  title: t('site.name') + ' - Boom Beach Private Server',
  meta: [
    { name: 'description', content: t('hero.subtitle') }
  ]
})
</script>

<style scoped lang="sass">
.home-page
  overflow-x: hidden
</style>

