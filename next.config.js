/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // 启用严格模式
  reactStrictMode: true,
  // 启用SWC压缩
  swcMinify: true,
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // 支持Docker部署的standalone输出
  output: 'standalone',
}

module.exports = nextConfig
