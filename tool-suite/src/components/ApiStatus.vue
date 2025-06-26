<template>
  <div class="api-status">
    <el-alert
      v-if="!isConnected && showAlert"
      :title="alertTitle"
      :description="alertDescription"
      type="warning"
      :closable="true"
      @close="showAlert = false"
      show-icon
    >
      <template #default>
        <div class="alert-content">
          <p>{{ alertDescription }}</p>
          <div class="alert-actions">
            <el-button size="small" @click="checkConnection">
              <el-icon><Refresh /></el-icon>
              重新检查
            </el-button>
            <el-button size="small" type="primary" @click="openDocs">
              <el-icon><Document /></el-icon>
              查看文档
            </el-button>
          </div>
        </div>
      </template>
    </el-alert>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBaseURL } from '../utils/api.js'

const isConnected = ref(true)
const showAlert = ref(false)
const alertTitle = ref('后端服务连接失败')
const alertDescription = ref('')

const checkConnection = async () => {
  try {
    const baseURL = getBaseURL()
    const response = await fetch(`${baseURL}/`, {
      method: 'GET',
      mode: 'cors'
    })
    
    if (response.ok) {
      isConnected.value = true
      showAlert.value = false
    } else {
      throw new Error(`HTTP ${response.status}`)
    }
  } catch (error) {
    isConnected.value = false
    showAlert.value = true
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alertDescription.value = `无法连接到后端服务器 (${getBaseURL()})。请确保后端服务正在运行。`
    } else {
      alertDescription.value = `后端服务响应异常: ${error.message}`
    }
  }
}

const openDocs = () => {
  // 可以链接到API文档或设置说明
  window.open('https://github.com/your-repo/tool-suite#api-接口说明', '_blank')
}

onMounted(() => {
  // 延迟检查，避免页面加载时的干扰
  setTimeout(checkConnection, 1000)
})
</script>

<style scoped>
.api-status {
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
