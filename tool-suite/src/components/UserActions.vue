<template>
  <div class="user-actions">
    <!-- 支持我们按钮 -->
    <button
      class="action-button support-button"
      @click="handleSupportClick"
      title="支持我们的项目"
    >
      <el-icon class="action-button__icon">
        <Coffee />
      </el-icon>
      <span class="action-button__text">Support Us</span>
    </button>

    <!-- 其他操作按钮可以在这里添加 -->
    <!-- 
    <button
      class="action-button settings-button"
      @click="handleSettingsClick"
      title="设置"
    >
      <el-icon class="action-button__icon">
        <Setting />
      </el-icon>
    </button>
    -->
  </div>
</template>

<script setup>
import { Coffee } from '@element-plus/icons-vue'

// 定义事件
const emit = defineEmits(['supportClick', 'settingsClick'])

// 处理支持按钮点击
const handleSupportClick = () => {
  emit('supportClick')
}

// 处理设置按钮点击
const handleSettingsClick = () => {
  emit('settingsClick')
}
</script>

<style scoped>
.user-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.action-button {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-bounce);
  white-space: nowrap;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.action-button__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.action-button__text {
  flex: 1;
}

/* 支持按钮特殊样式 */
.support-button {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.support-button:hover {
  background-color: var(--primary-color);
  color: var(--text-white);
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

/* 设置按钮样式 */
.settings-button {
  padding: var(--space-sm);
  border-radius: var(--radius-lg);
}

.settings-button:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
  border-color: var(--border-hover);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-button__text {
    display: none;
  }
  
  .action-button {
    padding: var(--space-sm);
    border-radius: var(--radius-lg);
  }
  
  .support-button {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .user-actions {
    gap: var(--space-xs);
  }
  
  .action-button {
    padding: var(--space-xs);
  }
  
  .action-button__icon {
    font-size: 18px;
  }
}
</style>