<template>
  <div class="translator-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-icon">
        <el-icon><ChatDotRound /></el-icon>
      </div>
      <h2>中英文翻译</h2>
      <p>智能中英文互译服务，支持长文本翻译</p>
    </div>

    <!-- 翻译工具区域 -->
    <div class="translator-card">
      <!-- 语言选择器和切换按钮 -->
      <div class="language-header">
        <div class="language-option">
          <span class="language-label">源语言</span>
          <el-select v-model="sourceLanguage" class="language-select">
            <el-option label="中文" value="zh" />
            <el-option label="English" value="en" />
          </el-select>
        </div>
        
        <el-button 
          type="text" 
          @click="swapLanguages"
          class="swap-button"
        >
          <el-icon><Refresh /></el-icon>
        </el-button>
        
        <div class="language-option">
          <span class="language-label">目标语言</span>
          <el-select v-model="targetLanguage" class="language-select">
            <el-option label="中文" value="zh" />
            <el-option label="English" value="en" />
          </el-select>
        </div>
      </div>

      <!-- 左右布局的翻译区域 -->
      <div class="translator-layout">
        <!-- 左栏：输入区域 -->
        <div class="input-section">
          <div class="textarea-wrapper">
            <el-input
              v-model="inputText"
              type="textarea"
              :placeholder="sourceLanguage === 'zh' ? '请输入要翻译的中文...' : 'Please enter English text to translate...'"
              class="input-textarea"
              maxlength="5000"
              resize="none"
            />
            <div class="char-count">{{ inputText.length }}/5000</div>
          </div>
          
          <!-- 按钮区域 -->
          <div class="button-section">
            <el-button 
              type="primary" 
              @click="translateText" 
              :loading="loading"
              class="translate-btn"
              size="large"
            >
              <el-icon v-if="!loading"><Promotion /></el-icon>
              {{ loading ? '翻译中...' : '开始翻译' }}
            </el-button>
            <el-button @click="clearText" class="clear-btn" size="large">
              <el-icon><Delete /></el-icon>
              清空内容
            </el-button>
          </div>
        </div>

        <!-- 右栏：输出区域 -->
        <div class="output-section">
          <div class="textarea-wrapper">
            <el-button 
              @click="copyResult" 
              :disabled="!outputText"
              class="copy-btn"
              type="text"
            >
              <el-icon><DocumentCopy /></el-icon>
            </el-button>
            <el-input
              v-model="outputText"
              type="textarea"
              readonly
              :placeholder="targetLanguage === 'zh' ? '翻译结果将显示在这里...' : 'Translation result will be displayed here...'"
              class="output-textarea"
              resize="none"
            />
            <div class="char-count" v-if="outputText">
              {{ outputText.length }} 字符
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../utils/api.js'

const inputText = ref('')
const outputText = ref('')
const sourceLanguage = ref('zh')
const targetLanguage = ref('en')
const loading = ref(false)

// 监听语言变化，确保源语言和目标语言不同
watch([sourceLanguage, targetLanguage], ([newSource, newTarget]) => {
  if (newSource === newTarget) {
    if (newSource === 'zh') {
      targetLanguage.value = 'en'
    } else {
      targetLanguage.value = 'zh'
    }
  }
})

const swapLanguages = () => {
  const temp = sourceLanguage.value
  sourceLanguage.value = targetLanguage.value
  targetLanguage.value = temp
  
  // 交换输入和输出文本
  const tempText = inputText.value
  inputText.value = outputText.value
  outputText.value = tempText
}

const translateText = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要翻译的文本')
    return
  }

  loading.value = true
  try {
    const response = await api.post('/v1/text/translate', {
      content: inputText.value,
      target_lang: targetLanguage.value
    })

    outputText.value = response.data.result
    ElMessage.success('翻译成功')
  } catch (error) {
    console.error('翻译失败:', error)
    ElMessage.error('翻译失败，请稍后重试')
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
.translator-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #000;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 翻译卡片容器 */
.translator-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 语言选择器头部 */
.language-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  margin-bottom: 16px;
}

.language-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.language-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.language-select {
  width: 160px;
}

/* 语言切换按钮 */
.swap-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.swap-button:hover {
  background: #0056b3;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

/* 左右布局容器 */
.translator-layout {
  display: flex;
  gap: 48px;
  align-items: stretch;
}

/* 左栏：输入区域 */
.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 右栏：输出区域 */
.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 文本框包装器 */
.textarea-wrapper {
  position: relative;
  flex: 1;
}

/* 字符计数 */
.char-count {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

/* 文本输入框 */
.input-textarea :deep(.el-textarea__inner) {
  min-height: 320px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  transition: all 0.3s ease;
  background-color: #fff;
}

.input-textarea :deep(.el-textarea__inner):focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* 输出文本框 */
.output-textarea :deep(.el-textarea__inner) {
  min-height: 320px;
  padding: 20px;
  padding-top: 50px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  background-color: #f8f9fa;
  color: #333;
}

/* 复制按钮 */
.copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
  backdrop-filter: blur(4px);
}

.copy-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.copy-btn:disabled {
  background: rgba(255, 255, 255, 0.5);
  color: #ccc;
  border-color: #f0f0f0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 按钮区域 */
.button-section {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* 主要翻译按钮 */
.translate-btn {
  flex: 1;
  background: #007bff;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.translate-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.translate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 次要清空按钮 */
.clear-btn {
  background: transparent;
  color: #6c757d;
  border: 2px solid #e9ecef;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #f8f9fa;
  border-color: #6c757d;
  color: #495057;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .translator-card {
    padding: 20px;
    gap: 24px;
  }
  
  .language-header {
    gap: 24px;
    margin-bottom: 12px;
  }
  
  .language-select {
    width: 120px;
  }
  
  .swap-button {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .translator-layout {
    flex-direction: column;
    gap: 24px;
  }
  
  .input-textarea :deep(.el-textarea__inner),
  .output-textarea :deep(.el-textarea__inner) {
    min-height: 200px;
    padding: 16px;
    font-size: 14px;
  }
  
  .output-textarea :deep(.el-textarea__inner) {
    padding-top: 40px;
  }
  
  .button-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .translate-btn {
    padding: 12px 20px;
    font-size: 14px;
  }
  
  .copy-btn {
    width: 32px;
    height: 32px;
    top: 8px;
    right: 8px;
  }
}
</style>
