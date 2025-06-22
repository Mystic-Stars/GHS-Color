# GHS Color Next

<div align="center">
  <img src="public/icons/ico.svg" alt="GHS Color Next" width="80" height="80">
  <h1>GHS Color Next</h1>
  <p>现代化色彩管理工具</p>
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
  ![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-14+-000000.svg)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)
</div>

## 📖 项目简介

GHS Color 是一款现代化的高颜值色彩管理工具，用于保存您和您的团队喜欢的颜色，即时迸发灵感。

## ✨ 主要特色

- **颜色库管理** - 对颜色实施分类管理
- **内置实用工具** - 多种颜色格式实时转化
- **优雅界面** - 中英文双语支持，明暗主题适配，响应式设计
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

3. **配置环境变量**
   ```bash
   # 编辑 .env.local 文件，配置您的颜色数据
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

### Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMystic-Stars%2FGHS-Color)

1. **点击上方部署按钮**
2. **连接GitHub账户**并授权Vercel访问
3. **Fork项目**到您的GitHub账户
4. **配置环境变量**：
   - 在Vercel部署页面的"Environment Variables"部分
   - 添加您的`.env.local`文件中的所有环境变量
   - 特别注意`NEXT_PUBLIC_COLORS`和`NEXT_PUBLIC_CATEGORIES`的JSON格式
5. **点击Deploy**开始部署
6. **等待部署完成**，通常需要1-3分钟

### 其他部署平台

项目也支持部署到其他平台：

- **Netlify**

- **Railway**

- **Cloudflare pages**

  ……

### 部署注意事项

- **环境变量**：确保在部署平台配置所有必要的环境变量
- **构建命令**：`npm run build`
- **启动命令**：`npm run start`

## 🎨 使用指南

### 基本操作

1. **浏览颜色** - 在主界面浏览所有可用颜色
2. **搜索颜色** - 使用搜索框按名称或标签查找颜色
3. **查看详情** - 点击颜色卡片查看详细信息和相似色彩
4. **复制颜色** - 点击颜色值快速复制到剪贴板
5. **格式转换** - 使用转换工具在不同颜色格式间转换

### 高级功能

- **收藏颜色** - 在颜色详情中收藏常用颜色
- **分类筛选** - 使用侧边栏按分类筛选颜色
- **主题切换** - 在设置中切换浅色/深色主题
- **语言切换** - 支持中英文界面切换
- **视图模式** - 选择网格、列表或紧凑视图键盘快捷键

## ⚙️ 配置说明

项目使用 `.env.local` 文件进行配置，主要包含以下配置项：

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

# 颜色数据（JSON格式）
NEXT_PUBLIC_COLORS='[{"id":"box-yellow","name":"Box Yellow",...}]'

# 分类数据（JSON格式）
NEXT_PUBLIC_CATEGORIES='[{"id":"brand","name":"Brand Colors",...}]'
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

### 颜色数据示例

```json
{
  "id": "box-yellow",
  "name": "Box Yellow",
  "nameZh": "盒子黄",
  "hex": "#f6dc50",
  "description": "The exclusive yellow color of BoxWorld, the logo color of GHS.",
  "descriptionZh": "盒王的专属黄色，GHS的标志颜色。",
  "category": "brand",
  "tags": ["yellow", "logo", "ghs"]
}
```

### 如何添加新颜色

1. **编辑 `.env.local` 文件**
2. **在 `NEXT_PUBLIC_COLORS` 数组中添加新的颜色对象**
3. **确保JSON格式正确**（注意逗号和引号）
4. **重启开发服务器**以加载新配置

```json
// 在 NEXT_PUBLIC_COLORS 数组中添加
{
  "id": "your-color-id",           // 唯一ID，使用小写和连字符
  "name": "Your Color Name",       // 英文名称
  "nameZh": "您的颜色名称",         // 中文名称
  "hex": "#ff6b6b",               // HEX颜色值
  "description": "English description",
  "descriptionZh": "中文描述",
  "category": "brand",            // 分类：brand/ui/team
  "tags": ["red", "vibrant"]     // 标签数组
}
```

### 注意事项

- **颜色ID必须唯一**，建议使用描述性的名称
- **HEX值必须以#开头**，使用6位十六进制格式
- **分类必须在CATEGORIES中存在**
- **JSON格式必须正确**，注意逗号和引号的使用

## 🤝 贡献指南

### 贡献新颜色

1. 点击应用中的"提交颜色"按钮
2. 按照指南在GitHub上创建Issue
3. 提供颜色的详细信息和用途说明
4. 等待维护者审核和合并

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
