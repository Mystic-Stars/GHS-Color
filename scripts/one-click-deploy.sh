#!/bin/bash

# GHS Color Next - 一键部署脚本
# 直接从Docker Hub拉取预构建镜像，实现真正的一键部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
IMAGE_NAME="mysticstars/ghs-color"
CONTAINER_NAME="ghs-color"
DEFAULT_PORT="3000"

# 打印带颜色的消息
print_header() {
    echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  ${PURPLE}GHS Color Next - 一键部署${NC}        ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}  ${CYAN}现代化色彩管理工具${NC}              ${BLUE}║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查Docker是否安装
check_docker() {
    print_info "检查Docker环境..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装！"
        echo ""
        echo "请先安装Docker："
        echo "- Windows/macOS: https://www.docker.com/products/docker-desktop"
        echo "- Linux: https://docs.docker.com/engine/install/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker 服务未启动！"
        echo ""
        echo "请启动Docker服务："
        echo "- Windows/macOS: 启动 Docker Desktop"
        echo "- Linux: sudo systemctl start docker"
        exit 1
    fi
    
    print_success "Docker 环境检查通过"
}

# 停止并删除现有容器
cleanup_existing() {
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        print_info "发现现有容器，正在清理..."
        docker stop ${CONTAINER_NAME} &> /dev/null || true
        docker rm ${CONTAINER_NAME} &> /dev/null || true
        print_success "现有容器已清理"
    fi
}

# 拉取最新镜像
pull_image() {
    print_info "正在拉取最新镜像..."
    echo -e "${CYAN}镜像: ${IMAGE_NAME}:latest${NC}"
    
    if docker pull ${IMAGE_NAME}:latest; then
        print_success "镜像拉取成功"
    else
        print_error "镜像拉取失败"
        echo ""
        echo "可能的原因："
        echo "1. 网络连接问题"
        echo "2. Docker Hub 访问受限"
        echo "3. 镜像不存在"
        exit 1
    fi
}

# 获取端口配置
get_port() {
    echo ""
    echo -e "${YELLOW}端口配置${NC}"
    echo "默认端口: ${DEFAULT_PORT}"
    read -p "请输入要使用的端口 (直接回车使用默认端口): " user_port
    
    if [ -z "$user_port" ]; then
        PORT=${DEFAULT_PORT}
    else
        PORT=${user_port}
    fi
    
    # 检查端口是否被占用
    if netstat -tuln 2>/dev/null | grep -q ":${PORT} "; then
        print_warning "端口 ${PORT} 已被占用"
        read -p "是否继续使用此端口? (y/N): " continue_port
        if [[ ! $continue_port =~ ^[Yy]$ ]]; then
            echo "部署已取消"
            exit 1
        fi
    fi
}

# 启动容器
start_container() {
    print_info "正在启动容器..."

    # 基本环境变量
    ENV_VARS="-e NODE_ENV=production"
    ENV_VARS="$ENV_VARS -e NEXT_PUBLIC_APP_NAME=\"GHS Color Next\""
    ENV_VARS="$ENV_VARS -e NEXT_PUBLIC_APP_VERSION=\"2.0.0\""
    ENV_VARS="$ENV_VARS -e NEXT_PUBLIC_GITHUB_URL=\"https://github.com/Mystic-Stars/GHS-Color\""

    # 如果设置了颜色配置环境变量，则传递给容器
    if [ ! -z "$NEXT_PUBLIC_COLORS" ]; then
        ENV_VARS="$ENV_VARS -e NEXT_PUBLIC_COLORS=\"$NEXT_PUBLIC_COLORS\""
        print_info "使用自定义颜色配置"
    fi

    if [ ! -z "$NEXT_PUBLIC_CATEGORIES" ]; then
        ENV_VARS="$ENV_VARS -e NEXT_PUBLIC_CATEGORIES=\"$NEXT_PUBLIC_CATEGORIES\""
        print_info "使用自定义分类配置"
    fi

    # 启动容器
    eval "docker run -d \
        --name ${CONTAINER_NAME} \
        -p ${PORT}:3000 \
        --restart unless-stopped \
        $ENV_VARS \
        ${IMAGE_NAME}:latest"

    if [ $? -eq 0 ]; then
        print_success "容器启动成功"
    else
        print_error "容器启动失败"
        exit 1
    fi
}

# 等待服务启动
wait_for_service() {
    print_info "等待服务启动..."
    
    for i in {1..30}; do
        if curl -s http://localhost:${PORT} > /dev/null 2>&1; then
            print_success "服务已启动"
            return 0
        fi
        echo -n "."
        sleep 2
    done
    
    print_warning "服务启动超时，但容器可能仍在启动中"
}

# 显示部署结果
show_result() {
    echo ""
    echo -e "${GREEN}🎉 部署完成！${NC}"
    echo ""
    echo -e "${CYAN}访问信息:${NC}"
    echo -e "  🌐 应用地址: ${GREEN}http://localhost:${PORT}${NC}"
    echo -e "  📦 容器名称: ${CONTAINER_NAME}"
    echo -e "  🏷️  镜像版本: ${IMAGE_NAME}:latest"
    echo ""
    echo -e "${CYAN}管理命令:${NC}"
    echo -e "  查看日志: ${YELLOW}docker logs ${CONTAINER_NAME}${NC}"
    echo -e "  停止服务: ${YELLOW}docker stop ${CONTAINER_NAME}${NC}"
    echo -e "  启动服务: ${YELLOW}docker start ${CONTAINER_NAME}${NC}"
    echo -e "  删除容器: ${YELLOW}docker rm -f ${CONTAINER_NAME}${NC}"
    echo ""
    echo -e "${PURPLE}感谢使用 GHS Color Next！${NC}"
}

# 显示帮助信息
show_help() {
    echo "GHS Color Next - 一键部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -p, --port PORT    指定端口 (默认: 3000)"
    echo "  -h, --help         显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                 # 使用默认配置部署"
    echo "  $0 -p 8080         # 使用端口8080部署"
}

# 主函数
main() {
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--port)
                PORT="$2"
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_header
    
    # 执行部署步骤
    check_docker
    cleanup_existing
    pull_image
    
    # 如果没有通过参数指定端口，则交互式获取
    if [ -z "$PORT" ]; then
        get_port
    fi
    
    start_container
    wait_for_service
    show_result
}

# 执行主函数
main "$@"
