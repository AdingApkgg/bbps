<template>
  <nav class="navbar-game">
    <div class="container-bb">
      <div class="navbar-content">
        <!-- Logo -->
        <NuxtLink to="/" class="navbar-logo">
          <img
            src="/assets/images/logo/logo.avif"
            alt="海岛奇兵私服"
            class="navbar-logo-img"
          />
          <span class="navbar-title">{{ t('site.name') }}</span>
        </NuxtLink>

        <!-- 导航链接 - 桌面端 -->
        <div class="navbar-links">
          <NuxtLink to="/commands" class="navbar-link">
            {{ t('nav.commands') || '指令' }}
          </NuxtLink>
          <a href="https://drive.30hb.cn/" class="navbar-link">
            {{ t('nav.drive') || '网盘' }}
          </a>
          <a href="https://blog.30hb.cn/" class="navbar-link">
            {{ t('nav.blog') || '博客' }}
          </a>
          <a href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm" class="navbar-link">
            {{ t('nav.editor') || '地图编辑' }}
          </a>
        </div>

        <!-- 语言切换 -->
        <div class="navbar-actions">
          <button
            :class="['navbar-lang-btn', { 'active': locale === 'en' }]"
            @click="setLocale('en')"
          >
            EN
          </button>
          <button
            :class="['navbar-lang-btn', { 'active': locale === 'zh' }]"
            @click="setLocale('zh')"
          >
            中文
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

function setLocale(code: 'zh' | 'en') {
  locale.value = code
  navigateTo({
    path: code === 'en' ? '/en' : '/'
  })
}
</script>

<style scoped>
.navbar-game {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 35, 42, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 2rem;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: opacity 0.2s;
}

.navbar-logo:hover {
  opacity: 0.8;
}

.navbar-logo-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.navbar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #FFD60A;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.navbar-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
  white-space: nowrap;
}

.navbar-link:hover {
  color: #FFD60A;
}

.navbar-actions {
  display: flex;
  gap: 0.5rem;
}

.navbar-lang-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.navbar-lang-btn:hover,
.navbar-lang-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .navbar-content {
    gap: 1rem;
  }

  .navbar-title {
    font-size: 1rem;
  }

  .navbar-logo-img {
    width: 32px;
    height: 32px;
  }

  .navbar-lang-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>
