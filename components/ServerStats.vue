<template>
  <section class="stats-section">
    <div class="container">
      <div class="stats-header">
        <h2 class="section-title">
          {{ t('stats.onlinePlayers') }}
        </h2>
        <div class="online-indicator" :class="{ 'online': !loading && !error }">
          <span class="indicator-dot" />
          <span class="indicator-text">LIVE</span>
        </div>
      </div>

      <div class="stats-grid">
        <!-- 在线玩家数 -->
        <div class="stat-card card main-stat">
          <div class="stat-icon">
            👥
          </div>
          <div class="stat-value" :class="{ 'loading': loading }">
            {{ loading ? t('stats.loading') : (error ? t('stats.error') : stats?.online_sessions ?? 0) }}
          </div>
          <div class="stat-label">
            {{ t('stats.onlinePlayers') }}
          </div>
        </div>

        <!-- 玩家总数 -->
        <div class="stat-card card">
          <div class="stat-icon">
            🏆
          </div>
          <div class="stat-value" :class="{ 'loading': loading }">
            {{ loading ? '...' : (error ? t('stats.error') : stats?.m_v_avatar_seed?.toLocaleString() ?? 0) }}
          </div>
          <div class="stat-label">
            {{ t('stats.totalPlayers') }}
          </div>
        </div>

        <!-- 回放数 -->
        <div class="stat-card card">
          <div class="stat-icon">
            📹
          </div>
          <div class="stat-value" :class="{ 'loading': loading }">
            {{ loading ? '...' : (error ? t('stats.error') : stats?.m_v_replay_seed?.toLocaleString() ?? 0) }}
          </div>
          <div class="stat-label">
            {{ t('stats.totalReplays') }}
          </div>
        </div>
      </div>

      <!-- 在线玩家列表 -->
      <div class="player-list card">
        <div class="card-header">
          <span class="header-icon">⚔️</span>
          <span>{{ t('stats.onlinePlayers') }}</span>
        </div>
        <div class="card-body">
          <TransitionGroup name="player-list" tag="ul" class="players">
            <li
              v-if="loading"
              key="loading"
              class="player-item loading"
            >
              {{ t('stats.loading') }}
            </li>
            <li
              v-else-if="error"
              key="error"
              class="player-item error"
            >
              {{ error }}
            </li>
            <li
              v-else-if="!stats?.online_player_list?.length"
              key="empty"
              class="player-item empty"
            >
              {{ t('stats.noPlayers') }}
            </li>
            <li
              v-for="player in stats.online_player_list"
              v-else
              :key="player.id"
              class="player-item"
            >
              <span class="player-icon">🎮</span>
              <span class="player-name">{{ player.name }}</span>
              <span class="player-id">#{{ player.id }}</span>
            </li>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServerStats } from '~/composables/useServerStats'

const { t } = useI18n()
const { stats, loading, error, startAutoRefresh, stopAutoRefresh } = useServerStats()

onMounted(() => {
  startAutoRefresh(5000)
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped lang="sass">
@use 'sass:color'

.stats-section
  padding: $spacing-xl $spacing-md
  background: linear-gradient(to bottom, $off-white 0%, $white 100%)

.stats-header
  display: flex
  align-items: center
  justify-content: center
  gap: $spacing-md
  margin-bottom: $spacing-xl
  flex-wrap: wrap

.section-title
  text-align: center
  color: $military-green-dark
  margin: 0

.online-indicator
  display: flex
  align-items: center
  gap: $spacing-xs
  padding: $spacing-xs $spacing-md
  background: $light-gray
  border-radius: $radius-lg
  border: 2px solid $gray
  
  &.online
    background: color.adjust($military-green, $lightness: 40%)
    border-color: $military-green
    
    .indicator-dot
      background: $military-green
      animation: pulse-dot 2s ease-in-out infinite

.indicator-dot
  width: 10px
  height: 10px
  border-radius: 50%
  background: $gray

.indicator-text
  font-weight: 700
  font-size: $font-size-sm
  color: $military-green-dark

@keyframes pulse-dot
  0%, 100%
    box-shadow: 0 0 0 0 rgba($military-green, 0.7)
  50%
    box-shadow: 0 0 0 8px rgba($military-green, 0)

.stats-grid
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: $spacing-lg
  margin-bottom: $spacing-xl

.stat-card
  padding: $spacing-lg
  text-align: center
  background: $white
  transition: all $transition-base
  
  &:hover
    transform: translateY(-8px) scale(1.02)
  
  &.main-stat
    background: $gradient-ocean
    color: $white
    
    .stat-label
      color: rgba(white, 0.9)

.stat-icon
  font-size: $font-size-4xl
  margin-bottom: $spacing-sm
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))

.stat-value
  font-size: $font-size-3xl
  font-weight: 900
  font-family: $font-family-game
  color: $military-green-dark
  margin-bottom: $spacing-xs
  
  .main-stat &
    color: $white
    text-shadow: 2px 2px 0 rgba($black, 0.3)
  
  &.loading
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite

.stat-label
  font-size: $font-size-sm
  font-weight: 600
  color: $dark-gray
  text-transform: uppercase

.player-list
  max-width: 600px
  margin: 0 auto

.players
  list-style: none
  padding: 0
  margin: 0
  max-height: 400px
  overflow-y: auto
  
  &::-webkit-scrollbar
    width: 8px
  
  &::-webkit-scrollbar-track
    background: $light-gray
    border-radius: $radius-sm
  
  &::-webkit-scrollbar-thumb
    background: $military-green
    border-radius: $radius-sm
    
    &:hover
      background: $military-green-dark

.player-item
  display: flex
  align-items: center
  gap: $spacing-sm
  padding: $spacing-sm $spacing-md
  border-bottom: 1px solid $light-gray
  transition: all $transition-fast
  
  &:last-child
    border-bottom: none
  
  &:hover
    background: color.adjust($primary-blue, $lightness: 45%)
    padding-left: calc($spacing-md + 4px)
  
  &.loading, &.error, &.empty
    justify-content: center
    color: $gray
    font-style: italic
  
  &.error
    color: $danger-red

.player-icon
  font-size: $font-size-lg

.player-name
  flex: 1
  font-weight: 600
  color: $military-green-dark

.player-id
  font-size: $font-size-sm
  color: $gray
  font-family: monospace

.player-list-enter-active, .player-list-leave-active
  transition: all $transition-base

.player-list-enter-from
  opacity: 0
  transform: translateX(-20px)

.player-list-leave-to
  opacity: 0
  transform: translateX(20px)

.player-list-move
  transition: transform $transition-base

@media (max-width: $breakpoint-sm)
  .stats-grid
    grid-template-columns: 1fr
  
  .stat-card
    &:hover
      transform: translateY(-4px)
</style>
