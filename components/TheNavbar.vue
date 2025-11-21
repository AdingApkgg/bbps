<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="container navbar-container">
      <NuxtLink to="/" class="navbar-brand">
        <span class="brand-icon">⚓</span>
        <span class="brand-text">{{ t('site.name') }}</span>
      </NuxtLink>

      <!-- 移动端菜单按钮 -->
      <button 
        class="menu-toggle" 
        :class="{ 'active': mobileMenuOpen }"
        @click="toggleMobileMenu"
        :aria-label="t('nav.toggleMenu')"
      >
        <span />
        <span />
        <span />
      </button>

      <!-- 桌面端菜单 -->
      <div class="navbar-menu desktop-menu">
        <NuxtLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          :target="item.external ? '_blank' : undefined"
          class="nav-link"
        >
          {{ item.label }}
        </NuxtLink>
        
        <!-- 语言切换 -->
        <button @click="toggleLocale" class="locale-switcher">
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>
      </div>

      <!-- 移动端菜单 -->
      <Transition name="slide">
        <div v-if="mobileMenuOpen" class="navbar-menu mobile-menu">
          <NuxtLink 
            v-for="item in menuItems" 
            :key="item.path"
            :to="item.path"
            :target="item.external ? '_blank' : undefined"
            class="nav-link"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </NuxtLink>
          
          <button @click="toggleLocale" class="locale-switcher">
            {{ locale === 'zh' ? 'English' : '简体中文' }}
          </button>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const menuItems = computed(() => [
  { path: '/news/', label: t('nav.commands'), external: false },
  { path: 'https://webapi.30hb.cn/basebuilder/Layout-Builder.htm', label: t('nav.editor'), external: true },
  { path: 'https://drive.30hb.cn/%E8%9A%95%E8%B1%86%E6%9C%8D%E5%9C%B0%E5%9B%BE', label: t('nav.maps'), external: true },
  { path: 'https://blog.30hb.cn/', label: t('nav.blog'), external: true },
  { path: 'https://blog.30hb.cn/349/', label: t('nav.donate'), external: true },
  { path: 'https://blog.30hb.cn/links/', label: t('nav.team'), external: true }
])

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleLocale = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  closeMobileMenu()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="sass">
@use 'sass:color'

.navbar
  position: fixed
  top: 0
  left: 0
  right: 0
  z-index: 1000
  background: linear-gradient(135deg, $military-green 0%, $military-green-dark 100%)
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  transition: all $transition-base
  border-bottom: 3px solid $sand-yellow
  
  &.scrolled
    box-shadow: $shadow-hard
    border-bottom-width: 2px

.navbar-container
  display: flex
  align-items: center
  justify-content: space-between
  padding: $spacing-sm $spacing-md
  min-height: 70px

.navbar-brand
  display: flex
  align-items: center
  gap: $spacing-sm
  text-decoration: none
  color: $white
  font-family: $font-family-game
  font-size: $font-size-xl
  font-weight: 900
  text-transform: uppercase
  transition: transform $transition-base
  
  &:hover
    transform: scale(1.05)

.brand-icon
  font-size: $font-size-2xl
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))

.brand-text
  text-shadow: 2px 2px 0 rgba($black, 0.3)

.menu-toggle
  display: none
  flex-direction: column
  gap: 5px
  background: transparent
  border: none
  cursor: pointer
  padding: $spacing-xs
  z-index: 1001
  
  span
    display: block
    width: 28px
    height: 3px
    background: $white
    border-radius: 2px
    transition: all $transition-base
  
  &.active
    span:nth-child(1)
      transform: rotate(45deg) translate(7px, 7px)
    
    span:nth-child(2)
      opacity: 0
    
    span:nth-child(3)
      transform: rotate(-45deg) translate(7px, -7px)

.navbar-menu
  display: flex
  align-items: center
  gap: $spacing-md

.nav-link
  color: $white
  text-decoration: none
  font-weight: 600
  font-size: $font-size-sm
  text-transform: uppercase
  padding: $spacing-xs $spacing-sm
  border-radius: $radius-sm
  transition: all $transition-base
  position: relative
  
  &::after
    content: ''
    position: absolute
    bottom: 0
    left: 50%
    width: 0
    height: 2px
    background: $sand-yellow
    transition: all $transition-base
    transform: translateX(-50%)
  
  &:hover
    color: $sand-yellow
    
    &::after
      width: 80%

.locale-switcher
  background: $sand-yellow
  color: $military-green-dark
  border: none
  padding: $spacing-xs $spacing-sm
  border-radius: $radius-md
  font-weight: 700
  font-size: $font-size-sm
  cursor: pointer
  transition: all $transition-base
  box-shadow: $shadow-soft
  
  &:hover
    background: color.adjust($sand-yellow, $lightness: 10%)
    transform: translateY(-2px)
    box-shadow: $shadow-medium
  
  &:active
    transform: translateY(0)

.mobile-menu
  display: none

@media (max-width: $breakpoint-md)
  .menu-toggle
    display: flex
  
  .desktop-menu
    display: none
  
  .mobile-menu
    display: flex
    flex-direction: column
    position: fixed
    top: 70px
    left: 0
    right: 0
    background: $military-green-dark
    padding: $spacing-lg
    box-shadow: $shadow-hard
    border-bottom: 3px solid $sand-yellow
    gap: $spacing-sm
    
    .nav-link
      display: block
      padding: $spacing-sm
      text-align: center
      
      &::after
        display: none
    
    .locale-switcher
      margin-top: $spacing-sm

.slide-enter-active, .slide-leave-active
  transition: all $transition-base

.slide-enter-from
  transform: translateY(-20px)
  opacity: 0

.slide-leave-to
  transform: translateY(-20px)
  opacity: 0
</style>
