<div align="center">
  <img src="public/icons/ico.svg" alt="GHS Color Next" width="80" height="80">
  <h1>GHS Color Next</h1>
  <p>现代化色彩管理工具</p>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/version-2.0.0-green.svg" alt="Version">
  <img src="https://img.shields.io/badge/React-18+-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/Next.js-14+-000000.svg" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6.svg" alt="TypeScript">
</div>

## 📖 项目简介
<!--  -->
GHS Color 是一款现代化的高颜值色彩管理工具，用于保存您和您的团队喜欢的颜色，即时迸发灵感。

## 📋 目录

- [✨ 主要特色](#-主要特色)
- [🚀 快速开始](#-快速开始)
- [🚀 部署指南](#-部署指南)
  - [🐳 Docker 一键部署](#-docker-一键部署推荐)
  - [☁️ Vercel 一键部署](#️-vercel-一键部署)
- [⚙️ 配置说明](#️-配置说明)
  - [如何添加新颜色](#如何添加新颜色)
- [🤝 贡献指南](#-贡献指南)

## ✨ 主要特色

- **颜色库管理** - 对颜色实施分类管理
- **内置实用工具** - 多种颜色格式实时转化、颜色配置生成器
- **优雅界面** - 中英文双语支持，明暗主题适配，响应式设计，现代化页脚
- **部署方便** - 仅需动动手指5分钟即可轻松部署
- **GitHub集成** - 支持提交新颜色到GitHub仓库

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 9.0 或更高版本（推荐使用 pnpm）

### 安装步骤

1. **克隆项目**
   
   ```bash
   git clone https://github.com/Mystic-Stars/GHS-Color.git
   cd GHS-Color
   ```
   
2. **安装依赖**
   ```bash
   npm install
   # 或使用 pnpm（推荐）
   pnpm install
   ```

3. **配置颜色数据**
   ```bash
   # 颜色数据现在存储在根目录的 config.js 文件中
   # 您可以直接编辑该文件来添加或修改颜色
   ```
   
4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   pnpm dev
   ```

5. **打开浏览器**
   访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 可用脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run type-check   # TypeScript 类型检查
npm run test         # 运行测试
```

## 🚀 部署指南

### 🐳 Docker 一键部署

Docker部署是简单可靠的部署方式，支持一键部署到任何支持Docker的环境。

下文为简略教程，详细教程请参见[Docker 部署指南](./docs/docker-guide.md)

#### ⚡ 超级快速部署（推荐）

**无需下载源码，直接运行一条命令：**

```bash
# 方式一：使用一键部署脚本（最简单）
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/scripts/one-click-deploy.sh | bash

# 方式二：直接运行Docker容器（环境变量难以配置）
docker run -d -p 3000:3000 --name ghs-color mysticstars/ghs-color:latest

# 方式三：使用Docker Compose（适用于生产环境）
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/docker-compose.yml -o docker-compose.yml && docker-compose up -d
```

**Windows用户：**
```cmd
REM 下载并运行一键部署脚本
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/scripts/one-click-deploy.bat -o deploy.bat && deploy.bat

REM 或直接运行Docker容器
docker run -d -p 3000:3000 --name ghs-color mysticstars/ghs-color:latest
```

部署完成后，访问 [http://localhost:3000](http://localhost:3000) 即可使用应用。

#### 🎨 自定义颜色配置

Docker部署支持通过环境变量自定义颜色数据，优先级：**环境变量 > config.js文件**

```bash
# 自定义颜色数据
export NEXT_PUBLIC_COLORS='[{"id":"my-red","name":"My Red","nameZh":"我的红色","hex":"#ff0000","description":"Custom red","descriptionZh":"自定义红色","category":"brand","tags":["red"]}]'

# 自定义分类数据
export NEXT_PUBLIC_CATEGORIES='[{"id":"brand","name":"Brand","nameZh":"品牌","description":"Brand colors","icon":"🎨","color":"#6366F1","order":1}]'

# 然后运行部署命令
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/scripts/one-click-deploy.sh | bash
```

详细配置说明请参考：[颜色配置指南](./docs/color-config-guide.md)

#### 🛠️ 开发者本地构建

如果您是开发者需要自定义构建，可以克隆项目进行本地构建：

```bash
# 克隆项目
git clone https://github.com/Mystic-Stars/GHS-Color.git
cd GHS-Color

# 本地构建镜像
docker build -t ghs-color-local .

# 运行本地构建的镜像
docker run -d -p 3000:3000 --name ghs-color-local ghs-color-local
```



#### 常用命令

```bash
# 一键部署
make deploy        # 拉取最新镜像并部署

# 查看服务状态
make status

# 查看日志
make logs

# 停止服务
make stop

# 重启服务
make restart

# 清理资源
make clean

# 使用Docker Compose
make compose       # 使用Docker Compose部署
make compose-stop  # 停止Docker Compose服务
```

### ☁️ Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMystic-Stars%2FGHS-Color)

1. **点击上方部署按钮**
2. **连接GitHub账户**并授权Vercel访问
3. **Fork项目**到您的GitHub账户
4. **配置环境变量**：
   - 在Vercel部署页面的"Environment Variables"部分
   - 添加您的`.env.local`文件中的应用配置环境变量
   - 颜色数据现在存储在`config.js`文件中，无需在部署平台配置
5. **点击Deploy**开始部署
6. **等待部署完成**，通常需要1-3分钟

### 🌐 其他部署平台

项目也支持部署到其他平台：

- **Netlify**
- **Railway**
- **Cloudflare Pages**
- **自建服务器**（推荐使用Docker）

### 📋 部署注意事项

- **环境变量**：确保在部署平台配置应用基本信息的环境变量（如应用名称、GitHub URL等）
- **颜色数据**：颜色和分类数据存储在`config.js`文件中，通过Git提交即可更新（Docker部署方式除外）
- **构建命令**：`npm run build`
- **启动命令**：`npm run start`

## ⚙️ 配置说明

### 应用配置

项目使用 `.env.local` 文件进行应用基本信息配置：

```bash
# 应用基本信息
NEXT_PUBLIC_APP_NAME=GHS Color Next
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_APP_DESCRIPTION=现代化色彩管理工具
NEXT_PUBLIC_APP_DESCRIPTION_EN=Modern Color Management Tool
NEXT_PUBLIC_GITHUB_URL=https://github.com/Mystic-Stars/GHS-Color

# 页面配置 - 中文
NEXT_PUBLIC_SITE_TITLE=GHS Color Next - 现代化色彩管理工具
NEXT_PUBLIC_SITE_DESCRIPTION=一款优雅的现代化色彩管理工具

# 页面配置 - 英文
NEXT_PUBLIC_SITE_TITLE_EN=GHS Color Next - Modern Color Management Tool
NEXT_PUBLIC_SITE_DESCRIPTION_EN=A modern color management tool

# 关键字
NEXT_PUBLIC_SITE_KEYWORDS=GHS Color,color management,color tool,design tool,color picker,palette,颜色管理,色彩工具
```

### 颜色数据配置

***该说明并不适用于Docker部署方式用户，Docker颜色数据配置方式请见[颜色配置指南](docs/color-config-guide.md)***

颜色和分类数据存储在根目录的 `config.js` 文件中，无需在环境变量中配置。

#### config.js 文件结构

```javascript
// config.js
module.exports = {
  colors: [
    // 颜色数组
  ],
  categories: [
    // 分类数组
  ]
};
```

### 颜色数据格式

```typescript
interface Color {
  id: string;                    // 唯一标识符
  name: string;                  // 英文名称
  nameZh: string;               // 中文名称
  hex: string;                  // HEX颜色值
  description: string;          // 英文描述
  descriptionZh: string;        // 中文描述
  category: string;             // 分类ID
  tags: string[];              // 标签数组
}
```

### 分类数据格式

```typescript
interface Category {
  id: string;                   // 分类ID
  name: string;                 // 英文名称
  nameZh: string;              // 中文名称
  description: string;          // 描述
  icon: string;                // 图标（emoji）
  color: string;               // 分类代表色
  order: number;               // 排序权重
}
```

#### 颜色数据示例

```javascript
{
  id: "box-yellow",
  name: "Box Yellow",
  nameZh: "盒子黄",
  hex: "#f6dc50",
  description: "The exclusive yellow color of BoxWorld, the logo color of GHS.",
  descriptionZh: "盒王的专属黄色，GHS的标志颜色。",
  category: "brand",
  tags: ["yellow", "logo", "ghs"]
}
```

### 如何添加新颜色

#### 方式一：使用颜色配置生成器（推荐）

1. **打开颜色配置生成器** - 在应用的实用工具页面中找到"颜色配置生成器"
2. **填写颜色信息** - 按照表单要求填写完整的颜色信息
3. **复制生成的配置** - 点击"复制 JSON"按钮复制配置
4. **编辑 config.js 文件** - 将复制的配置粘贴到 `colors` 数组中
5. **提交到Git并推送** - 部署平台会自动更新

#### 方式二：手动编辑配置文件

1. **编辑根目录的 `config.js` 文件**
2. **在 `colors` 数组中添加新的颜色对象**
3. **确保JavaScript对象格式正确**
4. **提交到Git并推送**，部署平台会自动更新

```javascript
// 在 config.js 的 colors 数组中添加
{
  id: "your-color-id",           // 唯一ID，使用小写和连字符
  name: "Your Color Name",       // 英文名称
  nameZh: "您的颜色名称",         // 中文名称
  hex: "#ff6b6b",               // HEX颜色值
  description: "English description",
  descriptionZh: "中文描述",
  category: "brand",            // 分类：brand/ui/team
  tags: ["red", "vibrant"]     // 标签数组
}
```

### 注意事项

- **颜色ID必须唯一**，建议使用描述性的名称
- **HEX值必须以#开头**，使用6位十六进制格式
- **分类必须在categories数组中存在**
- **JavaScript对象格式必须正确**，注意逗号的使用

## 🤝 贡献指南

### 贡献新颜色

#### 方式一：通过应用提交（推荐）
1. 点击应用中的"提交颜色"按钮
2. 按照指南在GitHub上创建Issue
3. 提供颜色的详细信息和用途说明
4. 等待维护者审核和合并

#### 方式二：直接提交PR
1. Fork本项目到您的GitHub账户
2. 使用应用内的颜色配置生成器生成标准格式的颜色配置
3. 编辑根目录的 `config.js` 文件，将生成的配置添加到 `colors` 数组中
4. 提交PR并描述颜色的用途和来源
5. 等待审核和合并

> 💡 **提示**：推荐使用颜色配置生成器来确保配置格式的正确性和完整性

### 代码贡献

1. **Fork 项目** - 点击右上角的 Fork 按钮
2. **创建分支** - `git checkout -b feature/your-feature-name`
3. **提交更改** - `git commit -m 'feat: add some feature'`
4. **推送分支** - `git push origin feature/your-feature-name`
5. **创建 Pull Request** - 在 GitHub 上创建 PR

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢所有开源库的作者和贡献者

## 📞 联系我们

- 项目地址：[https://github.com/Mystic-Stars/GHS-Color](https://github.com/Mystic-Stars/GHS-Color)
- 问题反馈：[Issues](https://github.com/Mystic-Stars/GHS-Color/issues)

---

<div align="center">
  <p>如果这个项目对您有帮助，请考虑给它一个 ⭐️</p>
  <p>Powered by Garbage Human Studio</p>
</div>
