# GHS Color Next

一款优雅的现代化色彩管理工具 - 用于保存您和您的团队喜欢的颜色，即时迸发灵感。

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
| `PORT` | 应用端口 | `3000` |

## 🔗 相关链接

- [GitHub 仓库](https://github.com/Mystic-Stars/GHS-Color)
- [完整文档](https://github.com/Mystic-Stars/GHS-Color/blob/main/README.md)

## 📄 许可证

MIT License - 查看 [LICENSE](https://github.com/Mystic-Stars/GHS-Color/blob/main/LICENSE) 了解详情。

---

**Powered by Garbage Human Studio**
