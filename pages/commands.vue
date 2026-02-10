<template>
  <div class="commands-page">
    <div class="container-bb">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">{{ t('commands.title') || '指令工具' }}</h1>
        <p class="page-subtitle">{{ t('commands.subtitle') || '选择指令类型，快速生成游戏指令' }}</p>
      </div>

      <!-- 指令面板 -->
      <div class="commands-panel">
        <!-- 分类标签 -->
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="['category-tab', { 'active': activeCategory === category.id }]"
            @click="activeCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- 指令选择区 -->
        <div class="command-selector">
          <select
            v-model="selectedCommand"
            class="command-select"
            @change="generateCommand"
          >
            <option value="">{{ t('commands.selectPlaceholder') || `请选择${getCurrentCategoryName()}（不要加<>）` }}</option>
            <option
              v-for="cmd in filteredCommands"
              :key="cmd.id"
              :value="cmd.id"
            >
              {{ cmd.name }}
            </option>
          </select>

          <!-- 指令输出 -->
          <textarea
            v-model="generatedCommand"
            :placeholder="t('commands.outputPlaceholder') || '这里会显示生成的指令...'"
            class="command-output"
            readonly
          />

          <!-- 复制按钮 -->
          <button
            class="copy-button"
            :class="{ 'copied': copied }"
            @click="copyCommand"
          >
            <span v-if="!copied">{{ t('commands.copyButton') || '复制指令' }}</span>
            <span v-else>{{ t('commands.copiedButton') || '指令已复制!' }}</span>
          </button>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="usage-guide">
        <h2 class="guide-title">{{ t('commands.howToUse') || '如何使用指令' }}</h2>
        <div class="guide-steps">
          <div class="guide-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>{{ t('commands.step1Title') || '选择指令类型' }}</h3>
              <p>{{ t('commands.step1Desc') || '从上方标签中选择您需要的指令类别' }}</p>
            </div>
          </div>
          <div class="guide-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>{{ t('commands.step2Title') || '选择具体指令' }}</h3>
              <p>{{ t('commands.step2Desc') || '在下拉菜单中选择具体的指令' }}</p>
            </div>
          </div>
          <div class="guide-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>{{ t('commands.step3Title') || '复制并使用' }}</h3>
              <p>{{ t('commands.step3Desc') || '点击复制按钮，在游戏聊天中粘贴使用' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Command {
  id: string
  name: string
  command: string
  category: string
}

const activeCategory = ref('common')
const selectedCommand = ref('')
const generatedCommand = ref('')
const copied = ref(false)

const categories = [
  { id: 'common', name: '常用命令' },
  { id: 'statue', name: '雕刻命令' },
  { id: 'troop', name: '部队命令' },
  { id: 'building', name: '建筑命令' },
  { id: 'mine', name: '地雷命令' },
  { id: 'decoration', name: '放置树/石头命令' },
  { id: 'resource', name: '获取资源指令' },
  { id: 'all', name: '全部指令' },
  { id: 'color', name: '彩色字体' },
  { id: 'crab', name: '螃蟹甲板' }
]

const commands: Command[] = [
  // 常用命令
  { id: 'rename', name: '更改名字', command: '/rename <新名字>', category: 'common' },
  { id: 'default-island', name: '将你岛屿变为玩家默认岛屿', command: '/setdefault', category: 'common' },
  { id: 'recover', name: '找回账号', command: '/recover <玩家ID或标签>', category: 'common' },
  { id: 'maxall', name: '升级所有建筑至满级，仅可以主基地使用', command: '/maxall', category: 'common' },
  { id: 'maxtech', name: '将科技升级到大本等级（暂时不包括英雄技能）', command: '/maxtech', category: 'common' },
  { id: 'maxbase', name: '满级基地', command: '/maxbase', category: 'common' },
  { id: 'attack-self', name: '自己攻击自己', command: '/attack', category: 'common' },
  { id: 'online', name: '全服在线玩家', command: '/online', category: 'common' },
  
  // 雕刻命令
  { id: 'power-statue', name: '能量雕像999', command: '/statue PSC 999', category: 'statue' },
  { id: 'red-attack', name: '红攻雕像999', command: '/statue TD 999', category: 'statue' },
  { id: 'red-defense', name: '红防雕像999', command: '/statue TH 999', category: 'statue' },
  { id: 'blue-attack', name: '蓝攻雕像999', command: '/statue GBE 999', category: 'statue' },
  { id: 'blue-defense', name: '蓝防雕像999', command: '/statue RR 999', category: 'statue' },
  
  // 部队命令
  { id: 'add-skins', name: '添加所有皮肤', command: '/addskins', category: 'troop' },
  { id: 'remove-skins', name: '移除所有皮肤', command: '/removeskins', category: 'troop' },
  { id: 'add-heroes', name: '解锁全部小队长', command: '/addheroes', category: 'troop' },
  { id: 'remove-heroes', name: '移除所有小队长', command: '/removeheroes', category: 'troop' },
  { id: 'add-proto', name: '添加所有原型部队', command: '/addproto', category: 'troop' },
  { id: 'remove-proto', name: '移除所有原型部队', command: '/removeproto', category: 'troop' },
  { id: 'clear-boats', name: '清空登陆艇', command: '/clearboats', category: 'troop' },
  
  // 资源命令
  { id: 'gold', name: '获取金币', command: '/give gold <数量>', category: 'resource' },
  { id: 'wood', name: '获取木材', command: '/give wood <数量>', category: 'resource' },
  { id: 'stone', name: '获取石头', command: '/give stone <数量>', category: 'resource' },
  { id: 'iron', name: '获取铁矿', command: '/give iron <数量>', category: 'resource' },
  { id: 'diamond', name: '获取钻石', command: '/give diamonds <数量>', category: 'resource' }
]

const filteredCommands = computed(() => {
  if (activeCategory.value === 'all') {
    return commands
  }
  return commands.filter(cmd => cmd.category === activeCategory.value)
})

const getCurrentCategoryName = () => {
  const category = categories.find(c => c.id === activeCategory.value)
  return category?.name || '指令'
}

const generateCommand = () => {
  const command = commands.find(cmd => cmd.id === selectedCommand.value)
  if (command) {
    generatedCommand.value = command.command
  }
}

const copyCommand = async () => {
  if (!generatedCommand.value) return
  
  try {
    await navigator.clipboard.writeText(generatedCommand.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.commands-page {
  min-height: calc(100vh - 70px);
  padding: 4rem 1rem;
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #2C2416;
  margin: 0 0 1rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #5C5446;
  margin: 0;
}

.commands-panel {
  max-width: 800px;
  margin: 0 auto 4rem;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.category-tab {
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  color: #495057;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  background: #f8f9fa;
  border-color: #0891D1;
}

.category-tab.active {
  background: #0891D1;
  border-color: #0891D1;
  color: white;
}

.command-selector {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.command-select {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.command-select:hover {
  border-color: #0891D1;
}

.command-select:focus {
  outline: none;
  border-color: #0891D1;
}

.command-output {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background: #f8f9fa;
  resize: vertical;
}

.command-output:focus {
  outline: none;
  border-color: #0891D1;
}

.copy-button {
  width: 100%;
  padding: 1rem;
  background: #0891D1;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  background: #06668F;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(8, 145, 209, 0.3);
}

.copy-button:active {
  transform: translateY(0);
}

.copy-button.copied {
  background: #5FB82E;
}

.usage-guide {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.guide-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2C2416;
  margin: 0 0 2rem;
  text-align: center;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.guide-step {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0891D1, #3DB2E8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2C2416;
  margin: 0 0 0.5rem;
}

.step-content p {
  font-size: 1rem;
  color: #5C5446;
  margin: 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .commands-page {
    padding: 2rem 0.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .category-tabs {
    padding: 1rem;
  }
  
  .category-tab {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .command-selector {
    padding: 1.5rem;
  }
  
  .usage-guide {
    padding: 1.5rem;
  }
  
  .guide-step {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-number {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}
</style>

