# GHS Color Next - 颜色配置指南

本指南说明如何在Docker部署中自定义颜色配置。

## 📋 配置优先级

GHS Color Next 支持多种颜色配置方式，按优先级排序：

1. **环境变量** (最高优先级)
2. **config.js 文件** (默认)
3. **内置默认配置** (回退)

## 🎨 环境变量配置

### 颜色数据配置

使用 `NEXT_PUBLIC_COLORS` 环境变量来配置自定义颜色：

```bash
export NEXT_PUBLIC_COLORS='[
  {
    "id": "custom-red",
    "name": "Custom Red",
    "nameZh": "自定义红色",
    "hex": "#ff0000",
    "description": "A custom red color",
    "descriptionZh": "自定义的红色",
    "category": "brand",
    "tags": ["red", "custom"]
  },
  {
    "id": "custom-blue",
    "name": "Custom Blue", 
    "nameZh": "自定义蓝色",
    "hex": "#0000ff",
    "description": "A custom blue color",
    "descriptionZh": "自定义的蓝色",
    "category": "ui",
    "tags": ["blue", "custom"]
  }
]'
```

### 分类数据配置

使用 `NEXT_PUBLIC_CATEGORIES` 环境变量来配置自定义分类：

```bash
export NEXT_PUBLIC_CATEGORIES='[
  {
    "id": "brand",
    "name": "Brand Colors",
    "nameZh": "品牌色",
    "description": "Primary brand colors",
    "icon": "🎨",
    "color": "#6366F1",
    "order": 1
  },
  {
    "id": "ui",
    "name": "UI Colors",
    "nameZh": "UI色彩", 
    "description": "User interface colors",
    "icon": "🖥️",
    "color": "#10B981",
    "order": 2
  }
]'
```

## 🐳 Docker 部署配置

### 方式一：Docker Run 命令

```bash
docker run -d \
  -p 3000:3000 \
  --name ghs-color \
  -e NEXT_PUBLIC_COLORS='[{"id":"my-red","name":"My Red","nameZh":"我的红色","hex":"#ff0000","description":"My custom red","descriptionZh":"我的自定义红色","category":"brand","tags":["red"]}]' \
  -e NEXT_PUBLIC_CATEGORIES='[{"id":"brand","name":"Brand","nameZh":"品牌","description":"Brand colors","icon":"🎨","color":"#6366F1","order":1}]' \
  mysticstars/ghs-color:latest
```

### 方式二：Docker Compose

编辑 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  ghs-color:
    image: mysticstars/ghs-color:latest
    container_name: ghs-color
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_COLORS=[{"id":"my-red","name":"My Red","nameZh":"我的红色","hex":"#ff0000","description":"My custom red","descriptionZh":"我的自定义红色","category":"brand","tags":["red"]}]
      - NEXT_PUBLIC_CATEGORIES=[{"id":"brand","name":"Brand","nameZh":"品牌","description":"Brand colors","icon":"🎨","color":"#6366F1","order":1}]
    restart: unless-stopped
```

### 方式三：环境变量文件

创建 `.env` 文件：

```bash
# .env
NEXT_PUBLIC_COLORS=[{"id":"my-red","name":"My Red","nameZh":"我的红色","hex":"#ff0000","description":"My custom red","descriptionZh":"我的自定义红色","category":"brand","tags":["red"]}]
NEXT_PUBLIC_CATEGORIES=[{"id":"brand","name":"Brand","nameZh":"品牌","description":"Brand colors","icon":"🎨","color":"#6366F1","order":1}]
```

然后使用：

```bash
docker run -d \
  -p 3000:3000 \
  --name ghs-color \
  --env-file .env \
  mysticstars/ghs-color:latest
```

### 方式四：使用一键部署脚本

```bash
# 设置环境变量
export NEXT_PUBLIC_COLORS='[{"id":"my-red","name":"My Red","nameZh":"我的红色","hex":"#ff0000","description":"My custom red","descriptionZh":"我的自定义红色","category":"brand","tags":["red"]}]'

# 运行一键部署脚本
curl -fsSL https://raw.githubusercontent.com/Mystic-Stars/GHS-Color/main/scripts/one-click-deploy.sh | bash
```

## 📝 数据格式说明

### 颜色对象格式

```typescript
interface Color {
  id: string;                    // 唯一标识符，必须唯一
  name: string;                  // 英文名称
  nameZh: string;               // 中文名称
  hex: string;                  // HEX颜色值，格式：#rrggbb
  description: string;          // 英文描述
  descriptionZh: string;        // 中文描述
  category: string;             // 分类ID，必须在categories中存在
  tags: string[];              // 标签数组
}
```

### 分类对象格式

```typescript
interface Category {
  id: string;                   // 分类ID，必须唯一
  name: string;                 // 英文名称
  nameZh: string;              // 中文名称
  description: string;          // 描述
  icon: string;                // 图标（emoji）
  color: string;               // 分类代表色（HEX格式）
  order: number;               // 排序权重
}
```

## 🛠️ 实用工具

### JSON 格式化

使用在线工具格式化JSON：
- [JSONLint](https://jsonlint.com/)
- [JSON Formatter](https://jsonformatter.curiousconcept.com/)

### 颜色选择器

- [Adobe Color](https://color.adobe.com/)
- [Coolors](https://coolors.co/)
- [Color Hunt](https://colorhunt.co/)

### 配置生成器

应用内置了颜色配置生成器，可以在"实用工具"页面找到，帮助您生成正确格式的配置。

## 📋 示例配置

### 完整示例

```json
{
  "colors": [
    {
      "id": "primary-blue",
      "name": "Primary Blue",
      "nameZh": "主蓝色",
      "hex": "#007bff",
      "description": "Primary brand blue color",
      "descriptionZh": "主要品牌蓝色",
      "category": "brand",
      "tags": ["blue", "primary", "brand"]
    },
    {
      "id": "success-green",
      "name": "Success Green",
      "nameZh": "成功绿",
      "hex": "#28a745",
      "description": "Success state color",
      "descriptionZh": "成功状态颜色",
      "category": "ui",
      "tags": ["green", "success", "ui"]
    }
  ],
  "categories": [
    {
      "id": "brand",
      "name": "Brand Colors",
      "nameZh": "品牌色",
      "description": "Primary brand colors",
      "icon": "🎨",
      "color": "#007bff",
      "order": 1
    },
    {
      "id": "ui",
      "name": "UI Colors",
      "nameZh": "界面色",
      "description": "User interface colors",
      "icon": "🖥️",
      "color": "#28a745",
      "order": 2
    }
  ]
}
```

### 最小示例

```json
{
  "colors": [
    {
      "id": "red",
      "name": "Red",
      "nameZh": "红色",
      "hex": "#ff0000",
      "description": "Red color",
      "descriptionZh": "红色",
      "category": "basic",
      "tags": ["red"]
    }
  ],
  "categories": [
    {
      "id": "basic",
      "name": "Basic",
      "nameZh": "基础",
      "description": "Basic colors",
      "icon": "🎨",
      "color": "#666666",
      "order": 1
    }
  ]
}
```

## ⚠️ 注意事项

1. **JSON格式**：确保JSON格式正确，使用双引号
2. **唯一ID**：颜色和分类的ID必须唯一
3. **HEX格式**：颜色值必须是有效的HEX格式（#rrggbb）
4. **分类关联**：颜色的category字段必须对应存在的分类ID
5. **环境变量长度**：某些系统对环境变量长度有限制
6. **特殊字符**：在shell中使用时注意转义特殊字符

## 🔧 故障排除

### 配置不生效

1. 检查JSON格式是否正确
2. 确认环境变量名称正确
3. 重启容器使配置生效
4. 查看容器日志：`docker logs ghs-color`

### JSON格式错误

```bash
# 验证JSON格式
echo '$NEXT_PUBLIC_COLORS' | python -m json.tool
```

### 查看当前配置

```bash
# 查看容器环境变量
docker exec ghs-color env | grep NEXT_PUBLIC
```

---

通过环境变量配置，您可以轻松地在Docker部署中自定义颜色数据，无需修改镜像内的文件。
