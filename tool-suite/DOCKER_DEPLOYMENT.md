# Docker 部署指南

## 概述

本项目支持通过 Docker Compose 同时启动前后端服务。采用最佳实践架构：前端通过宿主机端口访问后端，确保浏览器端和容器间通信都能正常工作。

## 配置说明

### 1. Docker Compose 配置

在 `docker-compose.yml` 中，我们配置了：

- **fastapi-tool-api**: 后端服务，端口 8000
- **frontend**: 前端服务，端口 3000 (映射到容器内的 80 端口)
- **网络**: 两个服务都在同一个 `fastapi-tool-network` 网络中

### 2. 环境变量配置

#### 开发环境 (`.env.development`)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=工具集合 - 开发环境
```

#### 生产环境 (`.env.production`)
```
# 注意：生产环境中前端仍然通过宿主机端口访问后端
# 因为浏览器运行在宿主机上，无法直接访问Docker服务名称
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=工具集合
```

### 3. 前端 API 配置

前端通过 `src/utils/api.js` 中的 `getBaseURL()` 函数来获取 API 基础 URL：

- **开发环境**: 使用 Vite 代理 (`/api`) 转发到 `http://127.0.0.1:8000`
- **生产环境**: 直接使用 `http://localhost:8000` 访问宿主机上的后端服务

## 部署步骤

### 1. 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 2. 访问应用

- 前端应用: http://localhost:3000
- 后端 API: http://localhost:8000

### 3. 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止服务并删除数据卷
docker-compose down -v
```

## 构建自定义镜像

### 1. 构建前端镜像

```bash
# 构建前端镜像
docker build -t your-username/tool-suite-frontend:latest .

# 推送到 Docker Hub
docker push your-username/tool-suite-frontend:latest
```

### 2. 更新 docker-compose.yml

将 `docker-compose.yml` 中的镜像名称更新为你的镜像：

```yaml
frontend:
  image: your-username/tool-suite-frontend:latest
  # ... 其他配置
```

## 网络通信原理

### 架构设计理念

本项目采用**混合通信架构**，兼顾了容器化部署和浏览器访问的需求：

1. **浏览器 → 后端**: 通过宿主机端口 `localhost:8000` 访问
2. **容器间通信**: 如果需要，容器可以通过服务名称 `fastapi-tool-api` 互相访问
3. **开发环境**: 使用 Vite 代理避免 CORS 问题

### 为什么不使用 Docker 服务名称？

**问题**: 浏览器无法直接访问 Docker 服务名称（如 `http://fastapi-tool-api:8000`）

**原因**: 
- 浏览器运行在宿主机上，不在 Docker 网络内
- Docker 服务名称只在容器网络内部有效
- DNS 解析 `fastapi-tool-api` 在宿主机上会失败

**解决方案**: 
- 前端始终通过宿主机端口访问后端
- 后端通过端口映射暴露到宿主机
- 保持架构简单且可靠

### 网络拓扑

```
宿主机 (localhost)
├── 浏览器 → http://localhost:3000 (前端)
│   └── API调用 → http://localhost:8000 (后端)
└── Docker 网络 (fastapi-tool-network)
    ├── frontend:80 → 映射到 localhost:3000
    └── fastapi-tool-api:8000 → 映射到 localhost:8000
```

## 故障排除

### 1. 前端无法连接后端

检查：
- 两个服务是否在同一网络中
- 环境变量 `VITE_API_BASE_URL` 是否正确设置
- 后端服务是否正常启动

```bash
# 检查网络
docker network ls
docker network inspect fastapi-tool-network

# 检查服务状态
docker-compose ps
docker-compose logs fastapi-tool-api
docker-compose logs frontend
```

### 2. 环境变量未生效

确保：
- Dockerfile 中设置了正确的环境变量
- docker-compose.yml 中的环境变量配置正确
- 重新构建镜像后再启动服务

```bash
# 重新构建并启动
docker-compose up --build -d
```

### 3. API 调用失败

检查：
- 后端服务的健康检查状态
- 前端的 API 配置是否正确
- 网络连通性

```bash
# 进入前端容器测试网络连通性
docker exec -it <frontend_container_id> sh
ping fastapi-tool-api
wget -O- http://fastapi-tool-api:8000/
```

## 开发建议

### 最佳实践

1. **本地开发**: 使用 `npm run dev` 启动前端开发服务器，利用 Vite 代理功能
2. **测试部署**: 使用 `docker-compose up` 测试完整的部署环境
3. **生产部署**: 前端始终通过宿主机端口访问后端，保持架构简单可靠

### 架构优势

- **简单性**: 无需复杂的网络配置或反向代理
- **可靠性**: 避免了浏览器访问Docker服务名称的问题
- **一致性**: 开发和生产环境使用相同的访问模式
- **可维护性**: 减少了网络相关的故障点

### 替代方案

如果需要更复杂的部署架构，可以考虑：

1. **Nginx 反向代理**: 在前端容器中配置 nginx 代理后端请求
2. **API Gateway**: 使用专门的 API 网关处理路由
3. **Kubernetes**: 在 K8s 环境中使用 Service 和 Ingress

## 相关文件

- `docker-compose.yml`: Docker Compose 配置文件
- `Dockerfile`: 前端镜像构建文件
- `.env.development`: 开发环境变量
- `.env.production`: 生产环境变量
- `src/utils/api.js`: 前端 API 配置
- `vite.config.js`: Vite 开发服务器配置