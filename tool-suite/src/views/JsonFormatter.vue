<template>
  <div class="json-container">
    <div class="page-header">
      <h1>JSON 格式化工具</h1>
      <p>JSON格式化、压缩、转义和验证工具</p>
    </div>
    
    <div class="json-card">
      <div class="operation-tabs">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="格式化" name="format">
            <div class="format-controls">
              <el-radio-group v-model="formatType" size="small">
                <el-radio-button label="pretty">美化格式</el-radio-button>
                <el-radio-button label="minify">压缩格式</el-radio-button>
              </el-radio-group>
              <el-input-number
                v-model="indentSize"
                :min="2"
                :max="8"
                size="small"
                controls-position="right"
                style="width: 100px; margin-left: 16px;"
              />
              <span style="margin-left: 8px; color: #606266;">缩进空格</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="转义" name="escape">
            <div class="escape-controls">
              <el-radio-group v-model="escapeType" size="small">
                <el-radio-button label="escape">转义</el-radio-button>
                <el-radio-button label="unescape">反转义</el-radio-button>
              </el-radio-group>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h3>JSON 输入</h3>
            <div class="header-buttons">
                <button @click="insertSampleJson" class="sample-btn">
                  插入示例
                </button>
              </div>
            </div>
            <textarea
              v-model="inputJson"
              placeholder="请输入 JSON 数据..."
              class="json-textarea"
            ></textarea>
          </div>
          
          <div class="output-section">
            <div class="section-header">
              <h3>处理结果</h3>
              <button @click="copyResult" :disabled="!outputJson" class="copy-btn">
                一键复制
              </button>
            </div>
            <textarea
              v-model="outputJson"
              readonly
              placeholder="处理结果将显示在这里..."
              class="json-textarea output"
            ></textarea>
            <div class="result-info">
              <span v-if="outputJson">
                字符数: {{ outputJson.length }}
              </span>
              <span v-if="jsonStats.keys" class="stats">
                | 键数: {{ jsonStats.keys }} | 层级: {{ jsonStats.depth }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="button-group">
          <button @click="processJson" class="process-btn">
            {{ getProcessButtonText() }}
          </button>
          <button @click="clearText" class="clear-btn">
            清空
          </button>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const inputJson = ref('')
const outputJson = ref('')
const activeTab = ref('format')
const formatType = ref('pretty')
const escapeType = ref('escape')
const indentSize = ref(2)

const jsonStats = reactive({
  keys: 0,
  depth: 0
})

const sampleJson = {
  "name": "张三",
  "age": 30,
  "city": "北京",
  "hobbies": ["读书", "游泳", "编程"],
  "address": {
    "street": "朝阳路123号",
    "zipcode": "100000"
  },
  "isActive": true,
  "score": null
}

const getProcessButtonText = () => {
  if (activeTab.value === 'format') {
    return formatType.value === 'pretty' ? '美化格式' : '压缩格式'
  } else {
    return escapeType.value === 'escape' ? '转义' : '反转义'
  }
}

const validateJson = () => {
  if (!inputJson.value.trim()) {
    ElMessage.warning('请输入 JSON 数据')
    return false
  }
  
  try {
    JSON.parse(inputJson.value)
    ElMessage.success('JSON 格式正确')
    return true
  } catch (error) {
    ElMessage.error(`JSON 格式错误: ${error.message}`)
    return false
  }
}

const calculateJsonStats = (obj, depth = 0) => {
  let keys = 0
  let maxDepth = depth
  
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      keys += obj.length
      obj.forEach(item => {
        const stats = calculateJsonStats(item, depth + 1)
        keys += stats.keys
        maxDepth = Math.max(maxDepth, stats.depth)
      })
    } else {
      const objKeys = Object.keys(obj)
      keys += objKeys.length
      objKeys.forEach(key => {
        const stats = calculateJsonStats(obj[key], depth + 1)
        keys += stats.keys
        maxDepth = Math.max(maxDepth, stats.depth)
      })
    }
  }
  
  return { keys, depth: maxDepth }
}

const processJson = () => {
  if (!inputJson.value.trim()) {
    ElMessage.warning('请输入要处理的数据')
    return
  }
  
  try {
    if (activeTab.value === 'format') {
      // JSON 格式化
      const parsed = JSON.parse(inputJson.value)
      
      if (formatType.value === 'pretty') {
        outputJson.value = JSON.stringify(parsed, null, indentSize.value)
      } else {
        outputJson.value = JSON.stringify(parsed)
      }
      
      // 计算统计信息
      const stats = calculateJsonStats(parsed)
      jsonStats.keys = stats.keys
      jsonStats.depth = stats.depth
      
      ElMessage.success('格式化成功')
    } else {
      // JSON 转义/反转义
      if (escapeType.value === 'escape') {
        // 转义
        outputJson.value = JSON.stringify(inputJson.value)
      } else {
        // 反转义
        try {
          outputJson.value = JSON.parse(inputJson.value)
        } catch (error) {
          ElMessage.error('反转义失败，请检查输入格式')
          return
        }
      }
      
      jsonStats.keys = 0
      jsonStats.depth = 0
      
      ElMessage.success(escapeType.value === 'escape' ? '转义成功' : '反转义成功')
    }
  } catch (error) {
    ElMessage.error(`处理失败: ${error.message}`)
  }
}

const insertSampleJson = () => {
  inputJson.value = JSON.stringify(sampleJson, null, 2)
  ElMessage.success('示例数据已插入')
}

const clearText = () => {
  inputJson.value = ''
  outputJson.value = ''
  jsonStats.keys = 0
  jsonStats.depth = 0
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputJson.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const handleTabClick = () => {
  outputJson.value = ''
  jsonStats.keys = 0
  jsonStats.depth = 0
}
</script>

<style scoped>
.json-container {
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

.json-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

.operation-tabs {
  margin-bottom: 32px;
}

.format-controls,
.escape-controls {
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

.json-textarea {
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

.json-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.json-textarea.output {
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
  
  .json-card {
    padding: 20px;
  }
  
  .json-textarea {
    min-height: 200px;
  }
}
</style>
