<template>
  <div class="markdown-container">
    <el-card class="markdown-card">
      <template #header>
        <div class="card-header">
          <el-icon class="card-icon"><Document /></el-icon>
          <span>HTML 转 Markdown</span>
        </div>
      </template>
      
      <div class="markdown-content">
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="input-section">
              <div class="section-header">
                <h3>HTML 输入</h3>
                <div class="header-buttons">
                  <el-button size="small" @click="insertTemplate">
                    <el-icon><DocumentAdd /></el-icon>
                    插入模板
                  </el-button>
                </div>
              </div>
              <el-input
                v-model="htmlText"
                type="textarea"
                :rows="15"
                placeholder="请输入 HTML 文本..."
                class="input-textarea"
              />
              <div class="button-group">
                <el-button type="primary" @click="convertToMarkdown" :loading="loading">
                  <el-icon><Promotion /></el-icon>
                  转换为 Markdown
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
                <h3>Markdown 输出</h3>
                <el-button size="small" @click="copyResult" :disabled="!markdownOutput">
                  <el-icon><DocumentCopy /></el-icon>
                  复制 Markdown
                </el-button>
              </div>

              <el-input
                v-model="markdownOutput"
                type="textarea"
                :rows="15"
                readonly
                placeholder="Markdown 代码将显示在这里..."
                class="output-textarea"
              />

              <div class="result-info">
                <span v-if="markdownOutput">
                  Markdown 长度: {{ markdownOutput.length }} 字符
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

const htmlText = ref('')
const markdownOutput = ref('')
const loading = ref(false)

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <title>示例页面</title>
</head>
<body>
    <h1>主标题</h1>
    <h2>副标题</h2>
    <p>这是一个段落，包含 <strong>粗体文本</strong> 和 <em>斜体文本</em>。</p>

    <ul>
        <li>列表项 1</li>
        <li>列表项 2</li>
        <li>列表项 3</li>
    </ul>

    <ol>
        <li>有序列表项 1</li>
        <li>有序列表项 2</li>
        <li>有序列表项 3</li>
    </ol>

    <blockquote>
        <p>这是一个引用块</p>
    </blockquote>

    <a href="https://example.com">链接文本</a>

    <table>
        <thead>
            <tr>
                <th>表格标题1</th>
                <th>表格标题2</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>单元格1</td>
                <td>单元格2</td>
            </tr>
            <tr>
                <td>单元格3</td>
                <td>单元格4</td>
            </tr>
        </tbody>
    </table>
</body>
</html>`

const convertToMarkdown = async () => {
  if (!htmlText.value.trim()) {
    ElMessage.warning('请输入 HTML 文本')
    return
  }

  loading.value = true
  try {
    const response = await api.post('/v1/text/html-to-markdown', {
      content: htmlText.value
    })

    markdownOutput.value = response.data.result
    ElMessage.success('转换成功')
  } catch (error) {
    console.error('转换失败:', error)
    ElMessage.error('转换失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const insertTemplate = () => {
  htmlText.value = htmlTemplate
  ElMessage.success('模板已插入')
}

const clearText = () => {
  htmlText.value = ''
  markdownOutput.value = ''
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(markdownOutput.value)
    ElMessage.success('Markdown 代码复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.markdown-container {
  max-width: 1200px;
  margin: 0 auto;
}

.markdown-card {
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

.markdown-content {
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

.input-textarea,
.output-textarea {
  margin-bottom: 16px;
  font-family: 'Courier New', monospace;
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
