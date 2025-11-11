<template>
  <div class="support-floating">
    <button
      class="support-fab"
      @click="emit('supportClick')"
      title="支持我们的项目"
    >
      <el-icon class="support-fab__icon">
        <Coffee />
      </el-icon>
      <span class="support-fab__text md:block hidden">Support Us</span>
    </button>
  </div>
</template>

<script setup>
import { Coffee } from '@element-plus/icons-vue'

const emit = defineEmits(['supportClick'])
</script>

<style scoped>
.support-floating {
  position: fixed;
  right: var(--space-md);
  top: 88px; /* 72px 头部高度 + 16px 间距 */
  z-index: 200; /* 高于内容，低于需要时可调整 */
}

.support-fab {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  background-color: var(--bg-primary);
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-bounce);
  box-shadow: var(--shadow-md);
  white-space: nowrap;
}

.support-fab:hover {
  transform: translateY(-1px);
  background-color: var(--primary-color);
  color: var(--text-white);
  box-shadow: var(--shadow-lg);
}

.support-fab__icon {
  font-size: 18px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .support-floating {
    top: 72px; /* 64px 头部高度 + 8px 间距 */
    right: var(--space-sm);
  }
  .support-fab {
    padding: var(--space-sm);
    border-radius: var(--radius-lg);
  }
}
</style>