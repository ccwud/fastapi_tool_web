<template>
  <div class="json-container">
    <el-card class="json-card">
      <template #header>
        <div class="card-header">
          <el-icon class="card-icon"><DocumentCopy /></el-icon>
          <span>JSON 格式化工具</span>
          <el-button type="primary" size="small" class="functions-btn">
            JSON Functions
          </el-button>
        </div>
      </template>
      
      <div class="json-content">
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
        
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="input-section">
              <div class="section-header">
                <h3>JSON 输入</h3>
                <div class="header-buttons">
                  <el-button size="small" @click="insertSampleJson">
                    <el-icon><DocumentAdd /></el-icon>
                    示例数据
                  </el-button>
                  <el-button size="small" @click="validateJson">
                    <el-icon><CircleCheck /></el-icon>
                    验证
                  </el-button>
                </div>
              </div>
              <el-input
                v-model="inputJson"
                type="textarea"
                :rows="15"
                placeholder="请输入 JSON 数据..."
                class="json-textarea"
              />
              <div class="button-group">
                <el-button type="primary" @click="processJson">
                  <el-icon><Promotion /></el-icon>
                  {{ getProcessButtonText() }}
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
                <h3>处理结果</h3>
                <el-button size="small" @click="copyResult" :disabled="!outputJson">
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
              </div>
              <el-input
                v-model="outputJson"
                type="textarea"
                :rows="15"
                readonly
                placeholder="处理结果将显示在这里..."
                class="json-textarea output"
              />
              <div class="result-info">
                <span v-if="outputJson">
                  字符数: {{ outputJson.length }}
                </span>
                <span v-if="jsonStats.keys" class="stats">
                  | 键数: {{ jsonStats.keys }} | 层级: {{ jsonStats.depth }}
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
}

.json-card {
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

.functions-btn {
  margin-left: auto;
}

.json-content {
  padding: 20px 0;
}

.operation-tabs {
  margin-bottom: 24px;
}

.format-controls,
.escape-controls {
  display: flex;
  align-items: center;
  padding: 16px 0;
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

.header-buttons {
  display: flex;
  gap: 8px;
}

.json-textarea {
  margin-bottom: 16px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.json-textarea.output {
  background-color: #f5f7fa;
}

.button-group {
  display: flex;
  gap: 12px;
}

.result-info {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
}

.stats {
  color: #409eff;
}

.output-section {
  border-left: 1px solid #e4e7ed;
  padding-left: 24px;
}
</style>
