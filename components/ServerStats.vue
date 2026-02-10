<template>
  <section class="stats-game">
    <div class="container-bb">
      <!-- 标题 -->
      <div class="stats-header">
        <h2 class="stats-title">
          {{ t('stats.onlinePlayers') || '在线玩家' }}
        </h2>
        <div class="stats-live-badge" :class="stats ? 'live-active' : ''">
          <span class="live-dot" />
          <span class="live-text">LIVE</span>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <!-- 在线玩家 -->
        <div class="stats-card stats-card-blue">
          <div class="stats-icon">
            <div class="i-fa6-solid-users" />
          </div>
          <div class="stats-number" :class="{ 'loading': !stats }">
            {{ stats ? stats.onlinePlayers : '...' }}
          </div>
          <div class="stats-label">
            {{ t('stats.onlinePlayers') || '在线玩家' }}
          </div>
        </div>

        <!-- 玩家总数 -->
        <div class="stats-card stats-card-green">
          <div class="stats-icon">
            <div class="i-fa6-solid-trophy" />
          </div>
          <div class="stats-number" :class="{ 'loading': !stats }">
            {{ stats ? stats.totalPlayers : '...' }}
          </div>
          <div class="stats-label">
            {{ t('stats.totalPlayers') || '玩家总数' }}
          </div>
        </div>

        <!-- 回放数 -->
        <div class="stats-card stats-card-orange">
          <div class="stats-icon">
            <div class="i-fa6-solid-video" />
          </div>
          <div class="stats-number" :class="{ 'loading': !stats }">
            {{ stats ? stats.totalReplays : '...' }}
          </div>
          <div class="stats-label">
            {{ t('stats.totalReplays') || '回放数' }}
          </div>
        </div>
      </div>

      <!-- 在线玩家列表 -->
      <div class="players-list-container">
        <div class="players-list-header">
          <div class="players-list-icon">
            <div class="i-fa6-solid-users" />
          </div>
          <span class="players-list-title">{{ t('stats.onlinePlayers') || '在线玩家' }}</span>
          <span class="players-list-count">{{ players.length }}</span>
        </div>

        <div class="players-list">
          <TransitionGroup name="list">
            <!-- 加载状态 -->
            <div
              v-if="loading"
              key="loading"
              class="players-list-message"
            >
              <div class="loading-spinner" />
              <span>{{ t('stats.loading') || '加载中...' }}</span>
            </div>

            <!-- 错误状态 -->
            <div
              v-else-if="error"
              key="error"
              class="players-list-message error"
            >
              {{ t('stats.error') || '加载失败' }}
            </div>

            <!-- 空状态 -->
            <div
              v-else-if="!players || players.length === 0"
              key="empty"
              class="players-list-message"
            >
              {{ t('stats.noPlayers') || '暂无在线玩家' }}
            </div>

            <!-- 玩家列表 -->
            <div
              v-for="(player, index) in players"
              v-else
              :key="player.id"
              class="player-item"
            >
              <div class="player-rank" :class="`rank-${index + 1}`">
                {{ index + 1 }}
              </div>

              <div class="player-info">
                <div class="player-name">{{ player.name }}</div>
                <div class="player-id">ID: {{ player.id }}</div>
              </div>

              <div class="player-online-dot" />
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Player {
  id: number
  name: string
}

interface Stats {
  onlinePlayers: number
  totalPlayers: number
  totalReplays: number
}

const stats = ref<Stats | null>(null)
const players = ref<Player[]>([])
const loading = ref(true)
const error = ref(false)

const fetchStats = async () => {
  try {
    loading.value = true
    error.value = false

    const response = await fetch('https://vn-rank-api.adingapkgg.workers.dev/?target=https://webapi.30hb.cn/api/server')
    const data = await response.json()

    if (data.success && data.body) {
      stats.value = {
        onlinePlayers: data.body.online_sessions || 0,
        totalPlayers: data.body.m_v_avatar_seed || 0,
        totalReplays: data.body.m_v_replay_seed || 0
      }
      players.value = data.body.online_player_list || []
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
  setInterval(fetchStats, 30000)
})
</script>

<style scoped>
.stats-game {
  padding: 4rem 1rem;
  background: rgba(255, 255, 255, 0.5);
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.stats-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2C2416;
  margin: 0;
  text-align: center;
}

.stats-live-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(95, 184, 46, 0.1);
  border: 2px solid #5FB82E;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  color: #5FB82E;
}

.stats-live-badge.live-active {
  animation: pulse-live 2s ease-in-out infinite;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #5FB82E;
  border-radius: 50%;
}

.live-text {
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.stats-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stats-card:hover {
  transform: translateY(-5px);
}

.stats-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.stats-card-blue .stats-icon {
  background: linear-gradient(135deg, #0891D1, #3DB2E8);
  color: white;
}

.stats-card-green .stats-icon {
  background: linear-gradient(135deg, #5FB82E, #7FD14A);
  color: white;
}

.stats-card-orange .stats-icon {
  background: linear-gradient(135deg, #FF8C00, #FFB347);
  color: white;
}

.stats-number {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.stats-card-blue .stats-number { color: #0891D1; }
.stats-card-green .stats-number { color: #5FB82E; }
.stats-card-orange .stats-number { color: #FF8C00; }

.stats-number.loading {
  animation: pulse 1.5s ease-in-out infinite;
}

.stats-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #5C5446;
  text-transform: uppercase;
}

.players-list-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.players-list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #5FB82E, #7FD14A);
  color: white;
}

.players-list-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 1.25rem;
}

.players-list-title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 700;
}

.players-list-count {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
}

.players-list {
  max-height: 400px;
  overflow-y: auto;
}

.players-list-message {
  padding: 2rem;
  text-align: center;
  color: #5C5446;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.players-list-message.error {
  color: #E63946;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #E8E0C8;
  border-top-color: #5FB82E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E8E0C8;
  transition: background 0.2s;
}

.player-item:hover {
  background: #F5F5DC;
}

.player-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
  flex-shrink: 0;
  background: #E8E0C8;
  color: #2C2416;
  border: 2px solid #8B7355;
}

.player-rank.rank-1 {
  background: linear-gradient(135deg, #FFD60A, #FFE566);
  border-color: #CCAB08;
}

.player-rank.rank-2 {
  background: linear-gradient(135deg, #C0C0C0, #E8E8E8);
  border-color: #999999;
}

.player-rank.rank-3 {
  background: linear-gradient(135deg, #CD7F32, #E89A5C);
  border-color: #A86428;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name {
  font-weight: 700;
  color: #2C2416;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-id {
  font-size: 0.75rem;
  color: #5C5446;
}

.player-online-dot {
  width: 8px;
  height: 8px;
  background: #5FB82E;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes pulse-live {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(95, 184, 46, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(95, 184, 46, 0);
  }
}

@media (max-width: 968px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .stats-title {
    font-size: 2rem;
  }
}

@media (max-width: 640px) {
  .stats-game {
    padding: 2rem 0.5rem;
  }

  .stats-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .stats-title {
    font-size: 1.75rem;
  }

  .stats-card {
    padding: 1.5rem;
  }

  .stats-number {
    font-size: 2.5rem;
  }
}
</style>
