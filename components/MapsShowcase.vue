<template>
  <section class="maps-showcase">
    <div class="container-bb">
      <!-- 标题 -->
      <h2 class="section-title">{{ t('maps.title') || '回顾辉煌岁月' }}</h2>
      <p class="section-description">
        {{ t('maps.description') || '自基地编辑器上线以来，我们见证了无数创意与策略的碰撞。每一座自定义基地都承载着指挥官的智慧，每一次防御布局都展现着独特的战术思维。感谢你们用热情与创意，让黑暗卫队的防御体系更加强大。' }}
      </p>

      <!-- 地图网格 -->
      <div class="maps-grid">
        <div
          v-for="(map, index) in visibleMaps"
          :key="index"
          class="map-card"
          @click="viewMap(map)"
        >
          <img
            :src="`http://154.21.200.80:8889/png/地图${index + 1 + currentPage * mapsPerPage}.jpg`"
            :alt="`地图${index + 1 + currentPage * mapsPerPage}`"
            class="map-image"
            @error="handleImageError"
          />
          <div class="map-overlay">
            <div class="map-likes">
              <div class="i-fa6-solid-heart" />
              <span>0</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页控制 -->
      <div class="pagination-controls">
        <button
          class="pagination-button"
          :disabled="currentPage === 0"
          @click="previousPage"
        >
          <img
            src="http://154.21.200.80:8889/png/蓝色按钮.png"
            alt=""
            class="button-bg"
          />
          <span class="button-text">{{ t('maps.previous') || '上一页' }}</span>
        </button>

        <button
          class="pagination-button"
          :disabled="currentPage >= totalPages - 1"
          @click="nextPage"
        >
          <img
            src="http://154.21.200.80:8889/png/蓝色按钮.png"
            alt=""
            class="button-bg"
          />
          <span class="button-text">{{ t('maps.next') || '下一页' }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const totalMaps = 13
const mapsPerPage = 12
const currentPage = ref(0)

const totalPages = computed(() => Math.ceil(totalMaps / mapsPerPage))

const visibleMaps = computed(() => {
  const start = currentPage.value * mapsPerPage
  const end = Math.min(start + mapsPerPage, totalMaps)
  return Array.from({ length: end - start }, (_, i) => i)
})

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const viewMap = (map: number) => {
  // 地图查看功能
  console.log('Viewing map:', map)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.maps-showcase {
  padding: 4rem 1rem;
  background: rgba(255, 255, 255, 0.3);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2C2416;
  text-align: center;
  margin: 0 0 1.5rem;
}

.section-description {
  font-size: 1.125rem;
  color: #5C5446;
  text-align: center;
  line-height: 1.8;
  max-width: 900px;
  margin: 0 auto 3rem;
}

.maps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.map-card {
  position: relative;
  aspect-ratio: 1;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.map-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.map-card:hover .map-overlay {
  opacity: 1;
}

.map-likes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.pagination-button {
  position: relative;
  min-width: 150px;
  min-height: 50px;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s, filter 0.2s;
}

.pagination-button:hover:not(:disabled) {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.pagination-button:active:not(:disabled) {
  transform: scale(0.98);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  font-size: 1rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

@media (max-width: 1200px) {
  .maps-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .maps-showcase {
    padding: 2rem 0.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-description {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .maps-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .pagination-controls {
    gap: 1rem;
  }

  .pagination-button {
    min-width: 120px;
    min-height: 40px;
  }

  .button-text {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .maps-grid {
    grid-template-columns: 1fr;
  }
}
</style>

