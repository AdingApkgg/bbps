<template>
  <section class="cta-game">
    <div class="container-bb">
      <!-- 使用船长角色 -->
      <div class="cta-content">
        <img
          src="http://154.21.200.80:8889/png/%E8%88%B9%E9%95%BF.png"
          alt="船长"
          class="cta-character"
        />

        <div class="cta-text">
          <h1 class="cta-title">{{ t('cta.title') || '体验无限钻石和快速发育' }}</h1>
          <p class="cta-description">
            {{ t('cta.description') || '您可以输入快捷指令获取一切，抓住机会，重创黑暗卫队！' }}
          </p>

          <a href="/commands" class="btn-game btn-blue-cta">
            <img
              src="http://154.21.200.80:8889/png/%E8%93%9D%E8%89%B2%E6%8C%89%E9%92%AE.png"
              alt=""
              class="btn-bg"
            />
            <span class="btn-text">{{ t('cta.viewCommands') || '查看指令>>' }}</span>
          </a>
        </div>
      </div>

      <!-- Hammerman区域 -->
      <div class="cta-content cta-content-reverse">
        <div class="cta-text">
          <h1 class="cta-title">{{ t('cta.editorTitle') || '邪恶的黑暗卫队编辑器' }}</h1>
          <p class="cta-description">
            {{ t('cta.editorDescription') || '见鬼！之前哪个叛徒关了我的基地编辑器？不用担心，让蚕豆出手！您可以用我们的网页编辑器打造出独一无二的史诗级地图，快去让那些指挥官们闻风丧胆吧！' }}
          </p>
          <p class="cta-signature">{{ t('cta.signature') || '——真诚地，哈莫曼中尉' }}</p>

          <a href="https://webapi.30hb.cn/basebuilder/Layout-Builder.htm" class="btn-game btn-red-cta">
            <img
              src="http://154.21.200.80:8889/png/%E7%BA%A2%E8%89%B2%E6%8C%89%E9%92%AE.png"
              alt=""
              class="btn-bg"
            />
            <span class="btn-text">{{ t('cta.startBuilding') || '即刻打造>>' }}</span>
          </a>
        </div>

        <img
          src="http://154.21.200.80:8889/png/%E5%93%88%E8%8E%AB%E6%9B%BC.png"
          alt="Hammerman"
          class="cta-character"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.cta-game {
  padding: 4rem 1rem;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%);
}

.cta-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 6rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.cta-content:last-child {
  margin-bottom: 0;
}

.cta-content-reverse {
  grid-template-columns: 1fr 300px;
}

.cta-character {
  width: 100%;
  height: auto;
  animation: float 3s ease-in-out infinite;
}

.cta-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2C2416;
  margin: 0;
  line-height: 1.2;
}

.cta-description {
  font-size: 1.125rem;
  color: #5C5446;
  line-height: 1.6;
  margin: 0;
}

.cta-signature {
  font-size: 1rem;
  color: #8B7355;
  font-style: italic;
  margin: -0.5rem 0 0;
}

.btn-game {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  text-decoration: none;
  transition: transform 0.2s, filter 0.2s;
  cursor: pointer;
  max-width: 300px;
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

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@media (max-width: 968px) {
  .cta-content,
  .cta-content-reverse {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .cta-character {
    max-width: 250px;
    margin: 0 auto;
  }

  .cta-title {
    font-size: 2rem;
  }

  .cta-description {
    font-size: 1rem;
  }

  .btn-game {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .cta-game {
    padding: 2rem 0.5rem;
  }

  .cta-content {
    padding: 1.5rem;
    margin-bottom: 3rem;
  }

  .cta-character {
    max-width: 200px;
  }

  .cta-title {
    font-size: 1.5rem;
  }
}
</style>
