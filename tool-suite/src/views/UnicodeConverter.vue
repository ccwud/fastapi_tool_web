<template>
  <div class="unicode-container">
    <div class="page-header">
      <h1>Unicode 转换工具</h1>
      <p>字符串与Unicode编码之间的相互转换</p>
    </div>
    
    <div class="unicode-card">
      <div class="operation-tabs">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="字符串转Unicode" name="encode">
            <div class="encode-controls">
              <el-radio-group v-model="encodeFormat" size="small">
                <el-radio-button label="\\u">\\u格式</el-radio-button>
                <el-radio-button label="\\x">\\x格式</el-radio-button>
                <el-radio-button label="&#x">&#x格式</el-radio-button>
                <el-radio-button label="U+">U+格式</el-radio-button>
              </el-radio-group>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Unicode转字符串" name="decode">
            <div class="decode-controls">
              <el-checkbox v-model="autoDetectFormat" size="small">
                自动检测格式
              </el-checkbox>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h3>{{ activeTab === 'encode' ? '字符串输入' : 'Unicode输入' }}</h3>
            <div class="header-buttons">
              <button @click="insertSample" class="sample-btn">
                插入示例
              </button>
            </div>
          </div>
          <textarea
            v-model="inputText"
            :placeholder="activeTab === 'encode' ? '请输入要转换的字符串...' : '请输入Unicode编码...'"
            class="unicode-textarea"
          ></textarea>
        </div>
        
        <div class="output-section">
          <div class="section-header">
            <h3>{{ activeTab === 'encode' ? 'Unicode输出' : '字符串输出' }}</h3>
            <button @click="copyResult" :disabled="!outputText" class="copy-btn">
              一键复制
            </button>
          </div>
          <textarea
            v-model="outputText"
            readonly
            placeholder="转换结果将显示在这里..."
            class="unicode-textarea output"
          ></textarea>
          <div class="result-info">
            <span v-if="outputText">
              字符数: {{ outputText.length }}
            </span>
            <span v-if="charCount > 0" class="stats">
              | 原始字符数: {{ charCount }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button @click="convertText" class="process-btn">
          {{ activeTab === 'encode' ? '转换为Unicode' : '转换为字符串' }}
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

const inputText = ref('')
const outputText = ref('')
const activeTab = ref('encode')
const encodeFormat = ref('\\u')
const autoDetectFormat = ref(true)
const charCount = ref(0)

const sampleTexts = {
  encode: '你好世界！Hello World! 🌍',
  decode: '\\u4f60\\u597d\\u4e16\\u754c\\uff01Hello World! \\ud83c\\udf0d'
}

// 字符串转Unicode
const stringToUnicode = (str, format) => {
  let result = ''
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const code = char.charCodeAt(0)
    
    // 处理ASCII字符（可选择是否转换）
    if (code < 128 && /[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(char)) {
      result += char
    } else {
      switch (format) {
        case '\\u':
          result += '\\u' + code.toString(16).padStart(4, '0')
          break
        case '\\x':
          if (code <= 0xFF) {
            result += '\\x' + code.toString(16).padStart(2, '0')
          } else {
            result += '\\u' + code.toString(16).padStart(4, '0')
          }
          break
        case '&#x':
          result += '&#x' + code.toString(16).toUpperCase() + ';'
          break
        case 'U+':
          result += 'U+' + code.toString(16).toUpperCase().padStart(4, '0') + ' '
          break
        default:
          result += '\\u' + code.toString(16).padStart(4, '0')
      }
    }
  }
  
  return result.trim()
}

// Unicode转字符串
const unicodeToString = (str) => {
  let result = str
  
  try {
    // 处理\u格式
    result = result.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    
    // 处理\x格式
    result = result.replace(/\\x([0-9a-fA-F]{2})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    
    // 处理&#x格式
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    
    // 处理U+格式
    result = result.replace(/U\+([0-9a-fA-F]{4,})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16))
    })
    
    return result
  } catch (error) {
    throw new Error('Unicode格式错误')
  }
}

const convertText = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要转换的内容')
    return
  }
  
  try {
    if (activeTab.value === 'encode') {
      // 字符串转Unicode
      outputText.value = stringToUnicode(inputText.value, encodeFormat.value)
      charCount.value = inputText.value.length
      ElMessage.success('转换为Unicode成功')
    } else {
      // Unicode转字符串
      outputText.value = unicodeToString(inputText.value)
      charCount.value = outputText.value.length
      ElMessage.success('转换为字符串成功')
    }
  } catch (error) {
    ElMessage.error(`转换失败: ${error.message}`)
  }
}

const insertSample = () => {
  inputText.value = sampleTexts[activeTab.value]
  ElMessage.success('示例数据已插入')
}

const clearText = () => {
  inputText.value = ''
  outputText.value = ''
  charCount.value = 0
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const handleTabClick = () => {
  outputText.value = ''
  charCount.value = 0
}
</script>

<style scoped>
.unicode-container {
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

.unicode-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

.operation-tabs {
  margin-bottom: 32px;
}

.encode-controls,
.decode-controls {
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  align-items: stretch;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.sample-btn {
  background: transparent;
  color: #6c757d;
  border: 2px solid #6c757d;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sample-btn:hover {
  background: #6c757d;
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.unicode-textarea {
  min-height: 320px;
  max-height: 500px;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Courier New', Monaco, monospace;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease;
  overflow-y: auto;
}

.unicode-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.unicode-textarea.output {
  background-color: #f8f9fa;
}

.copy-btn {
  background: transparent;
  color: #28a745;
  border: 2px solid #28a745;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #28a745;
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.copy-btn:disabled {
  background: transparent;
  color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.process-btn {
  background: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.process-btn:hover {
  background: #007bff;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.clear-btn {
  background: transparent;
  color: #6c757d;
  border: 2px solid #6c757d;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #6c757d;
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.result-info {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.stats {
  color: #007bff;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .unicode-card {
    padding: 20px;
  }
  
  .unicode-textarea {
    min-height: 200px;
  }
}
</style>