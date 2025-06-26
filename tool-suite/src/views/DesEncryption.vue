<template>
  <div class="des-container">
    <el-card class="des-card">
      <template #header>
        <div class="card-header">
          <el-icon class="card-icon"><Lock /></el-icon>
          <span>DES 加解密</span>
        </div>
      </template>
      
      <div class="des-content">
        <div class="operation-selector">
          <el-radio-group v-model="operation" size="large">
            <el-radio-button label="encrypt">加密</el-radio-button>
            <el-radio-button label="decrypt">解密</el-radio-button>
          </el-radio-group>
        </div>
        
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="key-section">
              <h3>密钥设置</h3>
              <el-input
                v-model="secretKey"
                placeholder="请输入8位密钥 (如: 12345678)"
                maxlength="8"
                show-word-limit
                class="key-input"
              >
                <template #prepend>密钥</template>
              </el-input>
              <el-alert
                title="密钥必须为8位字符"
                type="info"
                :closable="false"
                show-icon
                class="key-alert"
              />
            </div>
          </el-col>
        </el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="input-section">
              <div class="section-header">
                <h3>{{ operation === 'encrypt' ? '明文输入' : '密文输入' }}</h3>
              </div>
              <el-input
                v-model="inputText"
                type="textarea"
                :rows="12"
                :placeholder="operation === 'encrypt' ? '请输入要加密的明文...' : '请输入要解密的密文...'"
                class="input-textarea"
              />
              <div class="button-group">
                <el-button 
                  type="primary" 
                  @click="processText" 
                  :loading="loading"
                  :disabled="!secretKey || secretKey.length !== 8"
                >
                  <el-icon v-if="operation === 'encrypt'"><Lock /></el-icon>
                  <el-icon v-else><Unlock /></el-icon>
                  {{ operation === 'encrypt' ? '加密' : '解密' }}
                </el-button>
                <el-button @click="clearText">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
                <el-button @click="generateRandomKey">
                  <el-icon><Refresh /></el-icon>
                  生成随机密钥
                </el-button>
              </div>
            </div>
          </el-col>
          
          <el-col :span="12">
            <div class="output-section">
              <div class="section-header">
                <h3>{{ operation === 'encrypt' ? '密文输出' : '明文输出' }}</h3>
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
                :placeholder="operation === 'encrypt' ? '加密结果将显示在这里...' : '解密结果将显示在这里...'"
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
const secretKey = ref('')
const operation = ref('encrypt')
const loading = ref(false)

const processText = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要处理的文本')
    return
  }

  if (!secretKey.value || secretKey.value.length !== 8) {
    ElMessage.warning('密钥必须为8位字符')
    return
  }

  loading.value = true
  try {
    const endpoint = operation.value === 'encrypt'
      ? '/v1/crypto/des/encrypt'
      : '/v1/crypto/des/decrypt'

    const response = await api.post(endpoint, {
      text: inputText.value,
      key: secretKey.value
    })

    outputText.value = response.data.result
    ElMessage.success(operation.value === 'encrypt' ? '加密成功' : '解密成功')
  } catch (error) {
    console.error('处理失败:', error)
    ElMessage.error('处理失败，请检查输入内容和密钥')
  } finally {
    loading.value = false
  }
}

const clearText = () => {
  inputText.value = ''
  outputText.value = ''
}

const generateRandomKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  secretKey.value = result
  ElMessage.success('随机密钥生成成功')
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
.des-container {
  max-width: 1200px;
  margin: 0 auto;
}

.des-card {
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

.des-content {
  padding: 20px 0;
}

.operation-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.key-section {
  margin-bottom: 24px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.key-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.key-input {
  margin-bottom: 12px;
}

.key-alert {
  margin: 0;
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
  flex-wrap: wrap;
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
