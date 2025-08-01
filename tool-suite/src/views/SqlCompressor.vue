<template>
  <div class="sql-container">
    <div class="page-header">
      <h1>SQL 压缩工具</h1>
      <p>压缩和优化 SQL 语句，减少文件大小</p>
    </div>
    
    <div class="sql-card">
      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h3>SQL 输入</h3>
            <div class="header-buttons">
              <button class="sample-btn" @click="insertSampleSql">
                示例 SQL
              </button>
              <button class="format-btn" @click="formatSql">
                格式化
              </button>
            </div>
          </div>
          <textarea
            v-model="inputSql"
            placeholder="请输入要压缩的 SQL 语句..."
            class="sql-textarea"
          ></textarea>
          <div class="sql-info">
            <span>行数: {{ inputSql.split('\n').length }}</span>
            <span>字符数: {{ inputSql.length }}</span>
          </div>
        </div>
        
        <div class="output-section">
          <div class="section-header">
            <h3>压缩结果</h3>
            <button class="copy-btn" @click="copyResult" :disabled="!outputSql">
              复制
            </button>
          </div>
          <textarea
            v-model="outputSql"
            readonly
            placeholder="压缩后的 SQL 将显示在这里..."
            class="sql-textarea output"
          ></textarea>
          <div class="result-info">
            <div class="compression-stats" v-if="outputSql">
              <div class="stat-item">
                <span class="label">压缩后字符数:</span>
                <span class="value">{{ outputSql.length }}</span>
              </div>
              <div class="stat-item">
                <span class="label">压缩率:</span>
                <span class="value success">{{ compressionRatio }}%</span>
              </div>
              <div class="stat-item">
                <span class="label">节省字符:</span>
                <span class="value primary">{{ savedChars }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button class="compress-btn" @click="compressSql" :disabled="loading">
          {{ loading ? '压缩中...' : '压缩 SQL' }}
        </button>
        <button class="clear-btn" @click="clearText">
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../utils/api.js'

const inputSql = ref('')
const outputSql = ref('')
const loading = ref(false)

const sampleSql = `SELECT 
    u.id,
    u.username,
    u.email,
    p.title,
    p.content,
    p.created_at
FROM 
    users u
INNER JOIN 
    posts p ON u.id = p.user_id
WHERE 
    u.status = 'active'
    AND p.published = 1
    AND p.created_at >= '2024-01-01'
ORDER BY 
    p.created_at DESC
LIMIT 10;`

const compressionRatio = computed(() => {
  if (!inputSql.value || !outputSql.value) return 0
  const ratio = ((inputSql.value.length - outputSql.value.length) / inputSql.value.length * 100)
  return Math.round(ratio * 100) / 100
})

const savedChars = computed(() => {
  if (!inputSql.value || !outputSql.value) return 0
  return inputSql.value.length - outputSql.value.length
})

const compressSql = async () => {
  if (!inputSql.value.trim()) {
    ElMessage.warning('请输入要压缩的 SQL 语句')
    return
  }

  loading.value = true
  try {
    const response = await api.post('/v1/text/sql-compress', {
      content: inputSql.value
    })

    outputSql.value = response.data.result
    ElMessage.success('SQL 压缩成功')
  } catch (error) {
    console.error('压缩失败:', error)
    ElMessage.error('压缩失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const formatSql = () => {
  if (!inputSql.value.trim()) {
    ElMessage.warning('请输入 SQL 语句')
    return
  }
  
  // 简单的 SQL 格式化（本地处理）
  let formatted = inputSql.value
    .replace(/\s+/g, ' ') // 多个空格替换为单个空格
    .replace(/\s*,\s*/g, ',\n    ') // 逗号后换行并缩进
    .replace(/\s*(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|ORDER BY|GROUP BY|HAVING|LIMIT)\s+/gi, '\n$1\n    ')
    .replace(/\s*;\s*/g, ';\n')
    .trim()
  
  inputSql.value = formatted
  ElMessage.success('SQL 格式化完成')
}

const insertSampleSql = () => {
  inputSql.value = sampleSql
  ElMessage.success('示例 SQL 已插入')
}

const clearText = () => {
  inputSql.value = ''
  outputSql.value = ''
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputSql.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.sql-container {
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

.sql-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
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

.sample-btn,
.format-btn {
  background: transparent;
  color: #6c757d;
  border: 2px solid #6c757d;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sample-btn:hover,
.format-btn:hover {
  background: #6c757d;
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.sql-textarea {
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

.sql-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.sql-textarea.output {
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

.sql-info {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.compress-btn {
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

.compress-btn:hover {
  background: #007bff;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.compress-btn:disabled {
  background: transparent;
  color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  margin-top: 16px;
}

.compression-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #b3d8ff;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #666;
  font-size: 14px;
}

.value {
  font-weight: 600;
  font-size: 16px;
}

.value.success {
  color: #28a745;
}

.value.primary {
  color: #007bff;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .sql-card {
    padding: 20px;
  }
  
  .sql-textarea {
    min-height: 200px;
  }
}
</style>
