<template>
  <section class="cta-section">
    <div class="cta-bg" />
    <div class="container cta-container">
      <div class="cta-content">
        <h2 class="cta-title">
          {{ t('cta.title') }}
        </h2>
        <p class="cta-description">
          {{ t('cta.description') }}
        </p>
        <a
          href="https://pd.qq.com/s/7e02qs92o"
          target="_blank"
          class="btn btn-gold btn-lg cta-button"
        >
          <span class="btn-icon">💬</span>
          {{ t('cta.joinQQ') }}
        </a>
      </div>

      <!-- 装饰图标 -->
      <div class="cta-icons">
        <div class="floating-icon" style="--delay: 0s; --x: -50px; --y: -30px;">
          ⚓
        </div>
        <div class="floating-icon" style="--delay: 1s; --x: 50px; --y: -20px;">
          🏝️
        </div>
        <div class="floating-icon" style="--delay: 2s; --x: -30px; --y: 40px;">
          💣
        </div>
        <div class="floating-icon" style="--delay: 1.5s; --x: 40px; --y: 50px;">
          🚢
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="sass">
.cta-section
  position: relative
  padding: calc($spacing-xl * 2) $spacing-md
  margin: $spacing-xl 0
  overflow: hidden

.cta-bg
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: $gradient-military

  &::before
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba($military-green-dark, 0.3) 20px, rgba($military-green-dark, 0.3) 40px)
    opacity: 0.1

  &::after
    content: ''
    position: absolute
    top: -50%
    left: -50%
    width: 200%
    height: 200%
    background: radial-gradient(circle, rgba(white, 0.1) 0%, transparent 70%)
    animation: rotate 30s linear infinite

@keyframes rotate
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)

.cta-container
  position: relative
  z-index: 10

.cta-content
  max-width: 700px
  margin: 0 auto
  text-align: center
  color: $white

.cta-title
  color: $white
  font-size: clamp($font-size-2xl, 4vw, $font-size-3xl)
  margin-bottom: $spacing-md
  text-shadow: 3px 3px 0 rgba($black, 0.3)
  animation: titlePulse 3s ease-in-out infinite

@keyframes titlePulse
  0%, 100%
    transform: scale(1)
  50%
    transform: scale(1.02)

.cta-description
  font-size: $font-size-lg
  line-height: 1.8
  margin-bottom: $spacing-xl
  color: rgba(white, 0.95)
  text-shadow: 1px 1px 2px rgba($black, 0.2)

.cta-button
  animation: buttonFloat 2s ease-in-out infinite

  &:hover
    animation-play-state: paused

@keyframes buttonFloat
  0%, 100%
    transform: translateY(0)
  50%
    transform: translateY(-5px)

.cta-icons
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  pointer-events: none

.floating-icon
  position: absolute
  top: 50%
  left: 50%
  font-size: $font-size-4xl
  opacity: 0.2
  animation: float 4s ease-in-out infinite
  animation-delay: var(--delay)
  transform: translate(var(--x), var(--y))
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))

@keyframes float
  0%, 100%
    transform: translate(var(--x), var(--y)) translateY(0) rotate(0deg)
  50%
    transform: translate(var(--x), var(--y)) translateY(-20px) rotate(10deg)

@media (max-width: $breakpoint-md)
  .cta-section
    padding: $spacing-xl $spacing-md

  .cta-title
    font-size: $font-size-2xl

  .cta-description
    font-size: $font-size-base

  .floating-icon
    font-size: $font-size-2xl
</style>
