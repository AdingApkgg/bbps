<template>
  <section class="comments-game">
    <div class="container-bb">
      <!-- 标题 -->
      <div class="comments-header">
        <h2 class="comments-title">
          {{ t('comments.title') || '玩家评论' }}
        </h2>
      </div>

      <!-- 评论容器 -->
      <div class="comments-container">
        <div id="waline" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

onMounted(async () => {
  try {
    const { init } = await import('@waline/client')
    await import('@waline/client/waline.css')

    init({
      el: '#waline',
      serverURL: 'https://waline.saop.cc',
      path: 'disk.saop.cc'
    })
  } catch (err) {
    console.error('Failed to load Waline:', err)
  }
})
</script>

<style scoped>
.comments-game {
  padding: 4rem 1rem;
  background: rgba(255, 255, 255, 0.3);
}

.comments-header {
  text-align: center;
  margin-bottom: 3rem;
}

.comments-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2C2416;
  margin: 0;
}

.comments-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .comments-game {
    padding: 2rem 0.5rem;
  }

  .comments-title {
    font-size: 2rem;
  }

  .comments-container {
    padding: 1rem;
  }
}
</style>
