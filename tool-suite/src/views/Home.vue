<template>
  <div class="home-container">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card class="tool-card">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><Document /></el-icon>
              <span>文本转换工具</span>
            </div>
          </template>
          <div class="tool-content">
            <div class="tool-item">
              <span class="tool-label">简繁体转换</span>
              <el-button type="primary" @click="$router.push('/chinese-converter')">
                开始转换
              </el-button>
            </div>
            <div class="tool-item">
              <span class="tool-label">中英文翻译</span>
              <el-button type="primary" @click="$router.push('/translator')">
                开始翻译
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="tool-card">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><Lock /></el-icon>
              <span>加密解密工具</span>
            </div>
          </template>
          <div class="tool-content">
            <div class="tool-item">
              <span class="tool-label">DES加解密</span>
              <el-button type="primary" @click="$router.push('/des-encryption')">
                开始加解密
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="12">
        <el-card class="tool-card">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><Document /></el-icon>
              <span>文档转换</span>
            </div>
          </template>
          <div class="tool-content">
            <div class="tool-item">
              <span class="tool-label">HTML转Markdown</span>
              <el-button type="primary" @click="$router.push('/markdown-converter')">
                开始转换
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="tool-card">
          <template #header>
            <div class="card-header">
              <el-icon class="card-icon"><DocumentCopy /></el-icon>
              <span>格式化工具</span>
              <el-button type="primary" size="small" class="json-functions-btn">
                工具集合
              </el-button>
            </div>
          </template>
          <div class="tool-content">
            <div class="tool-item">
              <span class="tool-label">JSON格式化</span>
              <el-button type="primary" @click="$router.push('/json-formatter')">
                开始格式化
              </el-button>
            </div>
            <div class="tool-item">
              <span class="tool-label">SQL压缩</span>
              <el-button type="primary" @click="$router.push('/sql-compressor')">
                开始压缩
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: 100%;
}

.tool-card {
  height: 250px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.card-icon {
  font-size: 18px;
  color: #409eff;
}

.json-functions-btn {
  margin-left: auto;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.tool-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tool-item:last-child {
  border-bottom: none;
}

.tool-label {
  font-weight: 500;
  color: #606266;
  min-width: 100px;
}


</style>
