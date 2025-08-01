<template>
  <div class="converter-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-icon">
        <el-icon><Document /></el-icon>
      </div>
      <h2>简繁体转换</h2>
      <p>快速转换简体中文和繁体中文，支持大段文本处理</p>
    </div>

    <!-- 转换工具区域 -->
    <div class="converter-card">
      <div class="converter-layout">
        <!-- 输入区域 -->
        <div class="input-section">
          <div class="section-header">
            <h3>输入文本</h3>
            <el-radio-group v-model="inputType" size="default" class="type-selector">
              <el-radio-button label="simplified">简体中文</el-radio-button>
              <el-radio-button label="traditional">繁体中文</el-radio-button>
            </el-radio-group>
          </div>
          <div class="textarea-wrapper">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="12"
              placeholder="请输入要转换的文本..."
              class="input-textarea"
              resize="none"
            />
            <div class="char-count" v-if="inputText">
              {{ inputText.length }} 字符
            </div>
          </div>
        </div>

        <!-- 转换按钮区域 -->
        <div class="convert-section">
          <el-button 
            type="primary" 
            @click="convertText" 
            :loading="loading"
            class="convert-btn"
            size="large"
          >
            <el-icon v-if="!loading"><Refresh /></el-icon>
            {{ loading ? '转换中...' : '开始转换' }}
          </el-button>
          <el-button @click="clearText" class="clear-btn" size="large">
            <el-icon><Delete /></el-icon>
            清空内容
          </el-button>
        </div>

        <!-- 输出区域 -->
        <div class="output-section">
          <div class="section-header">
            <h3>转换结果</h3>
            <el-button 
              @click="copyResult" 
              :disabled="!outputText"
              class="copy-btn"
              type="primary"
              plain
            >
              <el-icon><DocumentCopy /></el-icon>
              一键复制
            </el-button>
          </div>
          <div class="textarea-wrapper">
            <el-input
              v-model="outputText"
              type="textarea"
              :rows="12"
              readonly
              placeholder="转换结果将显示在这里..."
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
  width: 100%;
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: #f0f9ff;
  border-radius: 50%;
  margin-bottom: 16px;
}

.header-icon .el-icon {
  font-size: 28px;
  color: #1890ff;
}

.page-header h2 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 0;
  font-size: 16px;
  color: #666666;
  line-height: 1.5;
}

/* 转换工具卡片 */
.converter-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.converter-layout {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
  align-items: stretch;
}

/* 区域标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

/* 类型选择器 */
.type-selector {
  border-radius: 8px;
}

.type-selector .el-radio-button__inner {
  border-radius: 6px;
  font-weight: 500;
}

/* 文本框包装器 */
.textarea-wrapper {
  position: relative;
}

.input-textarea,
.output-textarea {
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.input-textarea :deep(.el-textarea__inner),
.output-textarea :deep(.el-textarea__inner) {
  min-height: 320px;
  border-radius: 12px;
  border: 2px solid #e8e8e8;
  padding: 16px;
  font-family: inherit;
  transition: all 0.3s ease;
  max-height: 400px;
  overflow-y: auto;
}

.input-textarea :deep(.el-textarea__inner):focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.output-textarea :deep(.el-textarea__inner) {
  background-color: #fafafa;
  color: #333333;
}

/* 字符计数 */
.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #999999;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
}

/* 转换按钮区域 */
.convert-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.convert-btn {
  width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  background: transparent;
  border: 2px solid #1890ff;
  color: #1890ff;
  transition: all 0.3s ease;
}

.convert-btn:hover {
  background: #1890ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
}

.convert-btn:active {
  transform: translateY(0);
}

.clear-btn {
  width: 140px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid #d9d9d9;
  color: #666666;
  background: transparent;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #d9d9d9;
  color: white;
  box-shadow: 0 4px 12px rgba(217, 217, 217, 0.3);
}

/* 复制按钮 */
.copy-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .converter-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .convert-section {
    min-height: auto;
    flex-direction: row;
    justify-content: center;
  }
  
  .converter-card {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .converter-card {
    padding: 20px;
    border-radius: 12px;
  }
  
  .convert-section {
    flex-direction: column;
  }
  
  .convert-btn,
  .clear-btn {
    width: 120px;
  }
  
  .page-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .converter-card {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .type-selector {
    width: 100%;
  }
}
</style>
