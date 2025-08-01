<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ApiStatus from './components/ApiStatus.vue'

const router = useRouter()
const activeIndex = ref('/')
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

onMounted(() => {
  checkApiCheckStatus()
})

const menuItems = [
  { index: '/', title: '工具首页', icon: 'House' },
  { index: '/chinese-converter', title: '简繁体转换', icon: 'Document' },
  { index: '/translator', title: '中英文翻译', icon: 'ChatDotRound' },
  { index: '/des-encryption', title: 'DES加解密', icon: 'Lock' },
  { index: '/markdown-converter', title: 'HTML转Markdown', icon: 'Document' },
  { index: '/json-formatter', title: 'JSON格式化', icon: 'DocumentCopy' },
  { index: '/sql-compressor', title: 'SQL压缩', icon: 'DataLine' },
  { index: '/java-to-json', title: 'Java转JSON', icon: 'DocumentCopy' }
]

const handleSelect = (key) => {
  activeIndex.value = key
  router.push(key)
}

// 显示支持我们的收款码图片
const openSupportUrl = () => {
  showSupportDialog.value = true
}
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>工具集合</h1>
        </div>
        <nav class="nav-menu">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            class="top-menu"
          >
            <el-menu-item
              v-for="item in menuItems"
              :key="item.index"
              :index="item.index"
              class="nav-item"
            >
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
          </el-menu>
        </nav>
        <div class="user-info">
          <button @click="openSupportUrl" class="support-btn">
            <el-icon><Coffee /></el-icon>
            <span>Support Us</span>
          </button>
        </div>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  height: auto;
  background-color: #F7F8FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  color: #333333;
  overflow-x: hidden;
  overflow-y: auto;
}

/* 顶部导航栏样式 */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

.logo h1 {
  margin: 0;
  color: #333333;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.top-menu {
  border-bottom: none;
  background-color: transparent;
}

.nav-item {
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #666666;
  font-weight: 500;
}

.nav-item:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.nav-item.is-active {
  background-color: #e6f7ff;
  color: #1890ff;
  border-bottom: none;
}

.nav-item .el-icon {
  margin-right: 6px;
}

.user-info {
  display: flex;
  align-items: center;
}

.support-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #007BFF;
  font-weight: 500;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.support-btn:hover {
  background-color: #007BFF;
  color: white;
  border-color: #007BFF;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.support-btn .el-icon {
  font-size: 16px;
}

/* 支持我们弹窗样式 */
.support-dialog-content {
  text-align: center;
  padding: 20px;
}

.support-qr-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.support-text {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 500;
}

/* 主要内容区域样式 */
.main-content {
  min-height: calc(100vh - 64px);
  height: auto;
  background-color: #F7F8FA;
  overflow-y: visible;
}

.content-wrapper {
  max-width: 95%;
  margin: 0 auto;
  padding: 40px 24px;
}

.api-check-disabled-notice {
  margin-bottom: 24px;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-actions {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .content-wrapper {
    padding: 24px 16px;
  }
}
</style>
