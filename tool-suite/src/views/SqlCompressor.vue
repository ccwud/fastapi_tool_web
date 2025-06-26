<template>
  <div class="sql-container">
    <el-card class="sql-card">
      <template #header>
        <div class="card-header">
          <el-icon class="card-icon"><DataLine /></el-icon>
          <span>SQL 压缩工具</span>
        </div>
      </template>
      
      <div class="sql-content">
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="input-section">
              <div class="section-header">
                <h3>SQL 输入</h3>
                <div class="header-buttons">
                  <el-button size="small" @click="insertSampleSql">
                    <el-icon><DocumentAdd /></el-icon>
                    示例 SQL
                  </el-button>
                  <el-button size="small" @click="formatSql">
                    <el-icon><MagicStick /></el-icon>
                    格式化
                  </el-button>
                </div>
              </div>
              <el-input
                v-model="inputSql"
                type="textarea"
                :rows="15"
                placeholder="请输入要压缩的 SQL 语句..."
                class="sql-textarea"
              />
              <div class="sql-info">
                <span>行数: {{ inputSql.split('\n').length }}</span>
                <span>字符数: {{ inputSql.length }}</span>
              </div>
              <div class="button-group">
                <el-button type="primary" @click="compressSql" :loading="loading">
                  <el-icon><Compress /></el-icon>
                  压缩 SQL
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
                <h3>压缩结果</h3>
                <el-button size="small" @click="copyResult" :disabled="!outputSql">
                  <el-icon><DocumentCopy /></el-icon>
                  复制
                </el-button>
              </div>
              <el-input
                v-model="outputSql"
                type="textarea"
                :rows="15"
                readonly
                placeholder="压缩后的 SQL 将显示在这里..."
                class="sql-textarea output"
              />
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
          </el-col>
        </el-row>
      </div>
    </el-card>
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
}

.sql-card {
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

.sql-content {
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

.header-buttons {
  display: flex;
  gap: 8px;
}

.sql-textarea {
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.sql-textarea.output {
  background-color: #f5f7fa;
}

.sql-info {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  color: #909399;
  font-size: 12px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.result-info {
  margin-top: 12px;
}

.compression-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #b3d8ff;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #606266;
  font-size: 12px;
}

.value {
  font-weight: 600;
  font-size: 14px;
}

.value.success {
  color: #67c23a;
}

.value.primary {
  color: #409eff;
}

.output-section {
  border-left: 1px solid #e4e7ed;
  padding-left: 24px;
}
</style>
