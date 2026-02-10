<template>
  <section class="creative-showcase">
    <div class="container-bb">
      <!-- 标题 -->
      <h1 class="showcase-title">{{ t('creative.title') || '更多创意元素！' }}</h1>

      <!-- 图片轮播 -->
      <div class="carousel-container">
        <button
          class="carousel-arrow carousel-arrow-left"
          @click="previousSlide"
          :disabled="currentSlide === 0"
        >
          <div class="i-fa6-solid-chevron-left" />
        </button>

        <div class="carousel-wrapper">
          <div
            class="carousel-track"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div
              v-for="(image, index) in images"
              :key="index"
              class="carousel-slide"
            >
              <img
                :src="`http://154.21.200.80:8889/png/魔改${index + 1}.jpg`"
                :alt="`魔改${index + 1}`"
                class="carousel-image"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>

        <button
          class="carousel-arrow carousel-arrow-right"
          @click="nextSlide"
          :disabled="currentSlide >= images.length - 1"
        >
          <div class="i-fa6-solid-chevron-right" />
        </button>
      </div>

      <!-- 描述 -->
      <p class="showcase-description">
        {{ t('creative.description') || '你永远可以无限制地想象蚕豆能给你带来什么惊喜。' }}
      </p>

      <!-- 探索按钮 -->
      <a href="https://drive.30hb.cn/" class="explore-button">
        <img
          src="http://154.21.200.80:8889/png/绿色按钮.png"
          alt=""
          class="button-bg"
        />
        <span class="button-text">{{ t('creative.explore') || '探索更多>>' }}</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const currentSlide = ref(0)
const images = Array.from({ length: 4 }, (_, i) => i)
let intervalId: NodeJS.Timeout | null = null

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const nextSlide = () => {
  if (currentSlide.value < images.length - 1) {
    currentSlide.value++
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// 自动轮播 - 仅在客户端
onMounted(() => {
  intervalId = setInterval(() => {
    if (currentSlide.value < images.length - 1) {
      currentSlide.value++
    } else {
      currentSlide.value = 0
    }
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.creative-showcase {
  padding: 4rem 1rem;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.8));
}

.showcase-title {
  font-size: 3rem;
  font-weight: 900;
  color: #2C2416;
  text-align: center;
  margin: 0 0 3rem;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto 2rem;
}

.carousel-arrow {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(8, 145, 209, 0.9);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.carousel-arrow:hover:not(:disabled) {
  background: rgba(8, 145, 209, 1);
  transform: scale(1.1);
}

.carousel-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  aspect-ratio: 16 / 9;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.showcase-description {
  font-size: 1.25rem;
  color: #5C5446;
  text-align: center;
  margin: 2rem 0;
  font-weight: 500;
}

.explore-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 250px;
  min-height: 60px;
  margin: 0 auto;
  text-decoration: none;
  transition: transform 0.2s, filter 0.2s;
  cursor: pointer;
}

.explore-button:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.explore-button:active {
  transform: scale(0.98);
}

.button-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.button-text {
  position: relative;
  z-index: 1;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

@media (max-width: 768px) {
  .creative-showcase {
    padding: 2rem 0.5rem;
  }

  .showcase-title {
    font-size: 2rem;
  }

  .carousel-container {
    gap: 1rem;
  }

  .carousel-arrow {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .carousel-arrow-left,
  .carousel-arrow-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .carousel-arrow-left {
    left: 0.5rem;
  }

  .carousel-arrow-right {
    right: 0.5rem;
  }

  .showcase-description {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .explore-button {
    min-width: 200px;
    min-height: 50px;
  }

  .button-text {
    font-size: 1rem;
  }
}
</style>

