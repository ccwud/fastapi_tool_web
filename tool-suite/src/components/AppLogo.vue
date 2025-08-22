<template>
  <div class="app-logo">
    <router-link to="/" class="logo-link" @click="handleLogoClick">
      <div class="logo-icon">
        <el-icon class="logo-icon__graphic">
          <Tools />
        </el-icon>
      </div>
      <div class="logo-text">
        <h1 class="logo-title">工具集合</h1>
        <p class="logo-subtitle">Developer Tools</p>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { Tools } from '@element-plus/icons-vue'

// 定义事件
const emit = defineEmits(['logoClick'])

// 处理Logo点击
const handleLogoClick = () => {
  emit('logoClick')
}
</script>

<style scoped>
.app-logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: inherit;
  transition: var(--transition-fast);
  padding: var(--space-xs);
  border-radius: var(--radius-lg);
}

.logo-link:hover {
  background-color: var(--bg-hover);
  transform: translateY(-1px);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 50%, #4dabf7 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md), 0 0 20px rgba(24, 144, 255, 0.3);
  position: relative;
  overflow: hidden;
  transition: var(--transition-bounce);
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent 340deg, rgba(255, 255, 255, 0.5) 360deg);
  animation: rotate 3s linear infinite;
}

.logo-icon::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  border-radius: calc(var(--radius-xl) - 2px);
  z-index: 1;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.logo-link:hover .logo-icon {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-lg), 0 0 30px rgba(24, 144, 255, 0.4);
}

.logo-icon__graphic {
  font-size: 24px;
  color: var(--text-white);
  z-index: 1;
  position: relative;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--text-primary), var(--primary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: var(--transition-fast);
}

.logo-link:hover .logo-title {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
  margin: 0;
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: var(--transition-fast);
  opacity: 0.8;
}

.logo-link:hover .logo-subtitle {
  color: var(--primary-color);
  opacity: 1;
  transform: translateX(2px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .logo-icon {
    width: 40px;
    height: 40px;
  }
  
  .logo-icon__graphic {
    font-size: 20px;
  }
  
  .logo-title {
    font-size: var(--font-size-lg);
  }
  
  .logo-subtitle {
    display: none;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
  
  .logo-link {
    gap: 0;
  }
}
</style>