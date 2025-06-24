# GHS Color Next - Docker 配置文件
# 多阶段构建，优化镜像大小和构建性能

# 阶段1: 依赖安装
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制包管理文件
COPY package.json package-lock.json* ./
# 安装依赖
RUN npm ci --only=production

# 阶段2: 构建应用
FROM node:18-alpine AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
# 复制源代码
COPY . .

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1

# 构建应用
RUN npm run build

# 阶段3: 运行时镜像
FROM node:18-alpine AS runner
WORKDIR /app

# 设置环境变量
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非root用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public

# 设置正确的权限
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制配置文件
COPY --from=builder --chown=nextjs:nodejs /app/config.js ./config.js

USER nextjs

# 暴露端口
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
