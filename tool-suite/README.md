# Tool Suite - 工具集合网站

一个基于 Vue3 + Element Plus 的工具集合网站，提供多种实用的文本处理和转换功能。

## 功能特性

### 🔄 文本转换工具
- **简繁体转换**: 支持简体中文与繁体中文之间的相互转换
- **中英文翻译**: 提供中文与英文之间的双向翻译服务

### 🔐 加密解密工具
- **DES 加解密**: 支持 DES 算法的加密和解密操作，可自定义密钥

### 📝 格式化工具
- **Markdown 转 HTML**: 将 Markdown 文本转换为 HTML 格式，支持实时预览
- **JSON 格式化**: 提供 JSON 美化、压缩、转义和反转义功能
- **SQL 压缩**: 将多行 SQL 语句压缩为单行，便于复制和使用

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **UI 组件库**: Element Plus
- **构建工具**: Vite
- **路由管理**: Vue Router
- **状态管理**: Pinia
- **HTTP 客户端**: Axios
- **容器化**: Docker + Nginx

## 快速开始

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量（可选）**
   ```bash
   # 复制环境变量示例文件
   cp .env.example .env.local

   # 编辑 .env.local 文件，修改API服务器地址
   # VITE_API_BASE_URL=http://localhost:8000
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

### Docker 部署

1. **构建镜像**
   ```bash
   docker build -t tool-suite .
   ```

2. **运行容器**
   ```bash
   docker run -p 3000:80 tool-suite
   ```

3. **使用 Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 配置说明

### API服务器配置

项目支持灵活的API服务器配置，可以通过以下方式设置：

1. **环境变量配置**（推荐）
   ```bash
   # 在 .env.local 文件中设置
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. **代码配置**
   在 `src/utils/api.js` 文件中修改 `API_CONFIG` 对象：
   ```javascript
   const API_CONFIG = {
     DEV_BASE_URL: 'http://localhost:8000',     // 开发环境
     PROD_BASE_URL: 'https://your-domain.com',  // 生产环境
   }
   ```

3. **环境文件**
   - `.env.development` - 开发环境配置
   - `.env.production` - 生产环境配置
   - `.env.local` - 本地配置（优先级最高，不会被提交到git）

### 部署到不同环境

- **开发环境**: 默认使用 `http://localhost:8000`
- **生产环境**: 修改 `.env.production` 中的 `VITE_API_BASE_URL`
- **自定义环境**: 创建 `.env.local` 文件并设置相应的变量

### CORS 和代理配置

为了解决跨域问题，项目在开发环境下使用了Vite代理：

- **开发环境**: 自动使用 `/api` 代理到 `http://localhost:8000`
- **生产环境**: 直接请求配置的API服务器地址

如果遇到CORS问题：
1. 确保后端服务器支持CORS
2. 检查后端是否支持OPTIONS预检请求
3. 在生产环境中配置nginx或其他反向代理

## 故障排除

### 常见问题

1. **405 Method Not Allowed**
   - 后端不支持OPTIONS预检请求
   - 解决方案：后端添加CORS支持

2. **Network Error**
   - 后端服务未启动
   - API地址配置错误
   - 解决方案：检查后端服务状态和配置

3. **API连接失败**
   - 页面会显示连接状态提示
   - 点击"重新检查"按钮测试连接

## API 接口说明

本项目前端调用以下后端API接口，请确保后端服务正常运行：

### 简繁体转换
- **简体转繁体**: `POST /api/v1/text/to-traditional`
- **繁体转简体**: `POST /api/v1/text/to-simplified`
```json
{
  "content": "要转换的文本"
}
```

### 中英文翻译
- **翻译**: `POST /api/v1/text/translate`
```json
{
  "content": "要翻译的文本",
  "target_lang": "en" // 或 "zh"
}
```

### DES 加解密
- **加密**: `POST /api/v1/crypto/des/encrypt`
- **解密**: `POST /api/v1/crypto/des/decrypt`
```json
{
  "text": "要处理的文本",
  "key": "8位密钥"
}
```

### HTML 转 Markdown
- **转换**: `POST /api/v1/text/html-to-markdown`
```json
{
  "content": "HTML内容"
}
```

### SQL 压缩
- **压缩**: `POST /api/v1/text/sql-compress`
```json
{
  "content": "要压缩的SQL语句"
}
```

所有接口返回格式：
```json
{
  "result": "处理结果"
}
```
