# GHS Color Next

现代化色彩管理工具 - 用于保存您和您的团队喜欢的颜色，即时迸发灵感。

## 🚀 一键部署

### 快速开始

```bash
# 一键启动应用
docker run -d -p 3000:3000 --name ghs-color mysticstars/ghs-color:latest
```

访问 http://localhost:3000 即可使用应用。

### 使用 Docker Compose

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  ghs-color:
    image: mysticstars/ghs-color:latest
    container_name: ghs-color-next
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_NAME=GHS Color Next
    restart: unless-stopped
```

然后运行：

```bash
docker-compose up -d
```

## 🛠️ 支持的标签

- `latest` - 最新稳定版本
- `v2.0.0` - 特定版本
- `main` - 主分支最新构建

## 🌟 主要特性

- **颜色库管理** - 对颜色实施分类管理
- **内置实用工具** - 多种颜色格式实时转化、颜色配置生成器
- **优雅界面** - 中英文双语支持，明暗主题适配，响应式设计
- **GitHub集成** - 支持提交新颜色到GitHub仓库

## 🔧 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_APP_NAME` | 应用名称 | `GHS Color Next` |
| `NEXT_PUBLIC_APP_VERSION` | 应用版本 | `2.0.0` |
| `NEXT_PUBLIC_GITHUB_URL` | GitHub仓库地址 | `https://github.com/Mystic-Stars/GHS-Color` |
| `NEXT_PUBLIC_COLORS` | 自定义颜色数据（JSON格式） | 使用内置config.js |
| `NEXT_PUBLIC_CATEGORIES` | 自定义分类数据（JSON格式） | 使用内置config.js |
| `PORT` | 应用端口 | `3000` |

### 🎨 自定义颜色配置

支持通过环境变量自定义颜色数据，**优先级：环境变量 > config.js文件**

```bash
# 自定义颜色配置示例
docker run -d \
  -p 3000:3000 \
  --name ghs-color \
  -e NEXT_PUBLIC_COLORS='[{"id":"my-red","name":"My Red","nameZh":"我的红色","hex":"#ff0000","description":"Custom red","descriptionZh":"自定义红色","category":"brand","tags":["red"]}]' \
  -e NEXT_PUBLIC_CATEGORIES='[{"id":"brand","name":"Brand","nameZh":"品牌","description":"Brand colors","icon":"🎨","color":"#6366F1","order":1}]' \
  mysticstars/ghs-color:latest
```

## 📋 系统要求

- **内存**: 最少 256MB，推荐 512MB
- **存储**: 最少 100MB
- **架构**: 支持 AMD64 和 ARM64

## 🔗 相关链接

- [GitHub 仓库](https://github.com/Mystic-Stars/GHS-Color)
- [完整文档](https://github.com/Mystic-Stars/GHS-Color/blob/main/README.md)
- [Docker 部署指南](https://github.com/Mystic-Stars/GHS-Color/blob/main/docs/docker-guide.md)

## 📄 许可证

MIT License - 查看 [LICENSE](https://github.com/Mystic-Stars/GHS-Color/blob/main/LICENSE) 了解详情。

---

**Powered by Garbage Human Studio**
