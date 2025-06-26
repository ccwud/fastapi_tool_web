<template>
  <div class="converter-container">
    <el-card class="converter-card">
      <template #header>
        <div class="card-header">
          <el-icon class="card-icon"><Document /></el-icon>
          <span>简繁体转换</span>
        </div>
      </template>
      
      <div class="converter-content">
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="input-section">
              <div class="section-header">
                <h3>输入文本</h3>
                <el-radio-group v-model="inputType" size="small">
                  <el-radio-button label="simplified">简体</el-radio-button>
                  <el-radio-button label="traditional">繁体</el-radio-button>
                </el-radio-group>
              </div>
              <el-input
                v-model="inputText"
                type="textarea"
                :rows="12"
                placeholder="请输入要转换的文本..."
                class="input-textarea"
              />
              <div class="button-group">
                <el-button type="primary" @click="convertText" :loading="loading">
                  <el-icon><Refresh /></el-icon>
                  转换
                </el-button>
                <el-button @click="clearText">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
              </div>
            </div>
          </el-col>
          
          <el-col :span="12">
            <div class="output-section">
              <div class="section-header">
                <h3>转换结果</h3>
                <el-button size="small" @click="copyResult" :disabled="!outputText">
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
              </div>
              <el-input
                v-model="outputText"
                type="textarea"
                :rows="12"
                readonly
                placeholder="转换结果将显示在这里..."
                class="output-textarea"
              />
              <div class="result-info">
                <span v-if="outputText">
                  字符数: {{ outputText.length }}
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../utils/api.js'

const inputText = ref('')
const outputText = ref('')
const inputType = ref('simplified')
const loading = ref(false)

const convertText = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要转换的文本')
    return
  }

  loading.value = true
  try {
    const endpoint = inputType.value === 'simplified'
      ? '/v1/text/to-traditional'
      : '/v1/text/to-simplified'

    const response = await api.post(endpoint, {
      content: inputText.value
    })

    outputText.value = response.data.result
    ElMessage.success('转换成功')
  } catch (error) {
    console.error('转换失败:', error)
    if (error.code === 'ERR_NETWORK') {
      ElMessage.error('无法连接到后端服务，请确保后端服务器正在运行')
    } else if (error.response?.status === 405) {
      ElMessage.error('请求方法不被允许，可能是CORS配置问题')
    } else {
      ElMessage.error('转换失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

const clearText = () => {
  inputText.value = ''
  outputText.value = ''
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.converter-container {
  max-width: 1200px;
  margin: 0 auto;
}

.converter-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 18px;
}

.card-icon {
  font-size: 20px;
  color: #409eff;
}

.converter-content {
  padding: 20px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.input-textarea,
.output-textarea {
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.result-info {
  text-align: right;
  color: #909399;
  font-size: 12px;
}

.output-section {
  border-left: 1px solid #e4e7ed;
  padding-left: 24px;
}
</style>
