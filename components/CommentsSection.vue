<template>
  <section class="comments-section">
    <div class="container">
      <h2 class="section-title">{{ t('comments.title') }}</h2>
      <div id="waline" class="waline-wrapper"/>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

onMounted(async () => {
  // 动态加载 Waline CSS
  const walineCss = document.createElement('link')
  walineCss.rel = 'stylesheet'
  walineCss.href = 'https://registry.npmmirror.com/@waline/client/latest/files/dist/waline.css'
  document.head.appendChild(walineCss)

  // 动态加载 Waline JS
  const { init } = await import('https://registry.npmmirror.com/@waline/client/latest/files/dist/waline.js')

  const localeConfig = locale.value === 'zh' ? {
    nick: '昵称(可选)',
    mail: '邮箱(可选)',
    link: '网址(可选)',
    placeholder: '填写 QQ 号或邮箱可获取头像',
    requiredMeta: [],
    sofa: '评论区空空如也~',
    anonymous: '匿名的野猫',
    login: '登录(可选)'
  } : {
    nick: 'Nickname (optional)',
    mail: 'Email (optional)',
    link: 'Website (optional)',
    placeholder: 'Fill in QQ number or email to get avatar',
    requiredMeta: [],
    sofa: 'No comments yet~',
    anonymous: 'Anonymous',
    login: 'Login (optional)'
  }

  init({
    el: '#waline',
    serverURL: 'https://waline.saop.cc',
    path: 'disk.saop.cc',
    pageview: false,
    locale: localeConfig,
    emoji: [
      '//registry.npmmirror.com/@waline/emojis/latest/files/alus',
      '//registry.npmmirror.com/@waline/emojis/latest/files/bilibili',
      '//registry.npmmirror.com/@waline/emojis/latest/files/bmoji',
      '//registry.npmmirror.com/@waline/emojis/latest/files/qq',
      '//registry.npmmirror.com/@waline/emojis/latest/files/tieba',
      '//registry.npmmirror.com/@waline/emojis/latest/files/tw',
      '//registry.npmmirror.com/@waline/emojis/latest/files/weibo',
      '//registry.npmmirror.com/@waline/emojis/latest/files/soul-emoji'
    ],
    reaction: true
  })
})
</script>

<style scoped lang="sass">
.comments-section
  padding: $spacing-xl $spacing-md
  background: $white

.section-title
  text-align: center
  color: $military-green-dark
  margin-bottom: $spacing-xl

.waline-wrapper
  max-width: 800px
  margin: 0 auto
  padding: $spacing-lg
  background: $off-white
  border-radius: $radius-lg
  box-shadow: $shadow-soft
  border: 2px solid $sand-beige

@media (max-width: $breakpoint-md)
  .waline-wrapper
    padding: $spacing-md
</style>

