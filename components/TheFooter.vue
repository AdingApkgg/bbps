<template>
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-stats">
        <span>{{ t('footer.pageviews') }}: <strong id="busuanzi_value_site_pv">-</strong></span>
        <span>{{ t('footer.visitors') }}: <strong id="busuanzi_value_site_uv">-</strong></span>
      </div>

      <div class="footer-copyright">
        <p>
          © <a
            href="https://space.bilibili.com/87969522"
            target="_blank"
            class="footer-link"
          >
            {{ t('footer.author') }}
          </a>
        </p>
        <p class="copyright-notice">
          Boom Beach {{ t('footer.trademark') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

onMounted(() => {
  // 加载不蒜子统计
  const script = document.createElement('script')
  script.src = 'https://registry.npmmirror.com/js-asuna/latest/files/js/bsz.pure.mini.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<style scoped lang="sass">
@use 'sass:color'

.footer
  background: linear-gradient(135deg, $military-green-dark 0%, $black 100%)
  color: $white
  padding: $spacing-lg $spacing-md
  border-top: 3px solid $sand-yellow
  margin-top: $spacing-xl

.footer-container
  display: flex
  flex-direction: column
  align-items: center
  gap: $spacing-sm
  text-align: center

.footer-stats
  display: flex
  gap: $spacing-lg
  font-size: $font-size-sm
  color: $light-gray

  span
    display: flex
    align-items: center
    gap: $spacing-xs

  strong
    color: $sand-yellow
    font-weight: 700

.footer-copyright
  font-size: $font-size-sm
  color: $gray

.footer-link
  color: $sand-yellow
  text-decoration: none
  font-weight: 600
  transition: color $transition-base

  &:hover
    color: color.adjust($sand-yellow, $lightness: 15%)

.copyright-notice
  margin-top: $spacing-xs
  font-size: $font-size-xs
  color: $gray
  opacity: 0.8

@media (max-width: $breakpoint-sm)
  .footer-stats
    flex-direction: column
    gap: $spacing-xs
</style>

