<template>
  <section class="hero-game">
    <!-- 游戏背景 -->
    <div class="hero-bg" />

    <div class="container-bb">
      <div class="hero-content">
        <!-- 标题 -->
        <div class="hero-header">
          <p class="hero-welcome">{{ t('hero.welcome') || '欢迎来到' }}</p>
          <div class="hero-logo-container">
            <img
              src="/assets/images/logo/logo.avif"
              alt="Logo"
              class="hero-logo"
            />
          </div>
          <h1 class="hero-title">{{ t('site.name') }}</h1>
        </div>

        <!-- 行动按钮 -->
        <div class="hero-actions">
          <a href="https://30hb.cn/latest" class="btn-game btn-green">
            <img
              src="http://154.21.200.80:8889/png/%E7%BB%BF%E8%89%B2%E6%8C%89%E9%92%AE.png"
              alt=""
              class="btn-bg"
            />
            <span class="btn-text">{{ t('hero.download') || '点击下载' }}</span>
          </a>

          <a href="https://drive.30hb.cn" target="_blank" class="btn-game btn-blue">
            <img
              src="http://154.21.200.80:8889/png/%E8%93%9D%E8%89%B2%E6%8C%89%E9%92%AE.png"
              alt=""
              class="btn-bg"
            />
            <span class="btn-text">{{ t('hero.moreServers') || '更多服务器>>' }}</span>
          </a>
        </div>

        <!-- 社交链接 -->
        <div class="hero-social">
          <a href="https://qm.qq.com/q/qDf9qDK8g2" target="_blank" class="social-link">
            <img
              src="https://images.icon-icons.com/1753/PNG/96/iconfinder-social-media-applications-10qq-4102582_113820.png"
              alt="QQ群"
              class="social-icon"
            />
          </a>
          <a href="https://discord.gg/rGAGWDerzB" target="_blank" class="social-link">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3670/3670157.png"
              alt="Discord"
              class="social-icon"
            />
          </a>
        </div>

        <!-- 底部文字 -->
        <p class="hero-footer">
          {{ t('site.copyright') || '海岛奇兵 © 2025 保留所有权利' }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.hero-game {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1rem 3rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('https://r2.30hb.cn/hero.avif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.hero-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.hero-welcome {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  margin: 0;
}

.hero-logo-container {
  animation: float 3s ease-in-out infinite;
}

.hero-logo {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.hero-title {
  font-size: 3rem;
  font-weight: 900;
  color: #FFD60A;
  text-shadow:
    3px 3px 0 rgba(0, 0, 0, 0.8),
    -1px -1px 0 rgba(0, 0, 0, 0.5),
    1px -1px 0 rgba(0, 0, 0, 0.5),
    -1px 1px 0 rgba(0, 0, 0, 0.5);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.btn-game {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  text-decoration: none;
  transition: transform 0.2s, filter 0.2s;
  cursor: pointer;
}

.btn-game:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.btn-game:active {
  transform: scale(0.98);
}

.btn-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
}

.btn-text {
  position: relative;
  z-index: 1;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  padding: 0 2rem;
}

.hero-social {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
}

.social-link {
  transition: transform 0.2s;
}

.social-link:hover {
  transform: scale(1.1);
}

.social-icon {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
}

.hero-footer {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin-top: 1rem;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .hero-game {
    padding: 5rem 1rem 2rem;
  }

  .hero-welcome {
    font-size: 1.25rem;
  }

  .hero-logo {
    width: 80px;
    height: 80px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .btn-text {
    font-size: 1rem;
  }

  .social-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
