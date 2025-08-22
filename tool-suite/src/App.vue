<script setup>
import { ref, onMounted } from 'vue'
import ApiStatus from './components/ApiStatus.vue'
import AppLogo from './components/AppLogo.vue'
import AppNavigation from './components/AppNavigation.vue'
import UserActions from './components/UserActions.vue'

const isApiCheckDisabled = ref(false)
const showSupportDialog = ref(false)

// 支持我们的收款码图片路径
const supportImagePath = '/support-qr.jpg'

// 检查API状态检查是否被禁用
const checkApiCheckStatus = () => {
  isApiCheckDisabled.value = localStorage.getItem('api-check-disabled') === 'true'
}

// 重新启用API状态检查
const enableApiCheck = () => {
  localStorage.removeItem('api-check-disabled')
  isApiCheckDisabled.value = false
  window.location.reload()
}

// 监听存储变化
window.addEventListener('storage', (event) => {
  if (event.key === 'api-check-disabled') {
    checkApiCheckStatus()
  }
})

// 处理支持按钮点击
const handleSupportClick = () => {
  showSupportDialog.value = true
}

// 处理Logo点击
const handleLogoClick = () => {
  // 可以添加Logo点击的统计或其他逻辑
}

onMounted(() => {
  checkApiCheckStatus()
})
</script>

<template>
  <div class="app-container">
    <!-- 现代化顶部导航栏 -->
    <header class="app-header">
      <div class="header-content container flex-between">
        <!-- Logo区域 -->
        <AppLogo @logo-click="handleLogoClick" />
        
        <!-- 导航菜单 -->
        <AppNavigation />
        
        <!-- 用户操作区域 -->
        <UserActions @support-click="handleSupportClick" />
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <ApiStatus />
        <div v-if="isApiCheckDisabled" class="api-check-disabled-notice">
          <el-alert
            title="API状态检查已禁用"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div class="alert-content">
                <p>您已禁用API状态检查功能。如需重新启用，请点击下方按钮。</p>
                <div class="alert-actions">
                  <el-button size="small" type="primary" @click="enableApiCheck">
                    <el-icon><Check /></el-icon>
                    重新启用检查
                  </el-button>
                </div>
              </div>
            </template>
          </el-alert>
        </div>
        <router-view />
      </div>
    </main>
    
    <!-- 支持我们的弹窗 -->
    <el-dialog
      v-model="showSupportDialog"
      title="支持我们"
      width="400px"
      center
    >
      <div class="support-dialog-content">
        <img :src="supportImagePath" alt="支持我们" class="support-qr-image" />
        <p class="support-text">感谢您的支持！</p>
      </div>
    </el-dialog>
  </div>
</template>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: auto;
  overflow-x: hidden;
  overflow-y: auto;
}

#app {
  height: auto;
  min-height: 100vh;
}
</style>

<style scoped>
/* 应用容器 */
.app-container {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  font-family: var(--font-family);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

/* 现代化顶部导航栏 */
.app-header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-content {
  height: 72px;
  padding: 0;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  background-color: var(--bg-secondary);
  min-height: calc(100vh - 72px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
}

/* API检查禁用通知 */
.api-check-disabled-notice {
  margin-bottom: var(--space-lg);
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.alert-actions {
  display: flex;
  gap: var(--space-sm);
}

/* 支持我们弹窗样式 */
.support-dialog-content {
  text-align: center;
  padding: var(--space-lg);
}

.support-qr-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-md);
}

.support-text {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin: 0;
  font-weight: var(--font-weight-medium);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    height: 64px;
    padding: 0 var(--space-md);
  }
  
  .content-wrapper {
    padding: var(--space-lg) var(--space-md);
  }
  
  .main-content {
    min-height: calc(100vh - 64px);
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: var(--space-md);
  }
  
  .support-dialog-content {
    padding: var(--space-md);
  }
}

/* 动画增强 */
.app-header {
  transition: var(--transition-fast);
}

.content-wrapper {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
