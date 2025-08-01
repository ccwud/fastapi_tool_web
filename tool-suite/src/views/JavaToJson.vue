<template>
  <div class="java-to-json-container">
    <div class="page-header">
      <h1>Java 转 JSON 工具</h1>
      <p>将Java类代码(POJO)转换为JSON示例数据</p>
    </div>
    
    <div class="converter-card">
      <div class="content-grid">
        <!-- 左侧输入区域 -->
        <div class="input-section">
          <div class="section-header">
            <h3>Java 类代码</h3>
            <div class="header-buttons">
              <button @click="insertSampleJava" class="sample-btn">
                插入示例
              </button>
            </div>
          </div>
          <textarea
            v-model="javaCode"
            placeholder="请输入Java类代码...\n\n示例：\npublic class User {\n    private String name;\n    private int age;\n    private boolean active;\n}"
            class="java-textarea"
          ></textarea>
        </div>
        
        <!-- 右侧输出区域 -->
        <div class="output-section">
          <div class="section-header">
            <h3>JSON 结果</h3>
            <button @click="copyResult" :disabled="!jsonResult" class="copy-btn">
              一键复制
            </button>
          </div>
          <textarea
            v-model="jsonResult"
            readonly
            placeholder="转换结果将显示在这里..."
            class="java-textarea output"
          ></textarea>
          <div class="result-info" v-if="jsonResult">
            <span>字符数: {{ jsonResult.length }}</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="button-group">
        <button @click="convertToJson" class="convert-btn">
          转换
        </button>
        <button @click="clearAll" class="clear-btn">
          清空
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const javaCode = ref('')
const jsonResult = ref('')

// 示例Java代码
const sampleJavaCode = `public class User {
    private String name;
    private int age;
    private boolean active;
    private String email;
    private Date createTime;
    private List<String> hobbies;
    private Map<String, Object> metadata;
    private Address address;
}`

// 插入示例代码
const insertSampleJava = () => {
  javaCode.value = sampleJavaCode
}

// 类型映射规则
const getDefaultValue = (type) => {
  // 移除泛型信息，只保留基础类型
  const baseType = type.replace(/<.*>/g, '').trim()
  
  switch (baseType.toLowerCase()) {
    // 字符串类型
    case 'string':
    case 'char':
    case 'character':
      return '"example"'
    
    // 整数类型
    case 'int':
    case 'integer':
    case 'long':
    case 'short':
    case 'byte':
    case 'biginteger':
      return 0
    
    // 浮点数类型
    case 'double':
    case 'float':
    case 'bigdecimal':
      return 0.0
    
    // 布尔类型
    case 'boolean':
      return false
    
    // 日期时间类型
    case 'date':
    case 'localdate':
    case 'localdatetime':
    case 'timestamp':
      return '"2023-10-27 10:00:00"'
    
    // 集合类型
    case 'list':
    case 'set':
    case 'collection':
    case 'arraylist':
    case 'hashset':
      return []
    
    // Map类型
    case 'map':
    case 'hashmap':
    case 'linkedhashmap':
      return {}
    
    // 其他自定义类型
    default:
      return {}
  }
}

// 解析Java字段的正则表达式
const parseJavaFields = (code) => {
  const fields = []
  
  // 匹配字段声明的正则表达式
  // 匹配: [访问修饰符] [static] [final] 类型 字段名;
  const fieldRegex = /(?:private|public|protected)?\s*(?:static)?\s*(?:final)?\s*([A-Za-z_][\w<>\[\],\s]*?)\s+([a-zA-Z_][\w]*)\s*;/g
  
  let match
  while ((match = fieldRegex.exec(code)) !== null) {
    const type = match[1].trim()
    const name = match[2].trim()
    
    // 跳过一些不需要的字段
    if (name && !name.includes('class') && !name.includes('Class')) {
      fields.push({ name, type })
    }
  }
  
  return fields
}

// 转换为JSON
const convertToJson = () => {
  if (!javaCode.value.trim()) {
    ElMessage.warning('请输入Java类代码')
    return
  }
  
  try {
    // 解析Java字段
    const fields = parseJavaFields(javaCode.value)
    
    if (fields.length === 0) {
      ElMessage.warning('未找到有效的字段声明，请检查Java代码格式')
      return
    }
    
    // 构建JSON对象
    const jsonObject = {}
    fields.forEach(field => {
      jsonObject[field.name] = getDefaultValue(field.type)
    })
    
    // 格式化JSON输出
    jsonResult.value = JSON.stringify(jsonObject, null, 2)
    
    ElMessage.success(`成功转换 ${fields.length} 个字段`)
  } catch (error) {
    ElMessage.error('转换失败: ' + error.message)
    console.error('转换错误:', error)
  }
}

// 复制结果
const copyResult = async () => {
  if (!jsonResult.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }
  
  try {
    await navigator.clipboard.writeText(jsonResult.value)
    ElMessage.success('复制成功')
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = jsonResult.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('复制成功')
  }
}

// 清空所有内容
const clearAll = () => {
  javaCode.value = ''
  jsonResult.value = ''
  ElMessage.info('已清空所有内容')
}
</script>

<style scoped>
.java-to-json-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
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

/* 转换器卡片 */
.converter-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 内容网格布局 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* 输入和输出区域 */
.input-section,
.output-section {
  display: flex;
  flex-direction: column;
}

/* 区域标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

/* 头部按钮 */
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

/* 文本域样式 */
.java-textarea {
  width: 100%;
  min-height: 400px;
  max-height: 500px;
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-family: 'Courier New', Monaco, monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease;
  overflow-y: auto;
}

.java-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.java-textarea.output {
  background-color: #f8f9fa;
  color: #333333;
}

/* 结果信息 */
.result-info {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
  text-align: right;
}

/* 按钮组 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.convert-btn {
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

.convert-btn:hover {
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .java-textarea {
    min-height: 300px;
  }
}

@media (max-width: 768px) {
  .java-to-json-container {
    padding: 16px;
  }
  
  .converter-card {
    padding: 16px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .button-group {
    flex-direction: column;
    align-items: center;
  }
  
  .convert-btn,
  .clear-btn {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .java-textarea {
    min-height: 250px;
    font-size: 12px;
  }
}
</style>