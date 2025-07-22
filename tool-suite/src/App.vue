<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ApiStatus from './components/ApiStatus.vue'

const router = useRouter()
const activeIndex = ref('/')
const isApiCheckDisabled = ref(false)

// 检查API状态检查是否被禁用
const checkApiCheckStatus = () => {
  isApiCheckDisabled.value = localStorage.getItem('api-check-disabled') === 'true'
}

// 重新启用API状态检查
const enableApiCheck = () => {
  localStorage.removeItem('api-check-disabled')
  isApiCheckDisabled.value = false
  // 刷新页面以重新加载API状态检查
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
  { index: '/sql-compressor', title: 'SQL压缩', icon: 'DataLine' }
]

const handleSelect = (key) => {
  activeIndex.value = key
  router.push(key)
}
</script>

<template>
  <div class="app-container">
    <el-container>
      <el-aside width="280px" class="sidebar">
        <div class="logo-section">
          <h2>工具集合</h2>
        </div>
        <el-menu
          :default-active="activeIndex"
          class="sidebar-menu"
          @select="handleSelect"
          background-color="#f5f7fa"
          text-color="#303133"
          active-text-color="#409eff"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.index"
            :index="item.index"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="header">
          <div class="header-content">
            <h1>工具集合</h1>
            <div class="user-info">
              <el-button type="primary" size="small">
                <el-icon><User /></el-icon>
                Tonfreps
              </el-button>
            </div>
          </div>
        </el-header>

        <el-main class="main-content">
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
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f2f5;
  overflow: hidden;
}

.el-container {
  height: 100vh;
}

.sidebar {
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.logo-section {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e4e7ed;
}

.logo-section h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.sidebar-menu {
  border: none;
}

.sidebar-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 6px;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #ecf5ff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: white;
}

.sidebar-menu .el-menu-item.is-active .el-icon {
  color: white;
}

.header {
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-content h1 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.main-content {
  padding: 24px;
  background-color: #f0f2f5;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.api-check-disabled-notice {
  margin-bottom: 16px;
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
</style>
