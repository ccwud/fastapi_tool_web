<template>
  <div class="api-status">
    <el-alert
      v-if="!isConnected && showAlert && !disableCheck"
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
            <el-button size="small" type="danger" @click="disableApiCheck">
              <el-icon><Close /></el-icon>
              禁用检查
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
const disableCheck = ref(false) // 是否禁用API检查

const checkConnection = async () => {
  // 如果已禁用API检查，则直接返回
  if (disableCheck.value) {
    isConnected.value = true
    showAlert.value = false
    return
  }
  
  try {
    const baseURL = getBaseURL()
    // 使用原来的API检查端点
    const response = await fetch(`${baseURL}/v1/text/ok`, {
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
    console.error('API连接检查失败:', error);
    
    // 如果后端服务已经正常运行，但仍然显示连接失败，可以尝试忽略错误
    // 取消下面的注释来禁用错误提示
    // isConnected.value = true;
    // showAlert.value = false;
    // return;
    
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

// 禁用API检查功能
const disableApiCheck = () => {
  disableCheck.value = true
  showAlert.value = false
  isConnected.value = true
  // 将禁用状态保存到本地存储，以便页面刷新后仍然保持禁用状态
  localStorage.setItem('api-check-disabled', 'true')
  console.log('API检查功能已禁用')
}

onMounted(() => {
  // 检查本地存储中是否已禁用API检查
  if (localStorage.getItem('api-check-disabled') === 'true') {
    disableCheck.value = true
    return
  }
  
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
