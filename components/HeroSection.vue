<template>
  <section class="hero">
    <div class="hero-bg" />
    <div class="container hero-container">
      <div class="hero-content">
        <h1 class="hero-title">
          {{ t('hero.title') }}
        </h1>

        <div class="hero-video">
          <video
            src="https://r2.30hb.cn/hero.mp4"
            poster="https://r2.30hb.cn/hero.avif"
            controls
            loop
            playsinline
            class="video-player"
          />
        </div>

        <div class="hero-actions">
          <a
            href="https://30hb.cn/latest"
            class="btn btn-primary btn-lg"
          >
            <span class="btn-icon">⚡</span>
            {{ t('hero.download') }}
          </a>
          <a
            href="https://drive.30hb.cn"
            target="_blank"
            class="btn btn-military btn-lg"
          >
            <span class="btn-icon">🎮</span>
            {{ t('hero.moreServers') }}
          </a>
        </div>

        <div class="hero-badge">
          <span class="badge badge-lg">
            <span class="badge-icon">🎁</span>
            <strong>{{ t('hero.freeBadge') }}</strong>{{ t('hero.noPayment') }}
          </span>
        </div>
      </div>
    </div>

    <!-- 装饰元素 -->
    <div class="hero-decorations">
      <div class="palm-tree left" />
      <div class="palm-tree right" />
      <div class="waves" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="sass">
@use 'sass:color'

.hero
  position: relative
  min-height: 80vh
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden
  padding: $spacing-xl $spacing-md

.hero-bg
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: linear-gradient(135deg, color.adjust($primary-blue, $lightness: 20%) 0%, $primary-blue 50%, $primary-blue-dark 100%)
  
  &::before
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-image: radial-gradient(circle at 20% 30%, rgba(white, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(white, 0.08) 0%, transparent 50%)

.hero-container
  position: relative
  z-index: 10

.hero-content
  display: flex
  flex-direction: column
  align-items: center
  gap: $spacing-lg
  text-align: center
  max-width: 900px
  margin: 0 auto

.hero-title
  color: $white
  font-size: clamp($font-size-3xl, 5vw, $font-size-4xl)
  text-shadow: 3px 3px 0 rgba($military-green-dark, 0.5), 0 0 20px rgba($black, 0.3)
  animation: titleFloat 3s ease-in-out infinite
  margin-bottom: $spacing-md

@keyframes titleFloat
  0%, 100%
    transform: translateY(0)
  50%
    transform: translateY(-10px)

.hero-video
  width: 100%
  max-width: 700px
  border-radius: $radius-xl
  overflow: hidden
  box-shadow: $shadow-hard, 0 0 40px rgba($black, 0.3), inset 0 0 0 4px rgba(white, 0.2)
  border: 4px solid $sand-yellow
  transform: perspective(1000px) rotateY(0deg)
  transition: transform $transition-slow
  
  &:hover
    transform: perspective(1000px) rotateY(2deg) scale(1.02)

.video-player
  width: 100%
  height: auto
  display: block

.hero-actions
  display: flex
  flex-wrap: wrap
  gap: $spacing-md
  justify-content: center
  margin-top: $spacing-md

.btn-lg
  padding: $spacing-md $spacing-xl
  font-size: $font-size-xl
  
  .btn-icon
    margin-right: $spacing-xs
    font-size: $font-size-2xl

.hero-badge
  margin-top: $spacing-md

.badge-lg
  padding: $spacing-md $spacing-lg
  font-size: $font-size-lg
  box-shadow: $shadow-medium
  border: 3px solid $wood-brown-dark
  
  .badge-icon
    margin-right: $spacing-xs
    font-size: $font-size-xl
  
  strong
    color: $danger-red
    margin-right: $spacing-xs

.hero-decorations
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  pointer-events: none
  z-index: 1

.palm-tree
  position: absolute
  bottom: 0
  width: 120px
  height: 200px
  background: linear-gradient(to top, $wood-brown-dark 0%, $wood-brown-dark 60%, transparent 60%)
  opacity: 0.3
  
  &::before
    content: '🌴'
    position: absolute
    top: -20px
    left: 50%
    transform: translateX(-50%)
    font-size: 80px
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))
  
  &.left
    left: 5%
    transform: rotate(-5deg)
  
  &.right
    right: 5%
    transform: rotate(5deg) scaleX(-1)

.waves
  position: absolute
  bottom: 0
  left: 0
  width: 100%
  height: 80px
  background: linear-gradient(to top, rgba($primary-blue-dark, 0.6) 0%, transparent 100%)
  
  &::before, &::after
    content: ''
    position: absolute
    bottom: 0
    left: 0
    width: 200%
    height: 100%
    background: repeating-linear-gradient(90deg, transparent 0, rgba(white, 0.1) 50px, transparent 100px)
    animation: wave 10s linear infinite
  
  &::after
    animation-duration: 15s
    animation-direction: reverse
    opacity: 0.5

@keyframes wave
  0%
    transform: translateX(0)
  100%
    transform: translateX(-50%)

@media (max-width: $breakpoint-md)
  .hero
    min-height: 70vh
    padding: $spacing-lg $spacing-md
  
  .hero-title
    font-size: $font-size-2xl
  
  .hero-actions
    flex-direction: column
    width: 100%
    
    .btn-lg
      width: 100%
      max-width: 300px
  
  .palm-tree
    display: none
</style>
