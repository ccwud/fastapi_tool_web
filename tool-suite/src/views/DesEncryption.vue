<template>
  <div class="des-container">
    <div class="page-header">
      <h1>DES 加解密</h1>
      <p>安全的DES加密解密工具，支持自定义长度密钥</p>
    </div>
    
    <div class="des-card">
      <div class="operation-selector">
        <el-radio-group v-model="operation" size="large">
          <el-radio-button label="encrypt">加密</el-radio-button>
          <el-radio-button label="decrypt">解密</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="key-section">
        <h3>密钥设置</h3>
        <div class="key-input-group">
          <input
            v-model="secretKey"
            placeholder="请输入密钥"
            class="key-input"
          />
          <button @click="generateRandomKey" class="generate-key-btn">
            生成随机密钥
          </button>
        </div>
        <div class="key-info">
          <span>密钥长度: {{ secretKey.length }}</span>
        </div>
      </div>
      
      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h3>{{ operation === 'encrypt' ? '明文输入' : '密文输入' }}</h3>
          </div>
          <div class="textarea-container">
            <textarea
              v-model="inputText"
              :placeholder="operation === 'encrypt' ? '请输入要加密的明文...' : '请输入要解密的密文...'"
              class="input-textarea"
            ></textarea>
          </div>
          <div class="char-count">
            字符数: {{ inputText.length }}
          </div>
        </div>
        
        <div class="output-section">
          <div class="section-header">
            <h3>{{ operation === 'encrypt' ? '密文输出' : '明文输出' }}</h3>
          </div>
          <div class="textarea-container">
            <textarea
              v-model="outputText"
              readonly
              :placeholder="operation === 'encrypt' ? '加密结果将显示在这里...' : '解密结果将显示在这里...'"
              class="output-textarea"
            ></textarea>
          </div>
          <div class="char-count">
            字符数: {{ outputText.length }}
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button 
          @click="processText" 
          :disabled="loading || !secretKey"
          class="process-btn"
        >
          {{ loading ? '处理中...' : (operation === 'encrypt' ? '加密' : '解密') }}
        </button>
        <button @click="clearText" class="clear-btn">
          清空
        </button>
      </div>
    </div>
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

  if (!secretKey.value) {
    ElMessage.warning('请输入密钥')
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
  for (let i = 0; i < 16; i++) {
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
  max-width: 95%;
  margin: 0 auto;
  padding: 40px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
}

.page-header p {
  font-size: 18px;
  color: #666666;
  margin: 0;
  font-weight: 400;
}

.des-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  padding: 32px 64px;
  border: 1px solid #f0f0f0;
}

.operation-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.key-section {
  margin-bottom: 48px;
}

.key-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 20px 0;
}

.key-input-group {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.key-input {
  flex: 1;
  padding: 16px 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', Monaco, monospace;
  background-color: #fafbfc;
  transition: all 0.3s ease;
}

.key-input:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  background-color: #ffffff;
}

.generate-key-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.generate-key-btn:hover {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(108, 117, 125, 0.2);
}

.key-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #6c757d;
  font-weight: 500;
  margin-top: 8px;
}

.key-warning {
  color: #dc3545;
  font-weight: 500;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-bottom: 48px;
  align-items: stretch;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.input-textarea,
.output-textarea {
  min-height: 320px;
  max-height: 600px;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', Monaco, monospace;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.3s ease;
  overflow-y: auto;
  background-color: #fafbfc;
  width: 100%;
  box-sizing: border-box;
}

.input-textarea:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  background-color: #ffffff;
}

.output-textarea {
  background-color: #f8f9fa;
  color: #495057;
}

.output-textarea:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.textarea-container {
  position: relative;
}



.char-count {
  font-size: 13px;
  color: #6c757d;
  text-align: right;
  margin-top: 8px;
  font-weight: 500;
}



.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 16px;
}

.process-btn {
  background: #007BFF;
  color: white;
  border: 1px solid #007BFF;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
}

.process-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}

.process-btn:disabled {
  background: #f8f9fa;
  color: #adb5bd;
  border-color: #e9ecef;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.clear-btn {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(108, 117, 125, 0.2);
}

@media (max-width: 480px) {
  .des-container {
    padding: 24px 16px;
  }
  
  .page-header {
    margin-bottom: 40px;
  }
  
  .page-header h1 {
    font-size: 28px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .des-card {
    padding: 32px 24px;
  }
  
  .input-textarea,
  .output-textarea {
    min-height: 250px;
    padding: 16px;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .process-btn,
  .clear-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .key-input-group {
    flex-direction: column;
  }
  
  .generate-key-btn {
    align-self: flex-start;
  }
}
</style>
