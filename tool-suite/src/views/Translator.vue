<template>
  <div class="translator-container">
    <el-card class="translator-card">
      <template #header>
        <div class="card-header">
          <el-icon class="card-icon"><ChatDotRound /></el-icon>
          <span>中英文翻译</span>
        </div>
      </template>
      
      <div class="translator-content">
        <div class="language-selector">
          <el-select v-model="sourceLanguage" placeholder="源语言" style="width: 120px">
            <el-option label="中文" value="zh" />
            <el-option label="English" value="en" />
          </el-select>
          
          <el-button 
            type="text" 
            @click="swapLanguages"
            class="swap-button"
          >
            <el-icon><Refresh /></el-icon>
          </el-button>
          
          <el-select v-model="targetLanguage" placeholder="目标语言" style="width: 120px">
            <el-option label="中文" value="zh" />
            <el-option label="English" value="en" />
          </el-select>
        </div>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="input-section">
              <div class="section-header">
                <h3>{{ sourceLanguage === 'zh' ? '中文输入' : 'English Input' }}</h3>
                <span class="char-count">{{ inputText.length }}/5000</span>
              </div>
              <el-input
                v-model="inputText"
                type="textarea"
                :rows="12"
                :placeholder="sourceLanguage === 'zh' ? '请输入要翻译的中文...' : 'Please enter English text to translate...'"
                class="input-textarea"
                maxlength="5000"
                show-word-limit
              />
              <div class="button-group">
                <el-button type="primary" @click="translateText" :loading="loading">
                  <el-icon><Promotion /></el-icon>
                  翻译
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
                <h3>{{ targetLanguage === 'zh' ? '中文翻译' : 'English Translation' }}</h3>
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
                :placeholder="targetLanguage === 'zh' ? '翻译结果将显示在这里...' : 'Translation result will be displayed here...'"
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
}

.translator-card {
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

.translator-content {
  padding: 20px 0;
}

.language-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.swap-button {
  padding: 8px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
}

.swap-button:hover {
  background-color: #337ecc;
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

.char-count {
  color: #909399;
  font-size: 12px;
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
