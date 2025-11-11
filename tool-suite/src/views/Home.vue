<template>
  <div class="home-container">
    <!-- 页面标题 -->
  <div class="page-header">
    <h2>工具集合</h2>
    <p>选择您需要的工具，快速完成各种文本处理任务</p>
  </div>

    <!-- 工具卡片网格 -->
    <div class="tools-grid">
      <!-- 简繁体转换 -->
      <div class="tool-card" @click="$router.push('/chinese-converter')">
        <div class="card-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3 class="card-title">简繁体转换</h3>
        <p class="card-description">快速转换简体中文和繁体中文</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始转换
          </el-button>
        </div>
      </div>

      <!-- 中英文翻译 -->
      <div class="tool-card" @click="$router.push('/translator')">
        <div class="card-icon">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <h3 class="card-title">中英文翻译</h3>
        <p class="card-description">智能中英文互译服务</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始翻译
          </el-button>
        </div>
      </div>

      <!-- DES加解密 -->
      <div class="tool-card" @click="$router.push('/des-encryption')">
        <div class="card-icon">
          <el-icon><Lock /></el-icon>
        </div>
        <h3 class="card-title">DES加解密</h3>
        <p class="card-description">安全的DES加密解密工具</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始加解密
          </el-button>
        </div>
      </div>

      <!-- Unicode转换 -->
      <div class="tool-card" @click="$router.push('/unicode-converter')">
        <div class="card-icon">
          <el-icon><Key /></el-icon>
        </div>
        <h3 class="card-title">Unicode转换</h3>
        <p class="card-description">字符串与Unicode编码相互转换</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始转换
          </el-button>
        </div>
      </div>

      <!-- HTML转Markdown -->
      <div class="tool-card" @click="$router.push('/markdown-converter')">
        <div class="card-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3 class="card-title">HTML转Markdown</h3>
        <p class="card-description">将HTML代码转换为Markdown格式</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始转换
          </el-button>
        </div>
      </div>

      <!-- JSON格式化 -->
      <div class="tool-card" @click="$router.push('/json-formatter')">
        <div class="card-icon">
          <el-icon><DocumentCopy /></el-icon>
        </div>
        <h3 class="card-title">JSON格式化</h3>
        <p class="card-description">美化和验证JSON数据格式</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始格式化
          </el-button>
        </div>
      </div>

      <!-- SQL压缩 -->
      <div class="tool-card" @click="$router.push('/sql-compressor')">
        <div class="card-icon">
          <el-icon><DataLine /></el-icon>
        </div>
        <h3 class="card-title">SQL压缩</h3>
        <p class="card-description">压缩SQL语句，减少文件大小</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始压缩
          </el-button>
        </div>
      </div>

      <!-- Java转JSON -->
      <div class="tool-card" @click="$router.push('/java-to-json')">
        <div class="card-icon">
          <el-icon><DocumentCopy /></el-icon>
        </div>
        <h3 class="card-title">Java转JSON</h3>
        <p class="card-description">将Java类代码(POJO)转换为JSON示例数据</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始转换
          </el-button>
        </div>
      </div>

      <!-- hoppscotch转markdown -->
      <div class="tool-card" @click="$router.push('/api-docs-to-markdown')">
        <div class="card-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3 class="card-title">hoppscotch转markdown</h3>
        <p class="card-description">将 Hoppscotch JSON 文档转换为 Markdown</p>
        <div class="card-action">
          <el-button type="primary" class="action-btn">
            开始转换
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import UiButton from '@/components/ui/button.vue'

const router = useRouter()
</script>

<style scoped>
.home-container {
  width: 100%;
}

/* 页面标题样式 */
.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h2 {
  margin: 0 0 12px 0;
  font-size: 32px;
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

/* 工具卡片网格 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

/* 工具卡片样式 */
.tool-card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #1890ff;
}

.tool-card:hover .card-icon {
  transform: scale(1.1);
  color: #1890ff;
}

.tool-card:hover .action-btn {
  background-color: #1890ff;
  border-color: #1890ff;
}

/* 卡片图标 */
.card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: #f0f9ff;
  border-radius: 50%;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.card-icon .el-icon {
  font-size: 28px;
  color: #1890ff;
}

/* 卡片标题 */
.card-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  line-height: 1.3;
}

/* 卡片描述 */
.card-description {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #666666;
  line-height: 1.5;
  min-height: 42px;
}

/* 卡片操作按钮 */
.card-action {
  margin-top: auto;
}

.action-btn {
  width: 100%;
  height: 40px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #1890ff;
  border-color: #1890ff;
}

.action-btn:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .tool-card {
    padding: 24px 20px;
  }
  
  .page-header h2 {
    font-size: 28px;
  }
  
  .page-header {
    margin-bottom: 32px;
  }
}

@media (max-width: 480px) {
  .tool-card {
    padding: 20px 16px;
  }
  
  .card-icon {
    width: 56px;
    height: 56px;
  }
  
  .card-icon .el-icon {
    font-size: 24px;
  }
  
  .card-title {
    font-size: 18px;
  }
}
</style>
