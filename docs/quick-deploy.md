# GHS Color Next - 快速部署指南

本指南提供最简单的部署方式，基于Docker Hub预构建镜像。

## 🚀 一键部署

### 方式一：使用一键脚本（推荐）

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/scripts/one-click-deploy.sh | bash
```

**Windows:**
```cmd
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/scripts/one-click-deploy.bat -o deploy.bat && deploy.bat
```

### 方式二：直接运行Docker容器

```bash
docker run -d -p 3000:3000 --name ghs-color mysticstars/ghs-color:latest
```

### 方式三：使用Docker Compose

```bash
# 下载配置文件
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/docker-compose.yml -o docker-compose.yml

# 启动服务
docker-compose up -d
```

### 方式四：使用Makefile

```bash
# 克隆项目（仅获取Makefile）
git clone --depth 1 https://github.com/Mystic-Stars/GHS-Color.git
cd GHS-Color

# 一键部署
make deploy
```

## 🌐 访问应用

部署完成后，在浏览器中访问：
- **应用地址**: http://localhost:3000

## 📋 管理命令

### 基本操作

```bash
# 查看容器状态
docker ps | grep ghs-color

# 查看日志
docker logs ghs-color

# 停止服务
docker stop ghs-color

# 启动服务
docker start ghs-color

# 重启服务
docker restart ghs-color

# 删除容器
docker rm -f ghs-color
```

### 更新应用

```bash
# 停止并删除旧容器
docker stop ghs-color && docker rm ghs-color

# 拉取最新镜像
docker pull mysticstars/ghs-color:latest

# 启动新容器
docker run -d -p 3000:3000 --name ghs-color mysticstars/ghs-color:latest
```

### 使用Makefile管理

```bash
# 部署最新版本
make deploy

# 查看状态
make status

# 查看日志
make logs

# 停止服务
make stop

# 重启服务
make restart

# 清理资源
make clean
```

## ⚙️ 自定义配置

### 修改端口

```bash
# 使用8080端口
docker run -d -p 8080:3000 --name ghs-color mysticstars/ghs-color:latest
```

### 环境变量配置

```bash
docker run -d \
  -p 3000:3000 \
  --name ghs-color \
  -e NEXT_PUBLIC_APP_NAME="我的颜色管理工具" \
  -e NEXT_PUBLIC_GITHUB_URL="https://github.com/your-username/your-repo" \
  mysticstars/ghs-color:latest
```

### 数据持久化

应用的颜色数据存储在镜像内的配置文件中，如需自定义颜色数据：

```bash
# 挂载自定义配置文件
docker run -d \
  -p 3000:3000 \
  --name ghs-color \
  -v /path/to/your/config.js:/app/config.js \
  mysticstars/ghs-color:latest
```

## 🔧 故障排除

### 端口被占用

```bash
# 查看端口占用
netstat -tulpn | grep 3000

# 使用其他端口
docker run -d -p 8080:3000 --name ghs-color mysticstars/ghs-color:latest
```

### 容器启动失败

```bash
# 查看详细日志
docker logs ghs-color

# 检查镜像是否存在
docker images | grep mysticstars/ghs-color

# 重新拉取镜像
docker pull mysticstars/ghs-color:latest
```

### 无法访问应用

1. 检查容器是否运行：`docker ps`
2. 检查端口映射：`docker port ghs-color`
3. 检查防火墙设置
4. 查看应用日志：`docker logs ghs-color`

## 📚 相关资源

- [完整部署指南](./docker-guide.md)
- [Docker Hub仓库](https://hub.docker.com/r/mysticstars/ghs-color)
- [项目主页](https://github.com/Mystic-Stars/GHS-Color)
- [问题反馈](https://github.com/Mystic-Stars/GHS-Color/issues)

---

**享受您的色彩管理之旅！** 🎨
