<template>
  <div class="markdown-container">
    <div class="page-header">
      <h1>HTML 转 Markdown</h1>
      <p>将HTML代码快速转换为Markdown格式</p>
    </div>
    
    <div class="markdown-card">
      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h3>HTML 输入</h3>
            <button @click="insertTemplate" class="template-btn">
              插入模板
            </button>
          </div>
          <textarea
            v-model="htmlText"
            placeholder="请输入 HTML 文本..."
            class="input-textarea"
          ></textarea>
        </div>
        
        <div class="output-section">
          <div class="section-header">
            <h3>Markdown 输出</h3>
            <button @click="copyResult" :disabled="!markdownOutput" class="copy-btn">
              一键复制
            </button>
          </div>
          <textarea
            v-model="markdownOutput"
            readonly
            placeholder="Markdown 代码将显示在这里..."
            class="output-textarea"
          ></textarea>
          <div class="char-count" v-if="markdownOutput">
            Markdown 长度: {{ markdownOutput.length }} 字符
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button @click="convertToMarkdown" :disabled="loading" class="convert-btn">
          {{ loading ? '转换中...' : '转换为 Markdown' }}
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

.markdown-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  padding: 32px 64px;
  border: 1px solid #f0f0f0;
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

.template-btn {
  background: #f8f9fa;
  color: #007BFF;
  border: 1px solid #e9ecef;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-btn:hover {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
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

.char-count {
  font-size: 13px;
  color: #6c757d;
  text-align: right;
  margin-top: 8px;
  font-weight: 500;
}

.copy-btn {
  background: #f8f9fa;
  color: #28a745;
  border: 1px solid #e9ecef;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: #28a745;
  color: white;
  border-color: #28a745;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(40, 167, 69, 0.2);
}

.copy-btn:disabled {
  background: #f8f9fa;
  color: #adb5bd;
  border-color: #e9ecef;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 16px;
}

.convert-btn {
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

.convert-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}

.convert-btn:disabled {
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
  .markdown-container {
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
  
  .markdown-card {
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
  
  .convert-btn,
  .clear-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
