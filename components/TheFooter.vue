<template>
  <footer class="footer-game">
    <div class="container-bb">
      <div class="footer-content">
        <!-- Logo和描述 -->
        <div class="footer-brand">
          <div class="footer-logo">
            <img
              src="/assets/images/logo/logo.avif"
              alt="海岛奇兵私服"
              class="footer-logo-img"
            />
            <span class="footer-title">{{ t('site.name') }}</span>
          </div>
          <p class="footer-description">
            {{ t('footer.description') || '非官方的海岛奇兵私服，体验无限资源和独特玩法' }}
          </p>
        </div>

        <!-- 快速链接 -->
        <div class="footer-links">
          <h3 class="footer-heading">{{ t('footer.quickLinks') || '快速链接' }}</h3>
          <a href="https://30hb.cn/news/" class="footer-link">{{ t('nav.commands') || '指令' }}</a>
          <a href="https://drive.30hb.cn/" class="footer-link">{{ t('nav.drive') || '网盘' }}</a>
          <a href="https://blog.30hb.cn/" class="footer-link">{{ t('nav.blog') || '博客' }}</a>
          <a href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm" class="footer-link">{{ t('nav.editor') || '地图编辑' }}</a>
        </div>

        <!-- 社交媒体 -->
        <div class="footer-social-section">
          <h3 class="footer-heading">{{ t('footer.community') || '加入社区' }}</h3>
          <div class="footer-social">
            <a href="https://qm.qq.com/q/qDf9qDK8g2" target="_blank" class="footer-social-link">
              <img
                src="https://images.icon-icons.com/1753/PNG/96/iconfinder-social-media-applications-10qq-4102582_113820.png"
                alt="QQ群"
                class="footer-social-icon"
              />
            </a>
            <a href="https://discord.gg/rGAGWDerzB" target="_blank" class="footer-social-link">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3670/3670157.png"
                alt="Discord"
                class="footer-social-icon"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          {{ t('site.copyright') || '海岛奇兵 © 2025 保留所有权利' }}
        </p>
        <p class="footer-disclaimer">
          {{ t('footer.disclaimer') || '本站为非官方粉丝项目，与Supercell无关' }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.footer-game {
  background: rgba(26, 35, 42, 0.95);
  color: rgba(255, 255, 255, 0.8);
  padding: 3rem 1rem 1.5rem;
  border-top: 3px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-logo-img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFD60A;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.footer-description {
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-heading {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #FFD60A;
}

.footer-social-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.footer-social-link {
  transition: transform 0.2s;
}

.footer-social-link:hover {
  transform: scale(1.1);
}

.footer-social-icon {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-copyright {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.5rem;
}

.footer-disclaimer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

@media (max-width: 968px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .footer-game {
    padding: 2rem 1rem 1rem;
  }

  .footer-logo-img {
    width: 40px;
    height: 40px;
  }

  .footer-title {
    font-size: 1.25rem;
  }
}
</style>
