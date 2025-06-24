# GHS Color Next - Docker 部署指南

本指南将详细介绍如何使用Docker部署GHS Color Next应用。

## 📋 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [部署方式](#部署方式)
- [配置说明](#配置说明)
- [常用命令](#常用命令)
- [故障排除](#故障排除)

## 环境要求

### 必需软件

- **Docker**: 20.10.0 或更高版本
- **Docker Compose**: 2.0.0 或更高版本

### 系统要求

- **内存**: 最少 512MB，推荐 1GB 或更多
- **存储**: 最少 2GB 可用空间
- **网络**: 需要访问Docker Hub和GitHub

### 安装Docker

#### Windows
1. 下载并安装 [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
2. 启动Docker Desktop
3. 验证安装：`docker --version`

#### macOS
1. 下载并安装 [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
2. 启动Docker Desktop
3. 验证安装：`docker --version`

#### Linux (Ubuntu/Debian)
```bash
# 更新包索引
sudo apt-get update

# 安装Docker
sudo apt-get install docker.io docker-compose

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker-compose --version
```

## 快速开始

### 1. 获取项目代码

```bash
git clone https://github.com/Mystic-Stars/GHS-Color.git
cd GHS-Color
```

### 2. 配置环境变量（可选）

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑配置文件（可选）
nano .env.local
```

### 3. 一键部署

选择以下任一方式：

#### 方式一：使用部署脚本（推荐）

**Linux/macOS:**
```bash
./scripts/docker-deploy.sh prod
```

**Windows:**
```cmd
scripts\docker-deploy.bat prod
```

#### 方式二：使用 Makefile

```bash
make prod
```

#### 方式三：使用 Docker Compose

```bash
docker-compose up -d ghs-color-prod
```

### 4. 访问应用

部署完成后，在浏览器中访问：
- **生产环境**: http://localhost:3000
- **开发环境**: http://localhost:3001

## 部署方式

### 生产环境部署

生产环境使用优化的多阶段构建，镜像体积小，启动速度快：

```bash
# 使用脚本
./scripts/docker-deploy.sh prod

# 或使用 Makefile
make prod

# 或使用 Docker Compose
docker-compose up -d ghs-color-prod
```

**特点：**
- 优化的镜像大小
- 快速启动时间
- 生产级别的性能
- 健康检查支持

### 开发环境部署

开发环境支持热重载，便于开发调试：

```bash
# 使用脚本
./scripts/docker-deploy.sh dev

# 或使用 Makefile
make dev

# 或使用 Docker Compose
docker-compose --profile dev up -d ghs-color-dev
```

**特点：**
- 代码热重载
- 开发工具支持
- 实时调试
- 文件监听

## 配置说明

### 环境变量配置

项目支持通过环境变量进行配置，主要配置项包括：

```bash
# 应用基本信息
NEXT_PUBLIC_APP_NAME=GHS Color Next
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_DESCRIPTION=现代化色彩管理工具

# GitHub 配置
NEXT_PUBLIC_GITHUB_URL=https://github.com/Mystic-Stars/GHS-Color

# SEO 配置
NEXT_PUBLIC_SITE_TITLE=GHS Color Next - 现代化色彩管理工具
NEXT_PUBLIC_SITE_DESCRIPTION=一款优雅的现代化色彩管理工具

# Docker 配置
PORT=3000
HOSTNAME=0.0.0.0
NODE_ENV=production
```

### 端口配置

默认端口配置：
- **生产环境**: 3000
- **开发环境**: 3001

如需修改端口，编辑 `docker-compose.yml` 文件：

```yaml
services:
  ghs-color-prod:
    ports:
      - "8080:3000"  # 将应用映射到8080端口
```

### 数据持久化

颜色数据存储在项目的 `config.js` 文件中，通过Git版本控制管理。无需额外的数据库或存储配置。

## 常用命令

### 服务管理

```bash
# 启动服务
make prod              # 启动生产环境
make dev               # 启动开发环境

# 停止服务
make stop              # 停止所有服务

# 重启服务
make restart           # 重启生产环境
make restart-dev       # 重启开发环境

# 查看状态
make status            # 查看服务状态
```

### 日志管理

```bash
# 查看日志
make logs              # 生产环境日志
make logs-dev          # 开发环境日志

# 实时日志
docker-compose logs -f ghs-color-prod
docker-compose logs -f ghs-color-dev
```

### 资源管理

```bash
# 清理资源
make clean             # 清理所有Docker资源

# 查看镜像
docker images | grep mysticstars/ghs-color

# 查看容器
docker ps | grep ghs-color
```

## 故障排除

### 常见问题

#### 1. 端口被占用

**错误信息**: `Port 3000 is already in use`

**解决方案**:
```bash
# 查看端口占用
netstat -tulpn | grep 3000

# 停止占用端口的进程
sudo kill -9 <PID>

# 或修改docker-compose.yml中的端口映射
```

#### 2. Docker服务未启动

**错误信息**: `Cannot connect to the Docker daemon`

**解决方案**:
```bash
# Linux
sudo systemctl start docker

# Windows/macOS
# 启动 Docker Desktop
```

#### 3. 镜像构建失败

**错误信息**: `Build failed`

**解决方案**:
```bash
# 清理Docker缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache ghs-color-prod
```

#### 4. 容器启动失败

**解决方案**:
```bash
# 查看详细日志
docker-compose logs ghs-color-prod

# 检查容器状态
docker-compose ps

# 重新启动
docker-compose restart ghs-color-prod
```

### 性能优化

#### 1. 镜像优化

- 使用多阶段构建减少镜像大小
- 合理使用 `.dockerignore` 排除不必要文件
- 使用Alpine Linux基础镜像

#### 2. 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  ghs-color-prod:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### 安全建议

1. **不要在生产环境中使用默认配置**
2. **定期更新Docker镜像**
3. **使用非root用户运行容器**
4. **配置防火墙规则**
5. **启用HTTPS（生产环境）**

## 高级配置

### 集群部署

使用Docker Swarm进行集群部署：

```bash
# 初始化Swarm
docker swarm init

# 部署服务栈
docker stack deploy -c docker-compose.yml ghs-color
```

### 负载均衡

配置Nginx作为反向代理：

```nginx
upstream ghs-color {
    server localhost:3000;
    server localhost:3001;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://ghs-color;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 支持与反馈

如果您在使用过程中遇到问题：

1. 查看本文档的故障排除部分
2. 检查项目的 [Issues](https://github.com/Mystic-Stars/GHS-Color/issues)
3. 创建新的Issue描述您的问题
4. 联系项目维护者

---

**祝您使用愉快！** 🎉
