# 使用官方 Node.js 运行时作为基础镜像
FROM node:20-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 清理npm缓存并重新安装依赖
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install

# 复制项目文件
COPY . .

# 构建应用（使用默认配置，前端通过宿主机端口访问后端）
RUN npm run build

# 生产阶段
FROM nginx:stable-alpine as production-stage

# 复制构建的文件到 nginx 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
