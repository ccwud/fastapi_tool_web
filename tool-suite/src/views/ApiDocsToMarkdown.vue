<template>
  <div class="converter-container">
    <div class="page-header">
      <h1>hoppscotch转markdown</h1>
      <p>支持 Hoppscotch 导出的接口文档 JSON，转换为 Markdown 文本</p>
    </div>

    <div class="converter-card">
      <div class="content-grid">
        <div class="input-section">
          <div class="section-header">
            <h3>JSON 输入（Hoppscotch 文档）</h3>
            <button @click="insertSample" class="template-btn">插入示例</button>
          </div>
          <textarea
            v-model="jsonText"
            placeholder="请输入 Hoppscotch 导出的接口文档 JSON（示例可点击右上角插入）"
            class="input-textarea"
          ></textarea>
        </div>

        <div class="output-section">
          <div class="section-header">
            <h3>Markdown 输出</h3>
            <div class="section-actions">
              <button @click="copyResult" :disabled="!markdownOutput" class="copy-btn">一键复制</button>
              <button @click="downloadMarkdown" :disabled="!markdownOutput" class="download-btn">下载 .md</button>
            </div>
          </div>
          <textarea
            v-model="markdownOutput"
            readonly
            placeholder="转换后的 Markdown 文本将显示在这里"
            class="output-textarea"
          ></textarea>
          <div class="char-count" v-if="markdownOutput">
            Markdown 长度: {{ markdownOutput.length }} 字符
          </div>
        </div>
      </div>

      <div class="button-group">
        <button @click="convert" :disabled="loading" class="convert-btn">
          {{ loading ? '转换中...' : '转换为 Markdown' }}
        </button>
        <button @click="clearAll" class="clear-btn">清空</button>
      </div>
    </div>
  </div>
  </template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../utils/api.js'

const jsonText = ref('')
const markdownOutput = ref('')
const loading = ref(false)

// 示例 JSON（符合你提供的 Hoppscotch 文档结构，无 data 包装）
const sampleJson = {
  v: 10,
  id: 'cmhsp42tw0046qi7qcf4sp8ao',
  name: '1.55',
  folders: [],
  requests: [
    {
      v: '16',
      name: '/partner/page',
      method: 'GET',
      endpoint: 'http://<<ip>>/api/supplier/partner/page?page=1&size=5',
      params: [],
      headers: [],
      preRequestScript: '',
      testScript: '',
      auth: { authType: 'inherit', authActive: true },
      body: { contentType: null, body: null },
      requestVariables: [],
      responses: {},
      _ref_id: 'req_mhsp4hsn_5b705e16-ba20-411d-ba65-986d5d0d7984'
    }
  ]
}

const insertSample = () => {
  jsonText.value = JSON.stringify(sampleJson, null, 2)
  ElMessage.success('示例已插入')
}

const convert = async () => {
  if (!jsonText.value.trim()) {
    ElMessage.warning('请输入接口文档 JSON')
    return
  }

  // 兼容两种入参：
  // 1) 直接为 Hoppscotch 文档对象
  // 2) 已包含 { data: <文档> } 的对象
  let payload
  try {
    payload = JSON.parse(jsonText.value)
  } catch (e) {
    ElMessage.error('JSON 格式错误，请检查输入')
    return
  }

  const requestBody = payload && typeof payload === 'object' && 'data' in payload
    ? payload
    : { data: payload }

  loading.value = true
  try {
    // axios 基础路径为 /api，这里使用后端路由 /api/v1/text/api-docs-to-markdown 的相对形式
    const res = await api.post('/v1/text/api-docs-to-markdown', requestBody)
    markdownOutput.value = res.data?.result || ''
    if (markdownOutput.value) {
      ElMessage.success('转换成功')
    } else {
      ElMessage.warning('转换完成，但返回内容为空')
    }
  } catch (err) {
    console.error('转换失败:', err)
    ElMessage.error('转换失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const clearAll = () => {
  jsonText.value = ''
  markdownOutput.value = ''
}

const copyResult = async () => {
  if (!markdownOutput.value) return
  try {
    await navigator.clipboard.writeText(markdownOutput.value)
    ElMessage.success('Markdown 已复制')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

const downloadMarkdown = () => {
  if (!markdownOutput.value) return
  const blob = new Blob([markdownOutput.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'hoppscotch.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.converter-container {
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
  font-size: 32px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 12px 0;
}

.page-header p {
  font-size: 16px;
  color: #666666;
  margin: 0;
}

.converter-card {
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
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 8px;
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
  line-height: 1.6;
  resize: vertical;
  width: 100%;
}

.input-textarea {
  background: #fafafa;
}

.output-textarea {
  background: #fcfcff;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.convert-btn {
  background: #4CAF50;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.convert-btn:hover { opacity: 0.9; }

.clear-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e9ecef;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn, .download-btn {
  background: #f8f9fa;
  color: #007BFF;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover, .download-btn:hover {
  background: #007BFF;
  color: white;
  border-color: #007BFF;
}

@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; gap: 24px; }
  .converter-card { padding: 24px; }
}
</style>